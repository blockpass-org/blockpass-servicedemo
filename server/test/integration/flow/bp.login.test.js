const _config = require('../../../configs')
const chai = require('chai');
const faker = require('faker');
const sinon = require('sinon');
const blockpassSDK = require('../../../cores/blockpass/BlockPassServerApi');
const blockpassSDKMock = require('../../../cores//blockpass/utils/_unitTestMock');
const should = chai.should();

const BLOCKPASS_BASE_URL = _config.BLOCKPASS_BASE_URL;
const { REQUIRED_FIELDS, OPTIONAL_FIELDS } = require('../../../controllers/blockPass/_config');

describe("blockpass login flow", function () {
    let spy;
    before(() =>{
        spy = sinon.spy(blockpassSDK, 'notifyLoginComplete');
    })

    beforeEach(() => {
        spy.resetHistory();
    })

    after(() => {
        blockpassSDKMock.clearAll();
        blockpassSDK.notifyLoginComplete.restore();
    })

    it('[new user][happy][registerd] login', async function () {

        const bpFakeUserId = '1522257024962';
        const userId = '5abbcc8160f9ab2c5a7801ef';
        const sessionCode = '1xxx';

        // Mock API 
        blockpassSDKMock.mockHandShake(BLOCKPASS_BASE_URL, bpFakeUserId)
        blockpassSDKMock.mockMatchingData(BLOCKPASS_BASE_URL, bpFakeUserId)
        blockpassSDKMock.mockSSoComplete(BLOCKPASS_BASE_URL)
        
        const step1 = await chai.sendLocalRequest()
            .post('/blockpass/api/login')
            .send({
                code: bpFakeUserId,
                sessionCode
            })
        

        step1.body.nextAction.should.equal('none')

        blockpassSDKMock.checkPending();
        
        return Promise.resolve();
    })

    it('[new user][not registerd] login', async function () {

        const bpFakeUserId = Date.now().toString();
        const sessionCode = '2xxx';

        // Mock API 
        blockpassSDKMock.mockHandShake(BLOCKPASS_BASE_URL, bpFakeUserId)
        blockpassSDKMock.mockMatchingData(BLOCKPASS_BASE_URL, bpFakeUserId, null, 2)
        blockpassSDKMock.mockSSoComplete(BLOCKPASS_BASE_URL)

        const step1 = await chai.sendLocalRequest()
            .post('/blockpass/api/login')
            .send({
                code: bpFakeUserId,
                sessionCode
            })

        step1.body.nextAction.should.equal('upload')
        const { accessToken, expiry } = step1.body;

        let req = chai.sendLocalRequest()
            .post('/blockpass/api/uploadData')
            .field('accessToken', accessToken)
            .field('slugList', REQUIRED_FIELDS)
            .field('family_name', faker.name.firstName())
            .field('given_name', faker.name.lastName())
            .field('phone', faker.phone.phoneNumber())
            // .field('email', faker.internet.email())

        const step2 = await req;

        console.log(spy.args[0]);

        step2.body.nextAction.should.equal('none')
        step2.body.message.should.equal('welcome back')

        blockpassSDKMock.checkPending();

        return Promise.resolve();
    })

    it('[new user][not registerd] login wrong accessToken', async function () {

        const bpFakeUserId = Date.now().toString();
        const sessionCode = '2xxx';

        // Mock API 
        blockpassSDKMock.mockHandShake(BLOCKPASS_BASE_URL, bpFakeUserId)
        blockpassSDKMock.mockMatchingData(BLOCKPASS_BASE_URL, bpFakeUserId, null, 1)

        const step1 = await chai.sendLocalRequest()
            .post('/blockpass/api/login')
            .send({
                code: bpFakeUserId,
                sessionCode
            })

        step1.body.nextAction.should.equal('upload')
        const { accessToken, expiry } = step1.body;

        let req = chai.sendLocalRequest()
            .post('/blockpass/api/uploadData')
            .field('accessToken', '')
            .field('slugList', REQUIRED_FIELDS)
            .field('family_name', faker.name.firstName())
            .field('lastName', faker.name.lastName())
            .field('phone', faker.phone.phoneNumber())
            // .field('email', faker.internet.email())

        const step2 = await req;
        
        step2.status.should.equal(403)

        blockpassSDKMock.checkPending();

        return Promise.resolve();
    })

    it('[new user] login missing params', async function () {

        const bpFakeUserId = Date.now().toString();

        const step1 = await chai.sendLocalRequest()
            .post('/blockpass/api/login')
            .send({
                code: bpFakeUserId,
            })
        
        step1.status.should.equal(404);

        blockpassSDKMock.checkPending();

        return Promise.resolve();
    })

})