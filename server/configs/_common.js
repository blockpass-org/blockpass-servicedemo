module.exports = {
    JWT_SECRET: 'hkUgKHkz',
    JWT_TIMEOUT_S: 24 * 60 * 60,

    BLOCKPASS_CLIENT_ID: '3rd_service_demo',
    BLOCKPASS_SECRET_ID: '3rd_service_demo',
    BLOCKPASS_TOKEN_SCOPE: 'authoriaztioncode',

    BLOCKPASS_GRANT_ACCESSTOKEN: 'env_specific_config',
    BLOCKPASS_QUERY_PROFILE: 'env_specific_config',
    MONGODB_URI: 'mongodb://localhost/3rd-service',

    DELOY_SECRET_KEY: '123456789',


    DEFAULT_REQUIRED_FIELDS: ["email", "selfie", "passport", "proof_of_address", "family_name", "given_name", "phone", "dob", "address"],
    DEFAULT_OPTIONAL_FIELDS: [],
    DEFAULT_CERTS: ["onfido"],

    
    CERTIFICATE_SIGN_PRIVATE: "KztaRPUmGbGje5P3vLFYz9Qg2KuNSiQGrYppL4w6VoWC7sYZ2wT3",
    CERTIFICATE_SIGN_PUBLIC: "1MZmUAZjr8pzMsxMFvNKihTdohxeCBVcPZ"
}