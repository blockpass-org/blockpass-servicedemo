const config = require('../../configs')
const express = require('express')
const multer = require('multer');
const utils = require('../../utils/index')
const BlockPassServerSDK = require('../../cores/blockpass/ServerSdk');
const RequireParams = require('../../middlewares/requireParams');
const RequireToken = require('../../middlewares/requireToken');
const KYCModel = require('../../models/KYCModel');
const CertificateModel = require('../../models/CertificateModel');
const router = express.Router()
const { REQUIRED_FIELDS, OPTIONAL_FIELDS, CROSS_DB_FIELD_MAPS, FIELD_TYPE_MAPS } = require('./_config');

const upload = multer();
const GridFsFileStorage = require('../../models/GridFsFileStorage');

//-------------------------------------------------------------------------
//  Blockpass Server SDK
//-------------------------------------------------------------------------
const serverSdk = new BlockPassServerSDK({
    clientId: config.BLOCKPASS_CLIENT_ID,
    secretId: config.BLOCKPASS_SECRET_ID,
    requiredFields: REQUIRED_FIELDS,
    optionalFields: OPTIONAL_FIELDS,

    // Custom implement
    findKycById: findKycById,
    createKyc: createKyc,
    updateKyc: updateKyc,
    needRecheckExitingKyc: needRecheckExitingKyc,
    generateSsoPayload: generateSsoPayload
    
})
//-------------------------------------------------------------------------
//  Logic Handler
//-------------------------------------------------------------------------
async function findKycById(kycId) {
    return await KYCModel.findOne({ blockPassID: kycId }).exec()
}

//-------------------------------------------------------------------------
async function createKyc({ kycProfile }) {
    const { id, smartContractId, rootHash, isSynching } = kycProfile;
    const newIns = new KYCModel({
        blockPassID: id,
        rootHash,
        smartContractId,
        isSynching
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

        if (metaData.type == 'string')
            return kycRecord[CROSS_DB_FIELD_MAPS[key]] = metaData.value

        const { buffer, originalname } = metaData;
        const ext = originalname.split('.')[1];
        const fileName = `${id}_${key}.${ext}`;
        const fileHandler = await GridFsFileStorage.writeFile({
            fileName,
            mimetype: `image/${ext}`,
            fileBuffer: buffer
        })

        return kycRecord[CROSS_DB_FIELD_MAPS[key]] = fileHandler._id
    })

    const waitingJob = await Promise.all(jobs);

    kycRecord.bpToken = kycToken
    kycRecord.rootHash = rootHash
    kycRecord.smartContractId = smartContractId
    kycRecord.isSynching = isSynching

    return await kycRecord.save()
}

//-------------------------------------------------------------------------
// Recheck exiting record for many situation
//  - Required submit critical fields (client crash | network error ) 
//  - Periodical Check approved record
//  - Submit more data
//-------------------------------------------------------------------------
async function needRecheckExitingKyc({ kycProfile, kycRecord, payload }) {

    if (!(kycRecord.fristName && kycRecord.phone && kycRecord.lastName))
        return {
            ...payload,
            nextAction: 'upload',
            requiredFields: REQUIRED_FIELDS,
            optionalFields: OPTIONAL_FIELDS,
        }

    return payload;
}

//-------------------------------------------------------------------------
async function generateSsoPayload({ kycProfile, kycRecord, kycToken, payload }) {
    return {
        _id: kycRecord._id,
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
                userRawData[key] = {
                    type: 'string',
                    value: userRawFields[key]
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
require('./certificate')(router, serverSdk)
require('./review')(router, serverSdk)
require('./validation')(router, serverSdk)

module.exports = router