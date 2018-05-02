const chai = require('chai');
const sinon = require('sinon');
const should = chai.should();

const { DELOY_SECRET_KEY } = require('../../../configs');


describe("setup flow", function () {
    let token = '';
    adminLogin = async ({ userName, pass }) => {
        return await chai.sendLocalRequest()
            .post('/auth/login')
            .send({
                userName,
                pass
            })
    }

    freshInstallDataModel = async () => {
        const mongoose = require('mongoose');

        const jobs = Object.keys(mongoose.models).map(key => {
            return mongoose.model(key).remove().exec()
        })
        await Promise.all(jobs);
    }

    it('[happy] 1st time setup', async function () {

        // drop all DataModel
        await freshInstallDataModel();

        // ensure empty settings
        let settingRes = await chai.sendLocalRequest()
            .get('/setting')
        settingRes.body.length.should.equal(0)

        // setup
        const setupRes = await chai.sendLocalRequest()
            .post('/setting/setup')
            .send({
                deployKey: DELOY_SECRET_KEY,
                settings: {
                    adminPass: 'admin',
                    SmartContractAddress: '0x123',
                    SmartContractEnv: 'MainNet'
                }
            })

        setupRes.body.length.should.equal(2)

        // admin login
        const adminLoginRes = await adminLogin({
            userName: 'admin',
            pass: 'admin'
        })

        adminLoginRes.body.token.should.not.equal(null)

        return Promise.resolve();
    })

    it('[happy] 1st time setup missing params', async function () {

        // drop all DataModel
        await freshInstallDataModel();

        // ensure empty settings
        let settingRes = await chai.sendLocalRequest()
            .get('/setting')
        settingRes.body.length.should.equal(0)

        // setup
        let setupRes = await chai.sendLocalRequest()
            .post('/setting/setup')
            .send({
                deployKey: DELOY_SECRET_KEY,
                settings: {
                    SmartContractAddress: '0x123',
                    SmartContractEnv: 'MainNet'
                }
            })

        setupRes.status.should.equal(400)

        setupRes = await chai.sendLocalRequest()
            .post('/setting/setup')
            .send({
                deployKey: DELOY_SECRET_KEY,
                settings: {
                    adminPass: 'admin',
                    SmartContractAddress: '0x123',
                    SmartContractEnv: 'MainNet'
                }
            })

        setupRes.body.length.should.equal(2)

        // admin login
        const adminLoginRes = await adminLogin({
            userName: 'admin',
            pass: 'admin'
        })

        adminLoginRes.body.token.should.not.equal(null)

        return Promise.resolve();
    })

    it('[failed] setup multiple time', async function () {

        // drop all DataModel
        await freshInstallDataModel();

        // ensure empty settings
        let settingRes = await chai.sendLocalRequest()
            .get('/setting')
        settingRes.body.length.should.equal(0)

        // setup
        let setupRes = await chai.sendLocalRequest()
            .post('/setting/setup')
            .send({
                deployKey: DELOY_SECRET_KEY,
                settings: {
                    adminPass: 'admin',
                    SmartContractAddress: '0x123',
                    SmartContractEnv: 'MainNet'
                }
            })

        setupRes.body.length.should.equal(2)

        setupRes = await chai.sendLocalRequest()
            .post('/setting/setup')
            .send({
                deployKey: DELOY_SECRET_KEY,
                settings: {
                    adminPass: 'admin',
                    SmartContractAddress: '0x123',
                    SmartContractEnv: 'MainNet'
                }
            })

        setupRes.status.should.equal(409)

        return Promise.resolve();
    })

})