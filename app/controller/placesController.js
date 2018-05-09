module.exports.places = function () {
    var geodist = require('geodist');
    //Place API and Geocoding API is enabled based on the Apikey in cloud.google.com
    var googleMapsClient = require('@google/maps').createClient({
        key: "AIzaSyCOhB9SH-7c3lpTninJuypWweKTlGSpIWQ"
    });


    //This function uses geodist to called the distance based on the latitude and longitude given.
    //If the coffee shop is with 100 miles to the given distance then it displays the name
    //Else it displays that Coffe shop not found.

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
                var selectedShop=null;

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
                if(!selectedShop){
                    callback('There is no coffee shop within 100 miles');
                    return;
                }
                callback(null, selectedShop);
            } else {
                console.log("error " + err);
                callback(err);
            }
        });
    };
    return {
        getNearest: getNearest
    };
}();