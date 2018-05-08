var CoffeeShop = function (id, name, address, lat, long) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.latitude = lat;
    this.longitude = long;
};


CoffeeShop.prototype.toJSON = function () {
    return {
        id: this.id,
        name: this.name,
        address: this.address,
        latitude: this.latitude,
        longitude: this.longitude
    };
};

module.exports.CoffeeShop = CoffeeShop;