const _config = require('../../../configs')
const blockpassSDKMock = require('../../../cores//blockpass/utils/_unitTestMock');

const chai = require('chai');
var faker = require('faker');
let should = chai.should();

const BLOCKPASS_BASE_URL = _config.BLOCKPASS_BASE_URL;

describe("blockpass register flow", function () {
    after(() => {
        blockpassSDKMock.clearAll();
    })

    it('[new user][happy] register', async function () {

        const bpFakeUserId = Date.now().toString();

        // Mock API 
        blockpassSDKMock.mockHandShake(BLOCKPASS_BASE_URL, bpFakeUserId)
        blockpassSDKMock.mockMatchingData(BLOCKPASS_BASE_URL, bpFakeUserId, null, 2)

        const step1 = await chai.sendLocalRequest()
            .post('/blockpass/api/register')
            .send({
                code: bpFakeUserId
            })

        step1.body.nextAction.should.equal('upload')
        const { accessToken, expiry } = step1.body;

        let req = chai.sendLocalRequest()
            .post('/blockpass/api/uploadData')
            .field('accessToken', accessToken)
            .field('slugList', _config.DEFAULT_REQUIRED_FIELDS)
            .field('family_name', faker.name.firstName())
            .field('given_name', faker.name.lastName())
            .field('phone', faker.phone.phoneNumber())
            .attach('selfie', __dirname +'/avatar.jpeg')
            .field('email', faker.internet.email())
            .field('[cer]onfido', 'fakefake')

        const step2 = await req;

        console.log(step2.body);

        step2.body.nextAction.should.equal('none')
        step2.body.message.should.equal('welcome back')

        blockpassSDKMock.mockHandShake(BLOCKPASS_BASE_URL, bpFakeUserId)
        blockpassSDKMock.mockMatchingData(BLOCKPASS_BASE_URL, bpFakeUserId, null, 1)

        const step3 = await chai.sendLocalRequest()
            .post('/blockpass/api/status')
            .send({
                code: bpFakeUserId
            })
        
        console.log(step3.body)

        step3.body.status.should.equal('waiting')

        blockpassSDKMock.checkPending();

        return Promise.resolve();
    })

    it('[new user][un-happy] previous register missing fields', async function () {

        const bpFakeUserId = '5addc3a70476a51e3c3f4291';

        // Mock API 
        blockpassSDKMock.mockHandShake(BLOCKPASS_BASE_URL, bpFakeUserId)
        blockpassSDKMock.mockMatchingData(BLOCKPASS_BASE_URL, bpFakeUserId, null, 2)

        const step1 = await chai.sendLocalRequest()
            .post('/blockpass/api/register')
            .send({
                code: bpFakeUserId
            })

        step1.body.nextAction.should.equal('upload')
        const { accessToken, expiry } = step1.body;

        let req = chai.sendLocalRequest()
            .post('/blockpass/api/uploadData')
            .field('accessToken', accessToken)
            .field('slugList', ['email'])
            .field('email', faker.internet.email())

        const step2 = await req;

        console.log(step2.body);

        step2.body.nextAction.should.equal('none')
        step2.body.message.should.equal('welcome back')

        blockpassSDKMock.mockHandShake(BLOCKPASS_BASE_URL, bpFakeUserId)
        blockpassSDKMock.mockMatchingData(BLOCKPASS_BASE_URL, bpFakeUserId, null, 1)

        const step3 = await chai.sendLocalRequest()
            .post('/blockpass/api/status')
            .send({
                code: bpFakeUserId
            })

        console.log(step3.body)

        step3.body.status.should.equal('waiting')

        blockpassSDKMock.checkPending();

        return Promise.resolve();
    })

    it('[new user][2nd] register', async function () {

        const bpFakeUserId = '1522257024962';

        // Mock API 
        blockpassSDKMock.mockHandShake(BLOCKPASS_BASE_URL, bpFakeUserId)
        blockpassSDKMock.mockMatchingData(BLOCKPASS_BASE_URL, bpFakeUserId, null, 1)


        const step1 = await chai.sendLocalRequest()
            .post('/blockpass/api/register')
            .send({
                code: bpFakeUserId
            })

        step1.body.nextAction.should.equal('none')

        blockpassSDKMock.checkPending();

        return Promise.resolve();
    })


    it('[new user] register missmatching slug list', async function () {

        const bpFakeUserId = Date.now().toString();

        // Mock API 
        blockpassSDKMock.mockHandShake(BLOCKPASS_BASE_URL, bpFakeUserId)
        blockpassSDKMock.mockMatchingData(BLOCKPASS_BASE_URL, bpFakeUserId)

        const step1 = await chai.sendLocalRequest()
            .post('/blockpass/api/register')
            .send({
                code: bpFakeUserId
            })

        step1.body.nextAction.should.equal('upload')
        const { accessToken, expiry } = step1.body;

        let req = chai.sendLocalRequest()
            .post('/blockpass/api/uploadData')
            .field('accessToken', accessToken)
            .field('slugList', [])
            .field('family_name', faker.name.firstName())
            .field('given_name', faker.name.lastName())
            .field('email', faker.internet.email())

        const step2 = await req;

        step2.status.should.equal(404)

        blockpassSDKMock.checkPending();

        return Promise.resolve();
    })
})