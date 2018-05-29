const _config = require('../../../configs')
const blockpassSDKMock = require('../../../cores//blockpass/utils/_unitTestMock');
const FAKE_SERVICE_META_DATA = require('../../_http-mock/serviceMetadata.json')
const FAKE_CER_SCHEMA_DATA = require('../../_http-mock/cerSchema.json')

const chai = require('chai');
const sinon = require('sinon');
const should = chai.should();

const BLOCKPASS_BASE_URL = _config.BLOCKPASS_BASE_URL;

describe("blockpass issued certificate flow", function () {
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

    it('[admin] issue certificate', async function () {

        const userId = '5ae198afc55d973b6032981f';
        const message = 'this profile is good';
        const clientId = _config.BLOCKPASS_CLIENT_ID;
        const certificateType = 'demo-service-cert';
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

        blockpassSDKMock.mockQueryServiceMetadata(process.env.BLOCKPASS_BASE_URL, clientId, FAKE_SERVICE_META_DATA)
        blockpassSDKMock.mockQueryCertificateSchema(process.env.BLOCKPASS_BASE_URL, certificateType, FAKE_CER_SCHEMA_DATA, 3)
        blockpassSDKMock.mockSignCertificate(process.env.BLOCKPASS_BASE_URL, {
            status: 'success'
        })

        const step1 = await chai.sendLocalRequest()
            .post('/blockpass/api/approveCertificate')
            .set('Authorization', token)
            .send({
                id: userId,
                message,
                decisions
            })
        
        console.log(step1.body)
        step1.status.should.equal(200);
        

        // Double check activity log
        const lastLog = await queryLastLog(userId);
        lastLog.body[0].message.should.equal('record-approve');
        
        blockpassSDKMock.checkPending();

        return Promise.resolve();
    })
})