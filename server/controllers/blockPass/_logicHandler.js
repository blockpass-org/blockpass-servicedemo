const config = require('../../configs')
const utils = require('../../utils/index')
const KYCModel = require('../../models/KYCModel');
const SettingModel = require('../../models/SettingModel');
const Events = require('../../models/events');
const CertificateModel = require('../../models/CertificateModel');

const GridFsFileStorage = require('../../models/GridFsFileStorage');
const BlockPassServerSDK = require('../../cores/blockpass/ServerSdk');

const { CROSS_DB_FIELD_MAPS } = require('./_config');

//-------------------------------------------------------------------------
//  Blockpass Server SDK
//-------------------------------------------------------------------------
let serverSdk
let currentSettings;

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
        message: kycRecord.summary,
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

    const changeLogs = []
    const reviewStatus = {}

    const jobs = Object.keys(userRawData).map(async (key) => {
        if (CROSS_DB_FIELD_MAPS[key] === undefined)
            throw new Error('Missing map fields ' + key);

        const metaData = userRawData[key];


        if (metaData.type == 'string') {

            // update certificate
            if (metaData.isCert) {
                if (kycRecord.certs == null)
                    kycRecord.certs = {}

                changeLogs.push({
                    slug: CROSS_DB_FIELD_MAPS[key],
                    old: kycRecord.certs[CROSS_DB_FIELD_MAPS[key]],
                    new: metaData.value,
                    type: "certificates"
                })

                // update field status
                const slug = CROSS_DB_FIELD_MAPS[key]
                reviewStatus[slug] = {
                    status: 'received',
                    updatedAt: new Date()
                }

                return kycRecord.certs[slug] = metaData.value
            }
            else {

                changeLogs.push({
                    slug: CROSS_DB_FIELD_MAPS[key],
                    old: kycRecord.identities[CROSS_DB_FIELD_MAPS[key]],
                    new: metaData.value,
                    type: "identities"
                })

                // update field status
                const slug = CROSS_DB_FIELD_MAPS[key]
                reviewStatus[slug] = {
                    status: 'received',
                    updatedAt: new Date()
                }

                return kycRecord.identities[slug] = metaData.value
            }
        }

        const { buffer, originalname } = metaData;
        const ext = originalname.split('.')[1];
        const fileName = `${id}_${key}.${ext}`;
        const fileHandler = await GridFsFileStorage.writeFile({
            fileName,
            mimetype: `image/${ext}`,
            fileBuffer: buffer,
            metadata: {
                recordId: kycRecord._id
            }
        })

        changeLogs.push({
            slug: CROSS_DB_FIELD_MAPS[key],
            old: kycRecord.identities[CROSS_DB_FIELD_MAPS[key]],
            new: fileHandler._id,
            type: "identities",
            isFile: true
        })

        const slug = CROSS_DB_FIELD_MAPS[key]
        reviewStatus[slug] = {
            status: 'received',
            updatedAt: new Date()
        }

        return kycRecord.identities[CROSS_DB_FIELD_MAPS[key]] = fileHandler._id
    })

    const waitingJob = await Promise.all(jobs);

    const expiredDate = new Date(Date.now() + kycToken.expires_in * 1000)

    kycRecord.bpToken = {
        ...kycToken,
        expires_at: expiredDate
    }
    kycRecord.bpProfile.rootHash = rootHash
    kycRecord.bpProfile.smartContractId = smartContractId
    kycRecord.bpProfile.isSynching = isSynching

    // marked as waiting for review
    kycRecord.status = 'waiting'
    kycRecord.waitingUserResubmit = false;

    // inc submit number
    let currentNum = 0
    if (kycRecord.submitCount != null)
        currentNum = kycRecord.submitCount

    kycRecord.submitCount = currentNum + 1
    kycRecord.reviews = {
        ...kycRecord.reviews,
        ...reviewStatus
    }

    // record activity logs
    utils.userActivityLog({
        recordId: kycRecord._id,
        message: 'record-waiting',
        extra: {
            submitCount: kycRecord.submitCount,
            changeLogs
        }
    })

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
        if (status.status === "missing" || status.status === "rejected")
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

module.exports = getServerSdk;