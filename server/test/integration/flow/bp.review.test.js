const _config = require('../../../configs')
const blockpassSDKMock = require('../../../cores//blockpass/utils/_unitTestMock');

const chai = require('chai');
const sinon = require('sinon');
const should = chai.should();

const BLOCKPASS_BASE_URL = _config.BLOCKPASS_BASE_URL;

describe("blockpass revivew flow", function () {
    after(() => {
        blockpassSDKMock.clearAll();
    })

    function queryLastLog(recordId) {
        return chai.sendLocalRequest()
            .get('/api/v1/LogModel')
            .set('Authorization', token)
            .query({
                query: JSON.stringify({ recordId }),
                sort: { updatedAt: -1 },
                limit: 1
            })
    }

    let token = '';
    before(done => {
        chai.sendLocalRequest()
            .post('/auth/login')
            .send({
                userName: 'user2',
                pass: 'user2'
            })
            .end((err, res) => {
                res.should.have.status(200);
                token = res.body.token;
                done();
            })
    })

    it('[admin] start review', async function () {

        const userId = '5abdb47f1e07d7e4dbcc6670';
        const message = 'record-start-review';

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


    it('[admin] send feedback certificate', async function () {

        const userId = '5ae198afc55d973b6032981f';
        const message = 'need update some fields';
        const clientId = _config.BLOCKPASS_CLIENT_ID;
        const decisions = [
            {
                slug: 'firstName',
                comment: '',
                status: 'approved',
                type: 'identities'
            },
            {
                slug: 'phone',
                comment: '',
                status: 'approved',
                type: 'identities'
            },
            {
                slug: 'onfidoCertificate',
                comment: 'validate failed',
                status: 'rejected',
                type: 'certificates'
            }
        ]

        blockpassSDKMock.mockNoticeUser(process.env.BLOCKPASS_BASE_URL, {})
        const step1 = await chai.sendLocalRequest()
            .post('/blockpass/api/sendFeedback')
            .set('Authorization', token)
            .send({
                id: userId,
                message,
                decisions
            })
        step1.status.should.equal(200);


        // Double check activity log
        const lastLog = await queryLastLog(userId);
        lastLog.body[0].message.should.equal('record-feedback');

        blockpassSDKMock.checkPending();

        return Promise.resolve();
    })


})