const _config = require('../../../configs')
const blockpassSDKMock = require('../../../cores//blockpass/utils/_unitTestMock');

const chai = require('chai');
const sinon = require('sinon');
const should = chai.should();

const BLOCKPASS_BASE_URL = _config.BLOCKPASS_BASE_URL;
const { REQUIRED_FIELDS, OPTIONAL_FIELDS } = require('../../../controllers/blockPass/_config');


describe("blockpass revivew flow", function () {
    after(() => {
        blockpassSDKMock.clearAll();
    })

    function queryLastLog(userId) {
        return chai.sendLocalRequest()
            .get('/api/v1/LogModel')
            .set('Authorization', token)
            .query({
                query: JSON.stringify({ userId }),
                sort: { updatedAt: -1 },
                limit: 1
            })
    }

    let token = '';
    before(done => {
        chai.sendLocalRequest()
            .post('/auth/login')
            .send({
                userName: 'admin',
                pass: 'admin'
            })
            .end((err, res) => {
                res.should.have.status(200);
                token = res.body.token;
                done();
            })
    })

    it('[admin] start review', async function () {

        const userId = '5abdb47f1e07d7e4dbcc6670';
        const message = 'starting to review. ' + Date.now();

        const step1 = await chai.sendLocalRequest()
            .post('/blockpass/api/startReview')
            .set('Authorization', token)
            .send({
                id: userId,
                message
            })
        
        step1.status.should.equal(200);
        step1.body[0].status.should.equal('inreview');

        // Double check activity log
        const lastLog = await queryLastLog(userId);
        lastLog.body[0].message.should.equal(message);
        
        return Promise.resolve();
    })

    it('[admin] start review and approve', async function () {

        const userId = '5abdb47f1e07d7e4dbcc6670';
        const message = 'starting to review. ' + Date.now();
        const message2 = 'approve user profile. ' + Date.now();

        const step1 = await chai.sendLocalRequest()
            .post('/blockpass/api/startReview')
            .set('Authorization', token)
            .send({
                id: userId,
                message,
            })

        step1.status.should.equal(200);
        step1.body[0].status.should.equal('inreview');

        // Double check activity log
        const lastLog = await queryLastLog(userId);
        lastLog.body[0].message.should.equal(message);

        // Confirm certificate
        const step2 = await chai.sendLocalRequest()
            .post('/blockpass/api/approveCertificate')
            .set('Authorization', token)
            .send({
                id: userId,
                message: message2,
                rate: 3,
                expiredDate: (new Date(Date.now() + 30 * 24 * 60 * 60)).valueOf()
            })
        
        step2.status.should.equal(200);
        step2.body.cer.userId.should.equal(userId);

        // Double check activity log
        const lastLog1 = await queryLastLog(userId);
        lastLog1.body[0].message.should.equal(message2);

        return Promise.resolve();
    })

    it('[admin] start review and reject', async function () {

        const userId = '5abdb7011e07d7e4dbcc6672';
        const message = 'starting to review. ' + Date.now();
        const message2 = 'reject user profile. Can not verify phone call' + Date.now();

        const step1 = await chai.sendLocalRequest()
            .post('/blockpass/api/startReview')
            .set('Authorization', token)
            .send({
                id: userId,
                message
            })

        step1.status.should.equal(200);
        step1.body[0].status.should.equal('inreview');

        // Double check activity log
        const lastLog = await queryLastLog(userId);
        lastLog.body[0].message.should.equal(message);

        // Reject certificate
        const step2 = await chai.sendLocalRequest()
            .post('/blockpass/api/rejectCertificate')
            .set('Authorization', token)
            .send({
                id: userId,
                message: message2
            })

        step2.status.should.equal(200);
        step2.body[0].status.should.equal('waiting');

        // Double check activity log
        const lastLog1 = await queryLastLog(userId);
        lastLog1.body[0].message.should.equal(message2);

        return Promise.resolve();
    })

})