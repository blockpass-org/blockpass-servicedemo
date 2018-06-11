
// process.env.MONGODB_URI = 'mongodb://localhost/3rd-service-test'
// process.env.BLOCKPASS_BASE_URL = 'https://sandbox-api.blockpass.org'
// process.env.BLOCKPASS_CLIENT_ID = 'developer_service'
// process.env.BLOCKPASS_SECRET_ID = 'developer_service'
// process.env.SERVER_PORT = 4000

const deleteOldData = require('../../../cores/cleanup/deleteOldData');
const app = require('../../../app')

async function testDeleteFile() {
    const res = await deleteOldData(1)
}

setTimeout(() => {
    testDeleteFile()
}, 3000);
