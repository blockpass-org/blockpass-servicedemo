const config = require('../../configs')
const express = require('express')
const multer = require('multer');
const utils = require('../../utils/index')
const BlockPassServerSDK = require('../../cores/blockpass/ServerSdk');
const RequireParams = require('../../middlewares/requireParams');
const RequireToken = require('../../middlewares/requireToken');
const KYCModel = require('../../models/KYCModel');
const SettingModel = require('../../models/SettingModel');
const Events = require('../../models/events');
const CertificateModel = require('../../models/CertificateModel');
const router = express.Router()
const { CROSS_DB_FIELD_MAPS } = require('./_config');

const upload = multer();
const GridFsFileStorage = require('../../models/GridFsFileStorage');

let serverSdk
let currentSettings;

//-------------------------------------------------------------------------
//  Blockpass Server SDK
//-------------------------------------------------------------------------

function getServerSdk() {
    return serverSdk
}

function _parseSettings(settings) {
    const { fields } = settings;
    const requiredFields = fields[0].value.split(',')
    const optionalFields = fields[1].value.split(',')
    const certs = fields[2].value.split(',')

    return {
        requiredFields,
        optionalFields,
        certs
    }
}

function _initNewSdk({ requiredFields, optionalFields, certs }) {
    utils.activityLog('[blockpass-sdk-init]', { requiredFields, optionalFields, certs })

    serverSdk = new BlockPassServerSDK({
        baseUrl: config.BLOCKPASS_BASE_URL,
        clientId: config.BLOCKPASS_CLIENT_ID,
        secretId: config.BLOCKPASS_SECRET_ID,
        requiredFields: requiredFields,
        optionalFields: optionalFields,
        certs: certs,

        // Custom implement
        findKycById: findKycById,
        createKyc: createKyc,
        updateKyc: updateKyc,
        queryKycStatus: queryKycStatus,

        needRecheckExistingKyc: needRecheckExistingKyc,
        generateSsoPayload: generateSsoPayload
    })
}

function refreshSettings() {
    SettingModel.findById('blockpass-settings').exec()
        .then(settings => {

            // 1st time setup
            if (!settings) {
                _initNewSdk({
                    requiredFields: config.DEFAULT_REQUIRED_FIELDS,
                    optionalFields: config.DEFAULT_OPTIONAL_FIELDS,
                    certs: config.DEFAULT_CERTS
                })
                return;
            }

            currentSettings = _parseSettings(settings);
            const { requiredFields, optionalFields, certs } = currentSettings;

            _initNewSdk({ requiredFields, optionalFields, certs })
        })
}

// 1st refresh settings
refreshSettings();
Events.sub('onSettingChange', key => {
    if (key === 'blockpass-settings')
        refreshSettings();
})

//-------------------------------------------------------------------------
//  Logic Handler
//-------------------------------------------------------------------------
async function findKycById(kycId) {
    return await KYCModel.findOne({ blockPassID: kycId }).exec()
}

//-------------------------------------------------------------------------
async function queryKycStatus({ kycRecord }) {

    const identitiesStatus = []
    serverSdk.requiredFields.forEach(key => {
        const slug = key
        const dbField = CROSS_DB_FIELD_MAPS[key]
        const status = kycRecord.fieldStatus(dbField)

        identitiesStatus.push({
            slug,
            ...status
        })
    })

    serverSdk.optionalFields.forEach(key => {
        const slug = key
        const dbField = CROSS_DB_FIELD_MAPS[key]
        const val = kycRecord.identities[dbField]
        const status = kycRecord.fieldStatus(dbField)

        if (val) {
            identitiesStatus.push({
                slug,
                ...status
            })
        }
    })

    const certsStatus = []
    if (kycRecord.certs) {
        serverSdk.certs.forEach(key => {
            const slug = key
            const dbField = CROSS_DB_FIELD_MAPS[key]
            const val = kycRecord.certs[dbField]
            const status = kycRecord.certStatus(dbField)

            if (val)
                certsStatus.push({
                    slug,
                    ...status
                })
        })
    }

    return {
        status: kycRecord.status,
        identities: identitiesStatus,
        certificates: certsStatus,
        message: "",
        createdDate: kycRecord.createdAt
    }
}

//-------------------------------------------------------------------------
async function createKyc({ kycProfile }) {
    const { id, smartContractId, rootHash, isSynching } = kycProfile;
    const newIns = new KYCModel({
        blockPassID: id,
        bpProfile: {
            rootHash,
            smartContractId,
            isSynching
        }
    })

    return await newIns.save()
}

