const _config = require('../../../configs')
const blockpassSDKMock = require('../../../cores//blockpass/utils/_unitTestMock');
const ServerSdk = require('../../../cores/blockpass/ServerSdk');
const FAKE_SERVICE_META_DATA = require('../../_http-mock/serviceMetadata.json')
const FAKE_CER_SCHEMA_DATA = require('../../_http-mock/cerSchema.json')
const utils = require('../../../utils')
const CROSS_DB_FIELD_MAPS = require('../../../controllers/blockPass/_config')

const chai = require('chai');
const sinon = require('sinon');
const should = chai.should();

const kycRecord = {
    "_id": ("5af0177bbd229532ee778bd1"),
    "bpProfile": {
        "rootHash": "2c2bf09e2c70646bbf95e1837b9dedd3fdbd2ff3b43ce94ab297cd13bfc0a517",
        "smartContractId": "c079c6d0-51ca-11e8-867c-5f1e018c6d4a",
        "isSynching": true
    },
    "status": "waiting",
    "blockPassID": "5af005d345186d429b4a1205",
    "createdAt": new Date("2018-05-07T09:08:11.693Z"),
    "updatedAt": new Date("2018-05-07T09:08:13.317Z"),
    "__v": 0,
    "bpToken": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJCTE9DS1BBU1MiLCJzdWIiOiI1YWYwMDVkMzQ1MTg2ZDQyOWI0YTEyMDUiLCJhdWQiOiIzcmRfc2VydmljZV9kZW1vX2xvY2FsaG9zdCIsImV4cCI6MTUyNTcwNzY5MiwiaWF0IjoxNTI1Njg0MDkyLCJqdGkiOiI4YjVlZjY1MzI4Y2RiNzUzMDk0MWNlMDg4OTVkOTAyMSJ9.FfQ9kNNrOgQGVfoJtG8E71HtbiXSIHtlhLsoV9z6g6A",
        "refresh_token": "8b5ef65328cdb7530941ce08895d9021",
        "expires_at": new Date("3019-05-07T10:08:13.315Z")
    },
    "certs": {
        "onfidoCertificate": "{\"@context\":{\"schema\":\"http://blockpass.org/api/\",\"given_name\":\"schema:given_name\",\"family_name\":\"schema:family_name\",\"address\":\"schema:address\",\"dob\":\"schema:dob\",\"phone\":\"schema:phone\",\"passport\":\"schema:passport\",\"selfie\":\"schema:selfie\",\"proof_of_address\":\"schema:proof_of_address\"},\"@type\":\"Person\",\"@did\":\"bp:5af004529c80f63b857c12b1\",\"service\":{\"name\":\"Onfido\",\"logo\":\"/api/private/image/onfido_cert_logo.png\",\"thumbnail\":\"/api/private/image/onfido_cert_thumbnail.png\"},\"given_name\":\"10ff985cae895047ecedf9c5d4b6f6d7c74cc435764a3dffcc1f81ced68ddbe6\",\"family_name\":\"df6e4f589aaaa45c8dbcdb85cd55b96026648503dd22226aec2a08971c939fc0\",\"address\":\"0883f438901d690992b83a8a1012939c264a523affdeb1bebb2c9b0f97186442\",\"dob\":\"541ddcb3d7eb18395794ba8bf0292a5aef2f2aed53f9fe68ef84d9058cc41dd3\",\"phone\":\"46434f7d8d2d7ea1db558f850f78664503f2cdd6d06b6711633e7be337c66191\",\"passport\":\"32bf2fdaeae4b8c99b9e5132d36fb7ea1975137567dc7c301cdac102c52191de\",\"selfie\":\"4361e18fb3889cb8b1ebb0d6e53f84d1e19a6b55595e4f6da1cf6f616f81704e\",\"proof_of_address\":\"56723dc21e39e94e42d4e46685656a067908045f7d3f2a89dc64f5e195c9389d\",\"onfido_report\":{\"result\":\"clear\",\"breakdown\":{\"visual_authenticity\":{\"result\":\"clear\",\"breakdown\":{\"other\":{\"result\":\"clear\"},\"face_detection\":{\"result\":\"clear\"}}},\"data_consistency\":{\"result\":\"clear\",\"breakdown\":{\"document_type\":{\"result\":\"clear\"},\"nationality\":{\"result\":\"clear\"},\"date_of_expiry\":{\"result\":\"clear\"},\"date_of_birth\":{\"result\":\"clear\"},\"document_numbers\":{\"result\":\"clear\"},\"gender\":{\"result\":\"clear\"},\"last_name\":{\"result\":\"clear\"},\"first_name\":{\"result\":\"clear\"},\"issuing_country\":{\"result\":\"clear\"}}},\"image_integrity\":{\"result\":\"clear\",\"breakdown\":{\"image_quality\":{\"result\":\"clear\"},\"supported_document\":{\"result\":\"clear\"}}},\"police_record\":{\"result\":\"clear\"},\"data_validation\":{\"result\":\"clear\",\"breakdown\":{\"expiry_date\":{\"result\":\"clear\"},\"date_of_birth\":{\"result\":\"clear\"},\"document_expiration\":{\"result\":\"clear\"},\"document_numbers\":{\"result\":\"clear\"},\"gender\":{\"result\":\"clear\"},\"mrz\":{\"result\":\"clear\"}}},\"data_comparison\":{\"result\":\"clear\",\"breakdown\":{\"document_type\":{\"result\":\"clear\"},\"date_of_expiry\":{\"result\":\"clear\"},\"date_of_birth\":{\"result\":\"clear\"},\"document_numbers\":{\"result\":\"clear\"},\"gender\":{\"result\":\"clear\"},\"last_name\":{\"result\":\"clear\"},\"first_name\":{\"result\":\"clear\"},\"issuing_country\":{\"result\":\"clear\"}}}},\"variant\":\"standard\",\"created_at\":\"2018-04-16T10:04:06Z\",\"name\":\"document\",\"sub_result\":\"clear\",\"status\":\"complete\"}}"
    },
    "identities": {
        "email": "test-cer@dev.com"
    },
    "reviews": {}
}

