var express = require('express'),
    app = express(),
    //By default it displays in 4500, If someother application is using 4500 then it runs on unused port
    port = process.env.PORT || 4500;


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


var controller = require('./app/controller/coffeeShopController.js').coffeeShopController;

//Reads the data from locations.csv
app
    .listen(port, function () {
        var inputFile = './app/resources/locations.csv';
        responseUtils.readFromFile(inputFile);
        console.log("Running on port " + port);
    });

//localhost:PORT/read
//Displays all the Coffee Shop details like id,name,address, latitude and longitude

app
    .get('/read', function (req, res) {
        controller
            .readAllShops(function (err, data) {
                if (err) {
                    responseUtils.failure(res, 400, err);
                } else {
                    var shops = [];
                    for (var item in data) {
                        if (data.hasOwnProperty(item)) {
                            shops.push(data[item]);
                        }
                    }
                    responseUtils.success(res, shops);
                }
            });
    });

//localhost:PORT/read/<id>
//Displays a particular coffee shop details based on the id
//if id is not given it throws error
app
    .get('/read/:id', function (req, res) {
        var id = req.params["id"];
        if (id) {
            controller
                .readSingleShop(id, function (err, data) {
                    if (err) {
                        responseUtils.failure(res, 400, err);
                    } else {
                        responseUtils.success(res, data);
                    }
                });
        } else {
            responseUtils.failure(res, 400, "Error Invalid Params, Missing ID");
        }
    });

//locahost:PORT/create
//It Accepts a new coffee shop details(id,name,address, latitude and longitude) and it is added to the existing shop
// details.
//If the params doesn't match it throws error
app
    .post('/create', function (req, res) {
        var body = req.body;
        var valid = body.id && body.name && body.address && body.latitude && body.longitude;
        if (valid) {
            controller
                .addShop(body, function (err, data) {
                    if (err) {
                        responseUtils.failure(res, 400, err);
                    } else {
                        responseUtils.success(res, data);
                    }
                });
        } else {
            responseUtils.failure(res, 400, "Invalid Request params ");
        }
    });

//localhost:PORT/update/<id>
//Updates the coffee shop details based on the given id
//If the id doesn't exist it throws error

app
    .put('/update/:id', function (req, res) {
        var id = req.params["id"];
        if (id) {
            var body = req.body;
            body.id = id;
            var valid = body.name && body.address && body.latitude && body.longitude;
            if (valid) {
                controller.updateShop(body, function (err, data) {
                    if (err) {
                        responseUtils.failure(res, 400, err);
                    } else {
                        responseUtils.success(res, data);
                    }
                });
            } else {
                responseUtils.failure(res, 400, "Invalid Request params ");
            }
        } else {
            responseUtils.failure(res, 400, "Invalid Request params, Error no Id provided");
        }
    });

//localhost:PORT/delete/<id>
//Deletes the details based on the given id
//If the id doesn't exist it throws error
app
    .delete('/delete/:id', function (req, res) {
        var id = req.params["id"];
        if (id) {
            controller.deleteShop(id, function (err, data) {
                if (err) {
                    responseUtils.failure(res, 400, err);
                } else {
                    responseUtils.success(res, data);
                }
            });
        } else {
            responseUtils.failure(res, 400, "Error no Id provided ");
        }
    });

//localhost:PORT/find-nearest
//finds the nearest coffee shop based on the address given
app
    .post('/find-nearest', function (req, res) {
        var address = decodeURI(req.body.address);
        controller.findNearest(address, function (err, data) {
            if (err) {
                responseUtils.failure(res, 400, err);
            } else {
                responseUtils.success(res, data);
            }
        });
    });


// utils for handling success and failure
var responseUtils = function () {

    var readFromFile = function readFromFile(inputFile) {
        controller
            .init(inputFile, function (err, data) {
                if (err) {
                    console.error(err);
                }
            });
    };

    var sendSuccessResp = function (res, data) {
        var sendResp = {success: true, code: 200};
        if (data) {
            sendResp.data = data;
        }
        res.send(sendResp);
    };

    var sendFailureResp = function (res, code, err) {
        var sendResp = {success: false, code: code};
        if (err) {
            sendResp.err = err;
        }
        res.send(sendResp);
    };

    return {
        readFromFile: readFromFile,
        success: sendSuccessResp,
        failure: sendFailureResp
    };
}();

app.utils = responseUtils;
module.exports = app; // for testing

