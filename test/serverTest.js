process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');

let should = chai.should();
var expect = chai.expect;

var server = require('../server');
var utils = server.utils;

chai.use(chaiHttp);


describe('read', function () {
    beforeEach(function (done) { //Before each test fill up the data
        utils.read('./app/resources/locations.csv');
        done();
    });
});

describe('GET ', function () {

    it('read without any path should return all results ', function (done) {
        chai.request(server)
            .get('/read')
            .end((function (err, res) {
                res.should.have.status(200);
                res.body.data.should.be.a('array');
                res.body.data.length.should.be.eql(48);
                done();
            }));
    });

    it('read with id should return for single id ', function (done) {
        chai.request(server)
            .get('/read/4')
            .end(function (err, res) {
                if (err) {
                    fail(err);
                }
                res.should.have.status(200);
                if (res.body.data.should != null) {
                    var coffeeShop = res.body.data;
                    coffeeShop.id.should.be.eql('4');
                    done();
                } else {
                    fail("Response body should not be null");
                }
            });

    });
});



describe('Delete', function () {
    it('Should remove a coffeeShop from the list', function (done) {
        chai.request(server)
            .delete('/delete/2')
            .end(function (err, res) {
                res.should.have.status(200);
                if (res.body.data.should != null) {
                    res.body.data.should.be.eql("Successfully deleted 2");
                    done();
                } else {
                    fail();
                }
            });
    });
});

describe('update ', function () {
    it('Should update a coffeeShop from the list', function (done) {
        chai.request(server)
            .put('/update/6')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                id: '6',
                name: 'update',
                address: 'new Address',
                latitude: '1234',
                longitude: '4352'
            })
            .end(function (err, res) {
                res.should.have.status(200);
                if (res.body.data.should != null) {
                    var coffeeShop = res.body.data;
                    coffeeShop.id.should.be.eql('6');
                    coffeeShop.name.should.be.eql('update');
                    coffeeShop.address.should.be.eql('new Address');
                    coffeeShop.latitude.should.be.eql('1234');
                    coffeeShop.longitude.should.be.eql('4352');
                    done();
                } else {
                    fail();
                }
            });
    });
});


describe('POST ', function () {
    it('Should add a coffeeShop to the list and return the id ', function (done) {
        chai.request(server)
            .post('/create')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                id: '320',
                name: 'testing',
                address: 'sample address',
                latitude: '1234',
                longitude: '4352'
            })
            .end(function (err, res) {
                res.should.have.status(200);
                if (res.body.data.should != null) {
                    res.body.data.should.be.eql("320");
                    done();
                } else {
                    fail();
                }
            });
    });
});