describe("blockpass sdk sign certificate", function () {

    const serverSdk = new ServerSdk({
        baseUrl: process.env.BLOCKPASS_BASE_URL,
        clientId: 'test',
        secretId: 'test',
        requiredFields: [],
        optionalFields: [],
        findKycById: _ => { },
        createKyc: _ => { },
        updateKyc: _ => { },
        queryKycStatus: _ => { }
    })

    after(() => {
        blockpassSDKMock.clearAll();
    })

    it('[happy] sign valid certificate', async function () {

        const clientId = 'test'
        const certificateType = 'demo-service-cert'


        blockpassSDKMock.mockQueryServiceMetadata(process.env.BLOCKPASS_BASE_URL, clientId, FAKE_SERVICE_META_DATA)
        blockpassSDKMock.mockQueryCertificateSchema(process.env.BLOCKPASS_BASE_URL, certificateType, FAKE_CER_SCHEMA_DATA, 3)
        blockpassSDKMock.mockSignCertificate(process.env.BLOCKPASS_BASE_URL, {
            status: 'success'
        })

        const organizationInfo = {
            identifier: '3rd_service_demo_localhost',
            legalName: 'Demo Organization',
            logo: 'http://www.dummymag.com//media/img/dummy-logo.png',
        }

        const { bpToken } = kycRecord
        const EcdsaPrivateKey = _config.CERTIFICATE_SIGN_PRIVATE
        const EcdaPublicKey = _config.CERTIFICATE_SIGN_PUBLIC

        const hashIdentities = Object.keys(kycRecord.identities)
            .reduce((acc, key) => {
                const hashVal = utils.sha256Hash(kycRecord.identities[key])
                const bpKey = CROSS_DB_FIELD_MAPS[key]
                if (!bpKey)
                    return acc;
                acc[bpKey] = hashVal
                return acc
            }, {})

        const entityInfo = {
            ...hashIdentities,
            rootHash: utils.sha256Hash(kycRecord.bpProfile.rootHash),
            scId: utils.sha256Hash(kycRecord.bpProfile.smartContractId)
        }

        const claimInfo = {
            reviewBody: `review by ${kycRecord.reviewer}`,
            accessMode: "A",
            issueDate: (new Date()).toISOString()
        }

        // sign certs
        const res = await serverSdk.signCertificate({
            id: certificateType,
            entityInfo,
            organizationInfo,
            claimInfo,
            EcdsaPrivateKey,
            EcdaPublicKey,

            bpToken
        })

        res.res.status.should.equal('success')
        
        blockpassSDKMock.checkPending();

        return Promise.resolve(0);
    })
})