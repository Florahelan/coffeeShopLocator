var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


var controller = require('./app/controller/coffeeShopController.js').coffeeShopController;


app
    .listen(port, function () {
        var inputFile = './app/resources/locations.csv';
        controller
            .init(inputFile, function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("File Sucessfully read");
                }
            });
    });

//localhost:PORT/read
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
app
    .post('/create', function (req, res) {
        console.log("We got the create request ");
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
app
    .put('/update/:id', function (req, res) {
        console.log("We got the update request ");
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
            responseUtils.failure(res, 400, "Invalid Request params, Error! no Id provided");
        }
    });

//localhost:PORT/delete/<id>
app
    .delete('/delete/:id', function (req, res) {
        console.log("We got the delete request ");
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
app
    .post('/find-nearest', function (req, res) {
        console.log("We got the get-Nearest request ");
        var address = decodeURI(req.body.address);
        console.log("Address is " + address);

        controller.findNearest(address, function (err, data) {
            responseUtils.success(res, data);
        });
    });


var responseUtils = function () {
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
        } else {
            res.send(sendResp);
        }
    };

    return {
        success: sendSuccessResp,
        failure: sendFailureResp
    };
}();


console.log('Server is now listening on port number :  ' + port);
