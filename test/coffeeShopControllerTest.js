var chai = require('chai');
var assert = chai.assert;
let should = chai.should();
var expect = chai.expect;
var controller = require('../app/controller/coffeeShopController').coffeeShopController;

describe('read', function () {
    beforeEach(function (done) { //Before each test fill up the data
        controller.init('./app/resources/locations.csv', function (err) {
            if (err) {
                fail("Unable to read from file")
            } else {
                done();
            }

        });
    });
});


describe('retrieveAllData function', function () {
    it('should read all the contents of the file', function (done) {
        controller.readAllShops(function (err, data) {
            if (err) {
                fail("Unable to read all shops");
            }
            data.should.be.a('object');
            done();
        });
    });
});

describe('retrieveSingleShop function', function () {
    it('should return only single item from the file', function (done) {
        controller.readSingleShop(5, function (err, data) {
            if (err) {
                fail("Unable to read Single shop");
            }

            var coffeeShop = data;
            coffeeShop.id.should.be.eql('5');
            coffeeShop.name.should.be.eql(' Blue Bottle Coffee');
            coffeeShop.address.should.be.eql(' 315 Linden St');
            coffeeShop.latitude.should.be.eql(' 37.776407');
            coffeeShop.longitude.should.be.eql(' -122.42325067520142');
            done();
        });
    });

    it('should throw an error if shop not found', function (done) {
        controller.readSingleShop(500, function (err, data) {
            expect(err).to.equal("Coffee Shop for 500 is not found");
            done();
        });
    });
});

describe('addShop function', function () {
    it('should add a new shop to the list', function (done) {
        var newShop = {
            id: '70',
            name: 'new Shop',
            address: 'new Address',
            latitude: '1234',
            longitude: '4352'
        };
        controller.addShop(newShop, function (err, data) {
            if (err) {
                fail("Unable to add shop");
            }
            expect(data).to.deep.equal(newShop.id);
            done();
        });
    });


    it('should throw an error if shop already added', function (done) {
        var newShop = {
            id: '7',
            name: 'new Shop',
            address: 'new Address',
            latitude: '1234',
            longitude: '4352'
        };
        controller.addShop(newShop, function (err, data) {
            expect(err).to.deep.equal("Coffee Shop for 7 is already found");
            done();
        });
    });
});

describe('updateShop function', function () {
    it('should update an existing shop in the list', function (done) {
        var updateShop = {
            id: '7',
            name: 'My Coffee',
            address: 'new Address',
            latitude: '1234',
            longitude: '4352'
        };
        controller.updateShop(updateShop, function (err, data) {
            if (err) {
                fail("Unable to update shop");
            }
            expect(data).to.deep.equal(updateShop);
            done();
        });
    });

    it('should throw an error when no shop to update', function (done) {
        var updateShop = {
            id: '700',
            name: 'My Coffee',
            address: 'new Address',
            latitude: '1234',
            longitude: '4352'
        };
        controller.updateShop(updateShop, function (err, data) {
            expect(err).to.deep.equal("Coffee Shop for 700 is not found");
            done();
        });
    });
});

describe('deleteShop function', function () {
    it('should delete a shop from the list', function (done) {
        var id = 3;
        controller.deleteShop(id, function (err, data) {
            if (err) {
                fail("Unable to Delete shop");
            }
            expect(data).to.deep.equal("Successfully deleted 3");
            done();
        });
    });

    it('should throw an error when there is no shop on list', function (done) {
        var id = 300;
        controller.deleteShop(id, function (err, data) {
            expect(err).to.deep.equal("Coffee Shop for 300 is not found");
            done();
        });
    });

});


