var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

var controller = require('./app/controller/coffeeShopController.js').coffeeShopController;


app
    .listen(port, new function () {
        var inputFile = './app/resources/locations.csv';
        controller.init(inputFile, function (err, data) {
            if (err) {
                console.error(err);
            }
        });
    });

app.get('/read', function (req, res) {

    controller.readAllShops(function (err, data) {
        if (err) {
            sendFailureResp(res, 400, err);
        } else {
            var shops = [];
            for (var item in data) {
                if (data.hasOwnProperty(item)) {
                    shops.push(data[item]);
                }
            }
            sendSuccessResp(res, shops);
        }
    });
});

app.get('/read/:id', function (req, res) {
    var id = req.params["id"];
    if (id) {
        controller.readSingleShop(id, function (err, data) {
            if (err) {
                sendFailureResp(res, 400, err);
            } else {
                sendSuccessResp(res, data);
            }
        });
    } else {
        sendFailureResp(res, 400, "Error Invalid Params, Missing ID");
    }
});

app.post('/create', function (req, res) {
    console.log("We got the Create request ");
    var body = req.body;
    var valid = body.id && body.name && body.address && body.latitude && body.longitude;
    if (valid) {
        controller.addShop(body, function (err, data) {
            if (err) {
                sendFailureResp(res, 400, err);
            } else {
                sendSuccessResp(res, data);
            }
        });
    } else {
        sendFailureResp(res, 400, "Invalid Request params ");
    }
});


app.put('/update/:id', function (req, res) {
    console.log("We got the update request ");
    var id = req.params["id"];
    if (id) {
        var body = req.body;
        body.id = id;
        var valid = body.name && body.address && body.latitude && body.longitude;
        if (valid) {
            controller.updateShop(body, function (err, data) {
                if (err) {
                    sendFailureResp(res, 400, err);
                } else {
                    sendSuccessResp(res, data);
                }
            });
        } else {
            sendFailureResp(res, 400, "Invalid Request params ");
        }
    } else {
        sendFailureResp(res, 400, "Invalid Request params, Error no Id provided");
    }
});

app.delete('/delete/:id', function (req, res) {
    console.log("We got the delete request ");
    var id = req.params["id"];
    if (id) {
        controller.deleteShop(id, function (err, data) {
            if (err) {
                sendFailureResp(res, 400, err);
            } else {
                sendSuccessResp(res, data);
            }
        });
    } else {
        sendFailureResp(res, 400, "Error no Id provided ");
    }
});


app.post('/find-nearest', function (req, res) {
    console.log("We got the get-Nearest request ");
    var address = decodeURI(req.body.address);
    console.log("Address is " + address);

    controller.findNearest(address, function (err, data) {
        sendSuccessResp(res, data);
    });
});


function sendSuccessResp(res, data) {
    if (data) {
        res.send({
            success: true,
            code: 200,
            data: data
        });
    } else {
        res.send({
            success: true,
            code: 200,
        })
    }
};


function sendFailureResp(res, code, err) {
    if (err) {
        res.send({
            success: false,
            code: code,
            error: err
        });
    } else {
        res.send({
            success: false,
            code: code,
        })
    }
};

console.log('Server is now listening on port number :  ' + port);
