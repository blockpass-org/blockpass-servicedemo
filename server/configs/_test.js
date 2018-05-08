process.env.BLOCKPASS_BASE_URL = 'http://mock-unit-test'

module.exports = {
    MONGODB_URI: 'mongodb://localhost/3rd-service-test',
    BLOCKPASS_BASE_URL: 'http://mock-unit-test',
    DEFAULT_REQUIRED_FIELDS: ["email"],
    DEFAULT_OPTIONAL_FIELDS: ["selfie", "passport", "proof_of_address", "family_name", "given_name", "phone"],
    DEFAULT_CERTS: ["onfido"]
}