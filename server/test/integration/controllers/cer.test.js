const chai = require('chai');
let should = chai.should();

describe("cer model res-api", function () {

    it('GET /api/v1/CertificateModel', function (done) {
        chai.sendLocalRequest()
            .get('/api/v1/CertificateModel')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    })

    it('POST /api/v1/CertificateModel', function (done) {
        chai.sendLocalRequest()
            .post('/api/v1/CertificateModel')
            .send({})
            .end((err, res) => {
                console.log(res.body);
                res.should.have.status(403);
                done();
            })
    })

    it('DELETE /api/v1/CertificateModel', function (done) {
        chai.sendLocalRequest()
            .delete('/api/v1/CertificateModel')
            .send({})
            .end((err, res) => {
                console.log(res.body);
                res.should.have.status(403);
                done();
            })
    })

})