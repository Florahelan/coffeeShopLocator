module.exports.coffeeShopController = function () {

    var fileReader = require('fs');
    const parse = require('csv-reader');
    const Decoder = require('autodetect-decoder-stream');

    //User Defined
    var CoffeeShop = require('../model/CoffeeShop').CoffeeShop;
    var placesController = require('./placesController').places;

    var coffeeShopsMap = {};


    var initFromFile = function (inputFile, callback) {

        var inputStream = fileReader.createReadStream(inputFile)
            .pipe(new Decoder({ defaultEncoding: '1255' }));

        inputStream
            .pipe(parse({delimiter: ',', trim: true}))
            .on('data', function (row) {
                var coffeeShop = new CoffeeShop(row[0], row[1], row[2], row[3], row[4]);
                coffeeShopsMap[coffeeShop.id] = coffeeShop;
            })
            .on('error', function (err) {
                callback(err);
            });
    };

    var retrieveAllData = function (callback) {
        callback(null, coffeeShopsMap);
    };

    var retrieveSingleShop = function (id, callback) {
        var coffeeShop = coffeeShopsMap[id];
        if (coffeeShop) {
            callback(null, coffeeShop);
        } else {
            callback("Coffee Shop for " + id + " is not found");
        }
    };

    var addShop = function (data, callback) {
        var coffeeShop = coffeeShopsMap[data.id];
        if (coffeeShop) {
            callback("Coffee Shop for " + data.id + " is already found");
            return;
        }
        try {
            var newShop = new CoffeeShop(data.id, data.name, data.address, data.latitude, data.longitude);
            coffeeShopsMap[newShop.id] = newShop;
            callback(null, newShop.id);
        } catch (err) {
            callback(err);
        }
    };


    var updateShop = function (data, callback) {
        var coffeeShop = coffeeShopsMap[data.id];
        if (coffeeShop) {
            coffeeShop.id = data.id;
            coffeeShop.name = data.name;
            coffeeShop.address = data.address;
            coffeeShop.latitude = data.latitude;
            coffeeShop.longitude = data.longitude;
            callback(null, data);
        } else {
            callback("Coffee Shop for " + data.id + " is not found");
        }
    };


    var deleteShop = function (id, callback) {
        var coffeeShop = coffeeShopsMap[id];
        if (coffeeShop) {
            delete coffeeShopsMap[id];
            callback(null, "Successfully deleted " + id);
        } else {
            callback("Coffee Shop for " + id + " is not found");
        }
    };

    var getNearest = function (address, serverCallBack) {
        placesController.getNearest({
            address: address,
            map: coffeeShopsMap
        }, function (err, data) {
            if (err) {
                console.log("Error " + err);
                return;
            }
            console.log(data);
            serverCallBack(null, data);
        });
    };

    return {
        init: initFromFile,
        readAllShops: retrieveAllData,
        readSingleShop: retrieveSingleShop,
        addShop: addShop,
        updateShop: updateShop,
        deleteShop: deleteShop,
        findNearest: getNearest
    };
}();

