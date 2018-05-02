// This should match with Blockpass server definded
const REQUIRED_FIELDS = ["family_name", "given_name", "phone", "email"];
const OPTIONAL_FIELDS = ["selfie", "passport", "proof_of_address"]
const FIELD_TYPE_MAPS = {
    "selfie": "file",
    "passport": "file",
    "proof_of_address": "file",
    "family_name": "string",
    "given_name": "string",
    "phone": "string",
    "email": "string",
    "[cer]onfido": "string"
}
const CROSS_DB_FIELD_MAPS = {
    "family_name": "lastName",
    "given_name": "fristName",
    "phone": "phone",
    "email": "email",
    "selfie": "picture",
    "passport": "passport",
    "proof_of_address": "proofOfAddress",
    "[cer]onfido": "onfidoCertificate"
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
    REQUIRED_FIELDS,
    OPTIONAL_FIELDS,
    CROSS_DB_FIELD_MAPS,
    FIELD_TYPE_MAPS,
    CROSS_DB_FIELD_MAPS_INVERSE
}