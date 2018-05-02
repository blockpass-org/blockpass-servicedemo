const path = require('path');
const fixtures = require('pow-mongoose-fixtures');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
let app;


process.env.NODE_ENV = 'test'

function refreshDatabase(done) {
    let fixture_dir = path.resolve("./test/fixtures");
    fixtures.load(fixture_dir, mongoose, function (error, data) {
        if(error != null)
            console.warn("aaa", error, data)
        done(error);
    });
}

before(function (done) {
    process.env.SERVER_PORT = 9001
    this.timeout(5000);

    app = require('../app')
    chai.use(chaiHttp);
    chai.sendLocalRequest = function (token) {
        return chai.request(app)
    }

    // Drop and create database
    mongoose.connection.on('connected', () => {
        mongoose.connection.db.dropDatabase()
            .then(_ => refreshDatabase(done))
    })

});

beforeEach(function (done) {
    refreshDatabase(done);
})


afterEach(function (done) {
    done();
});

after(function (done) {
    // here you can clear fixtures, etc.
    // app.close();
    done();
});