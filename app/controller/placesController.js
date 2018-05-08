module.exports.places = function () {
    var geodist = require('geodist');
    var googleMapsClient = require('@google/maps').createClient({
        key: "AIzaSyAgLFO78XqTXno8xMxoxMdcJflrZN8Bmwg"
    });

    var getNearest = function (data, callback) {
        googleMapsClient.geocode({
            address: data.address,
        }, function (err, response) {
            if (!err) {
                var results = response.json.results;
                var lat = results[0].geometry.location.lat;
                var lng = results[0].geometry.location.lng;

                //console.log("Retrieved from Google Lat: " + lat + " Long : " + lng);
                var minDistance = 100.00;
                var distance = 100.00;
                var selectedShop;

                var map = data.map;
                for (var item in map) {
                    if (map.hasOwnProperty(item)) {
                        var shop = map[item];
                        distance = geodist(
                            {lat: lat, lon: lng},
                            {lat: shop.latitude, lon: shop.longitude},
                            {exact: true});
                        if (distance <= minDistance) {
                            console.log("Distance : " + distance);
                            minDistance = distance;
                            selectedShop = shop;
                        }
                    }
                }
                callback(null, selectedShop);
            } else {
                console.log("error " + err);
            }
        });
    };
    return {
        getNearest: getNearest
    };
}();