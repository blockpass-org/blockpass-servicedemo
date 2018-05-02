const chai = require('chai');
let should = chai.should();

describe("kyc model res-api", function () {

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

    it('GET missing token', function (done) {
        chai.sendLocalRequest()
            .get('/api/v1/KYCModel')
            .end((err, res) => {
                res.should.have.status(403);
                done();
            })
    })

    it('GET invalid token 1', function (done) {
        const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp0VCJ9.eyJleHAiOjE1MjIzNDM5ODgsImRhdGEiOnsiX2lkIjoiNWFiYmNlYjRlZjU1YzkyZDljYTUxY2QxIiwic2NvcGUiOlsiYWRtaW4iXX0sImlhdCI6MTUyMjI1NzU4OH0.52lh_FBeyorqA-cLyVw-BSroAiUb_ulBvuHgJPn8Fis'
        chai.sendLocalRequest()
            .get('/api/v1/KYCModel')
            .set('Authorization', invalidToken)
            .end((err, res) => {
                res.should.have.status(403);
                done();
            })
    })

    it('GET invalid token 2', function (done) {
        const invalidToken = 'aaa'
        chai.sendLocalRequest()
            .get('/api/v1/KYCModel')
            .set('Authorization', invalidToken)
            .end((err, res) => {
                res.should.have.status(403);
                done();
            })
    })

    it('GET /api/v1/KYCModel', function (done) {
        chai.sendLocalRequest()
            .get('/api/v1/KYCModel')
            .set('Authorization', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    })

    it('GET /api/v1/KYCModel/:id', function (done) {
        const id = '5abdb47f1e07d7e4dbcc6670'
        chai.sendLocalRequest()
            .get('/api/v1/KYCModel/5abdb47f1e07d7e4dbcc6670')
            .set('Authorization', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body._id.should.equal(id);
                done();
            })
    })

    it('GET /api/v1/KYCModel query phone', function (done) {
        const phone = '000.000.000'
        chai.sendLocalRequest()
            .get('/api/v1/KYCModel')
            .set('Authorization', token)
            .query({
                query: JSON.stringify({ phone: phone })
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.length.should.equal(1);
                res.body[0].phone.should.equal(phone);
                done();
            })
    })

    it('POST /api/v1/KYCModel', function (done) {
        const phone = '000.000.001'
        chai.sendLocalRequest()
            .post('/api/v1/KYCModel')
            .set('Authorization', token)
            .send({
                phone: phone,
                pass: 'abcd'
            })
            .end((err, res) => {
                res.should.have.status(201);
                done();
            })
    })

    it('PATH /api/v1/KYCModel', function (done) {
        const id = '5abc6d25442beeb2d731dc3a'
        chai.sendLocalRequest()
            .patch(`/api/v1/KYCModel/${id}`)
            .set('Authorization', token)
            .send({
                phone: '0-0-1-2',
            })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })

    // it('PATH /api/v1/KYCModel conflict', function (done) {
    //     const id = '5abc6d25442beeb2d731dc3a'
    //     chai.sendLocalRequest()
    //         .patch(`/api/v1/KYCModel/${id}`)
    //         .set('Authorization', token)
    //         .send({
    //             userName: 'user2'
    //         })
    //         .end((err, res) => {
    //             res.should.have.status(400);
    //             done();
    //         })
    // })

    it('DELETE /api/v1/KYCModel', function (done) {
        const id = '5abc6d25442beeb2d731dc3a'
        chai.sendLocalRequest()
            .delete(`/api/v1/KYCModel/${id}`)
            .set('Authorization', token)
            .end((err, res) => {
                res.should.have.status(204);
                done();
            })
    })

    it('GET /api/v1/KYCModel query all skip limit', function (done) {
        chai.sendLocalRequest()
            .get('/api/v1/KYCModel')
            .set('Authorization', token)
            .query({
                limit: 1,
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.length.should.equal(1);
                res.headers['x-total-count'].should.not.equal('0')
                done();
            })
    })
})