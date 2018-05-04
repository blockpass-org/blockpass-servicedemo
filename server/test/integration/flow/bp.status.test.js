const _config = require('../../../configs')
const blockpassSDKMock = require('../../../cores//blockpass/utils/_unitTestMock');

const chai = require('chai');
var faker = require('faker');
let should = chai.should();

const BLOCKPASS_BASE_URL = _config.BLOCKPASS_BASE_URL;
const { REQUIRED_FIELDS, OPTIONAL_FIELDS } = require('../../../controllers/blockPass/_config');

describe("blockpass status flow", function () {
    after(() => {
        blockpassSDKMock.clearAll();
    })

    it('[not found]query status', async function () {

        const bpFakeUserId = Date.now().toString();

        // Mock API 
        blockpassSDKMock.mockHandShake(BLOCKPASS_BASE_URL, bpFakeUserId)
        blockpassSDKMock.mockMatchingData(BLOCKPASS_BASE_URL, bpFakeUserId, null, 1)

        const step1 = await chai.sendLocalRequest()
            .post('/blockpass/api/status')
            .send({
                code: bpFakeUserId
            })

        step1.body.status.should.equal('notFound')

        blockpassSDKMock.checkPending();

        return Promise.resolve();
    })

    it('[found]query status', async function () {

        const bpFakeUserId = '1522257024962';

        // Mock API 
        blockpassSDKMock.mockHandShake(BLOCKPASS_BASE_URL, bpFakeUserId)
        blockpassSDKMock.mockMatchingData(BLOCKPASS_BASE_URL, bpFakeUserId, null, 1)

        const step1 = await chai.sendLocalRequest()
            .post('/blockpass/api/status')
            .send({
                code: bpFakeUserId
            })

        step1.body.status.should.equal('waiting')

        blockpassSDKMock.checkPending();

        return Promise.resolve();
    })

})