const _config = require('../../../configs')
const blockpassSDKMock = require('../../../cores//blockpass/utils/_unitTestMock');
const ServerSdk = require('../../../cores/blockpass/ServerSdk');
const FAKE_SERVICE_META_DATA = require('../../_http-mock/serviceMetadata.json')
const FAKE_CER_SCHEMA_DATA = require('../../_http-mock/cerSchema.json')

const chai = require('chai');
const sinon = require('sinon');
const should = chai.should();

describe("blockpass sdk sign certificate", function () {

    const serverSdk = new ServerSdk({
        baseUrl: process.env.BLOCKPASS_BASE_URL,
        clientId: 'test',
        secretId: 'test',
        requiredFields: [],
        optionalFields: [],
        findKycById: _ => { },
        createKyc: _ => { },
        updateKyc: _ => { },
        queryKycStatus: _ => { }
    })

    after(() => {
        blockpassSDKMock.clearAll();
    })

    it('[happy] sign valid certificate', async function () {

        // const clientId = 'test'
        // blockpassSDKMock.mockQueryServiceMetadata(process.env.BLOCKPASS_BASE_URL, clientId)

        
        // blockpassSDKMock.checkPending();

        return Promise.resolve(0);
    })
})