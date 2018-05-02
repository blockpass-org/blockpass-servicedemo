module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'hkUgKHkz',
    JWT_TIMEOUT_S: process.env.JWT_TIMEOUT_S || 24 * 60 * 60,

    BLOCKPASS_BASE_URL: process.env.BLOCKPASS_BASE_URL || 'http://172.16.0.203:1339',
    BLOCKPASS_CLIENT_ID: process.env.BLOCKPASS_CLIENT_ID || '3rd_service_demo',
    BLOCKPASS_SECRET_ID: process.env.BLOCKPASS_SECRET_ID || '3rd_service_demo',
    BLOCKPASS_TOKEN_SCOPE: process.env.BLOCKPASS_TOKEN_SCOPE || 'authoriaztioncode',

    BLOCKPASS_GRANT_ACCESSTOKEN: process.env.BLOCKPASS_GRANT_ACCESSTOKEN || 'env_specific_config',
    BLOCKPASS_QUERY_PROFILE: process.env.BLOCKPASS_QUERY_PROFILE || 'env_specific_config',
    MONGODB_URI: process.env.MONGODB_URI,

    DELOY_SECRET_KEY: process.env.DELOY_SECRET_KEY || '123456789'
}