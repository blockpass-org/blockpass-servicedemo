const chai = require('chai');
let should = chai.should();

describe("authenticate", function () {
    it('POST /auth/login . missing info', function (done) {
        chai.sendLocalRequest()
            .post('/auth/login')
            .send({
                
            })
            .end((err, res) => {
                res.should.have.status(404);
                done();
            })
    })

    it('POST /auth/login .success', function (done) {
        chai.sendLocalRequest()
            .post('/auth/login')
            .send({
                userName: 'user1',
                pass: 'user1'
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('token');
                res.body.should.have.property('scope').be.a('array');
                done();
            })
    })

    it('GET /auth/profile ', async function () {
        const res = await chai.sendLocalRequest()
            .post('/auth/login')
            .send({
                userName: 'user1',
                pass: 'user1'
            })
            
        res.should.have.status(200);
        res.body.should.have.property('token');
        res.body.should.have.property('scope').be.a('array');

        const profileRes = await chai.sendLocalRequest()
            .get('/auth/profile')
            .set({
                'Authorization': res.body.token
            })
        
        profileRes.should.have.status(200);

        return Promise.resolve(0);
    })

    it('POST /auth/updatePass ', async function () {

        // login
        let res = await chai.sendLocalRequest()
            .post('/auth/login')
            .send({
                userName: 'user1',
                pass: 'user1'
            })
        res.should.have.status(200);
        res.body.should.have.property('token');
        res.body.should.have.property('scope').be.a('array');
        
        // change pass
        const modifyPassResponse = await chai.sendLocalRequest()
            .post('/auth/updatePass')
            .set({
                'Authorization': res.body.token
            })
            .send({
                pass: 'iamfine'
            })
        modifyPassResponse.should.have.status(200);

        // login again with new pass
        res = await chai.sendLocalRequest()
            .post('/auth/login')
            .send({
                userName: 'user1',
                pass: 'iamfine'
            })
        res.should.have.status(200);
        res.body.should.have.property('token');


        return Promise.resolve(0);
    })

})