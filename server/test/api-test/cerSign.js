const _config = require('../../configs')
const ServerSdk = require('../../cores/blockpass/ServerSdk');
const utils = require('../../utils/index');
const { CROSS_DB_FIELD_MAPS } = require('../../controllers/blockPass/_config');

const serverSdk = new ServerSdk({
    baseUrl: 'https://sandbox-api.blockpass.org',
    clientId: 'developer_service',
    secretId: 'developer_service',
    requiredFields: ['phone'],
    optionalFields: [],
    findKycById: _ => { },
    createKyc: _ => { },
    updateKyc: _ => { },
    queryKycStatus: _ => { }
})

const DUMMY_DATA = {
    "_id": ("5af420cda51228aa0c402b95"),
    "bpProfile": {
        "rootHash": "473a070db59d8a3a9b7de6c973ddeb999b42ed8ef9e49f5b381732623b3082aa",
        "smartContractId": "0xadf0b4720d14df0b6dbf456536b0b5fd2b8f23a6fcda928893991c245c79b5d6",
        "isSynching": false
    },
    "status": "waiting",
    "blockPassID": "5af420cd417d6f3852324918",
    "createdAt": new Date("2018-05-10T10:37:01.051Z"),
    "updatedAt": new Date("2018-05-10T10:37:02.452Z"),
    "__v": 0,
    "bpToken": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJCTE9DS1BBU1MiLCJzdWIiOiI1YjBjY2QzYWFjZjg1ZTNhMWFlZTQyOTgiLCJhdWQiOiJkZXZlbG9wZXJfc2VydmljZSIsImV4cCI6MTUyNzgxMDEyMCwiaWF0IjoxNTI3NTc0MTIwLCJqdGkiOiJmYzEwMTM4YWJhZDBhYjA5OTBjOTM4OWQwOWM1M2MzZSJ9.Z3kjvILy-Cyz0NOT0_W8T1F_9bXGs22eEq07P8PazrM",
        "refresh_token": "fc10138abad0ab0990c9389d09c53c3e",
        "expires_at": new Date("2018-05-29T07:08:46.091Z")
    },
    "certs": {
        "onfidoCertificate": "{\"@context\":{\"schema\":\"http://blockpass.org/api/\",\"given_name\":\"schema:given_name\",\"family_name\":\"schema:family_name\",\"address\":\"schema:address\",\"dob\":\"schema:dob\",\"phone\":\"schema:phone\",\"passport\":\"schema:passport\",\"selfie\":\"schema:selfie\",\"proof_of_address\":\"schema:proof_of_address\"},\"@type\":\"Person\",\"@did\":\"bp:5af42063417d6f385232490b\",\"service\":{\"name\":\"Onfido\",\"logo\":\"/api/private/image/onfido_cert_logo.png\",\"thumbnail\":\"/api/private/image/onfido_cert_thumbnail.png\"},\"given_name\":\"12dcac5504d66b063cee1019d9ad07a9c4c72ffb532f50922a1cb4b9403df8e8\",\"family_name\":\"fbf06b187e52ede70c4ec9b6acc5e78e29dd60f28062e7acec58f97f16297cdd\",\"address\":\"821cd8a0a28feb1ad15a07c68b30ee01e9ae48fc31cb1d9a4aaae701006c9855\",\"dob\":\"1cc680fb588eb62c5bd9f4d38c25329705ddf1ea71db0c77d6310d1378929701\",\"phone\":\"d6c1a97954f285d20dd6c66955c5a53cc1248b17fba234dbaf51e40fbaf59b3b\",\"passport\":\"bee748f869ad45ee32e8368befdcf1b4a2a261b53781ab692f5f04f26190e19a\",\"selfie\":\"e7886d125459a191ffa9d7b3fbf5254db876430b3da59a2c1dbf41f1a0964dc6\",\"proof_of_address\":\"0fd4c50d96893995567ea4e9175111c4e31f8da087348da1c6887507e90c11d1\",\"onfido_report\":{\"result\":\"clear\",\"breakdown\":{\"visual_authenticity\":{\"result\":\"clear\",\"breakdown\":{\"other\":{\"result\":\"clear\"},\"face_detection\":{\"result\":\"clear\"}}},\"data_consistency\":{\"result\":\"clear\",\"breakdown\":{\"document_type\":{\"result\":\"clear\"},\"nationality\":{\"result\":\"clear\"},\"date_of_expiry\":{\"result\":\"clear\"},\"date_of_birth\":{\"result\":\"clear\"},\"document_numbers\":{\"result\":\"clear\"},\"gender\":{\"result\":\"clear\"},\"last_name\":{\"result\":\"clear\"},\"first_name\":{\"result\":\"clear\"},\"issuing_country\":{\"result\":\"clear\"}}},\"image_integrity\":{\"result\":\"clear\",\"breakdown\":{\"image_quality\":{\"result\":\"clear\"},\"supported_document\":{\"result\":\"clear\"}}},\"police_record\":{\"result\":\"clear\"},\"data_validation\":{\"result\":\"clear\",\"breakdown\":{\"expiry_date\":{\"result\":\"clear\"},\"date_of_birth\":{\"result\":\"clear\"},\"document_expiration\":{\"result\":\"clear\"},\"document_numbers\":{\"result\":\"clear\"},\"gender\":{\"result\":\"clear\"},\"mrz\":{\"result\":\"clear\"}}},\"data_comparison\":{\"result\":\"clear\",\"breakdown\":{\"document_type\":{\"result\":\"clear\"},\"date_of_expiry\":{\"result\":\"clear\"},\"date_of_birth\":{\"result\":\"clear\"},\"document_numbers\":{\"result\":\"clear\"},\"gender\":{\"result\":\"clear\"},\"last_name\":{\"result\":\"clear\"},\"first_name\":{\"result\":\"clear\"},\"issuing_country\":{\"result\":\"clear\"}}}},\"variant\":\"standard\",\"created_at\":\"2018-04-16T10:04:06Z\",\"name\":\"document\",\"sub_result\":\"clear\",\"status\":\"complete\"}}"
    },
    "identities": {
        "address": "0730 Beatty Land Apt. 131",
        "dob": "Tue Feb 06 2018 22:49:01 GMT+0700 (+07)",
        "email": "cer1@test.com",
        "firstName": "Lesley",
        "lastName": "Pollich",
        "passport": "5af420cea51228aa0c402b97",
        "phone": "(686) 622-8231",
        "picture": "5af420cea51228aa0c402b96",
        "proofOfAddress": "5af420cea51228aa0c402b98"
    },
    "reviews": {}
}

async function createCertificate(kycRecord) {
    const organizationInfo = {
        identifier: 'developer_service',
        legalName: 'Demo Organization',
        logo: 'http://www.dummymag.com//media/img/dummy-logo.png',
    }

    const certificateType = 'demo-service-cert'
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

    const now = new Date()
    const claimInfo = {
        reviewBody: `review by ${kycRecord.reviewer}`,
        accessMode: "A",
        issueDate: now.toISOString()
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

    console.log(res)
}

createCertificate(DUMMY_DATA);