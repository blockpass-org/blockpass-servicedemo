// This should match with Blockpass server definded

const FIELD_TYPE_MAPS = {
    "selfie": "file",
    "passport": "file",
    "proof_of_address": "file",
    "family_name": "string",
    "given_name": "string",
    "phone": "string",
    "email": "string",
    "onfido": "string",
    "dob": "string",
    "address": "string"
}
const CROSS_DB_FIELD_MAPS = {
    "family_name": "lastName",
    "given_name": "fristName",
    "phone": "phone",
    "email": "email",
    "selfie": "picture",
    "dob": "dob",
    "address": "address",
    "passport": "passport",
    "proof_of_address": "proofOfAddress",
    "onfido": "onfidoCertificate"
}

function swap(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}
const CROSS_DB_FIELD_MAPS_INVERSE = swap(CROSS_DB_FIELD_MAPS)

module.exports = {
    CROSS_DB_FIELD_MAPS,
    FIELD_TYPE_MAPS,
    CROSS_DB_FIELD_MAPS_INVERSE
}