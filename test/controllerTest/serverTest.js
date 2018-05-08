var expect = require('chai').expect;
var request = require('request');
chai.use(require('chai-http'));
const server = require('server.js')


describe('server status and content', function () {
    var url = "http://localhost:3000/read";
    it("returns status 200", function()  {
        request(url , function(error, response, body) {
            expect(body).to.equal('Server is now listening on port number');
        });
    });
});