//-------------------------------------------------------------------------
async function updateKyc({
    kycRecord,
    kycProfile,
    kycToken,
    userRawData
}) {
    const { id, smartContractId, rootHash, isSynching } = kycProfile;

    const jobs = Object.keys(userRawData).map(async (key) => {
        if (CROSS_DB_FIELD_MAPS[key] === undefined)
            throw new Error('Missing map fields ' + key);

        const metaData = userRawData[key];

        if (metaData.type == 'string') {

            // update certificate
            if (metaData.isCert) {
                if (kycRecord.certs == null)
                    kycRecord.certs = {}
                return kycRecord.certs[CROSS_DB_FIELD_MAPS[key]] = metaData.value
            }
            else
                return kycRecord.identities[CROSS_DB_FIELD_MAPS[key]] = metaData.value
        }

        const { buffer, originalname } = metaData;
        const ext = originalname.split('.')[1];
        const fileName = `${id}_${key}.${ext}`;
        const fileHandler = await GridFsFileStorage.writeFile({
            fileName,
            mimetype: `image/${ext}`,
            fileBuffer: buffer
        })

        return kycRecord.identities[CROSS_DB_FIELD_MAPS[key]] = fileHandler._id
    })

    const waitingJob = await Promise.all(jobs);

    kycRecord.bpToken = kycToken
    kycRecord.bpProfile.rootHash = rootHash
    kycRecord.bpProfile.smartContractId = smartContractId
    kycRecord.bpProfile.isSynching = isSynching

    return await kycRecord.save()
}

//-------------------------------------------------------------------------
// Recheck exiting record for many situation
//  - Required submit critical fields (client crash | network error ) 
//  - Periodical Check approved record
//  - Submit more data
//-------------------------------------------------------------------------
async function needRecheckExistingKyc({ kycProfile, kycRecord, payload }) {

    const missingList = []
    serverSdk.requiredFields.forEach(key => {
        const slug = key
        const dbField = CROSS_DB_FIELD_MAPS[key]
        const status = kycRecord.fieldStatus(dbField)
        if (status.status === "missing")
            missingList.push(key)
    })

    if (missingList.length !== 0)
        return {
            ...payload,
            nextAction: 'upload',
            requiredFields: missingList,
            optionalFields: [],
            certs: serverSdk.certs,
        }

    return payload;
}

//-------------------------------------------------------------------------
async function generateSsoPayload({ kycProfile, kycRecord, kycToken, payload }) {

    const { etherAddress } = kycRecord;
    const servicePayload = {
        action: 'none',
        accessToken: kycRecord._id
    }

    if (!etherAddress) {
        servicePayload.action = 'submit-extra'
    }

    return {
        ...servicePayload,
        record: kycRecord.toObject(),
    }
}

//-------------------------------------------------------------------------
// Api
//-------------------------------------------------------------------------
router.post('/api/uploadData',
    upload.any(),
    RequireParams(["accessToken", "slugList"]),
    async (req, res) => {
        try {
            const { accessToken, slugList, ...userRawFields } = req.body;
            const files = req.files || [];

            // Flattern user data
            const userRawData = {}

            Object.keys(userRawFields).forEach(key => {
                const originalKey = key
                const isCert = key.startsWith('[cer]')
                if (isCert)
                    key = key.slice('[cer]'.length)

                userRawData[key] = {
                    type: 'string',
                    value: userRawFields[originalKey],
                    isCert
                }
            })

            files.forEach(itm => {
                userRawData[itm.fieldname] = {
                    type: 'file',
                    ...itm
                }
            })

            const payload = await serverSdk.updateDataFlow({ accessToken, slugList, ...userRawData })
            return res.json(payload)

        } catch (ex) {
            console.log(ex);
            return utils.responseError(res, 403, ex.message)
        }
    })

//-------------------------------------------------------------------------
router.post('/api/login', RequireParams(["code", "sessionCode"]), async (req, res) => {
    try {
        const code = req.body.code
        const sessionCode = req.body.sessionCode;

        const payload = await serverSdk.loginFow({ code, sessionCode })
        return res.json(payload)
    } catch (ex) {
        console.log(ex);
        return utils.responseError(res, 403, ex.message)
    }

})

//-------------------------------------------------------------------------
router.post('/api/register', RequireParams(["code"]), async (req, res) => {
    try {
        const code = req.body.code
        const sessionCode = req.body.sessionCode;

        const payload = await serverSdk.registerFlow({ code })
        return res.json(payload)
    } catch (ex) {
        console.log(ex);
        return utils.responseError(res, 403, ex.message)
    }
})

//-------------------------------------------------------------------------
router.post('/api/status', RequireParams(["code"]), async (req, res) => {
    try {
        const code = req.body.code
        const sessionCode = req.body.sessionCode;

        const payload = await serverSdk.queryStatusFlow({ code })
        return res.json(payload)
    } catch (ex) {
        console.log(ex);
        return utils.responseError(res, 403, ex.message)
    }
})


//-------------------------------------------------------------------------
// Index page
router.get('/', (req, res) => {
    const sak = req.query.sak;
    if (!sak)
        return utils.responseError(res, 400, 'Missing user infomation');

    res.json({
        message: 'Hello',
        sak: sak
    })
})

// sub modules
require('./certificate')(router, getServerSdk)
require('./review')(router, getServerSdk)
require('./validation')(router, getServerSdk)

module.exports = router