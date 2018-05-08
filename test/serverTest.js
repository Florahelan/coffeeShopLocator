var expect  = require('chai').expect;
var app=require('../server')


describe('server status and content', function () {
    var url = "http://localhost:3000/";
    it("Server should listen to port", function()  {
        request(url , function(error, body) {
            expect(body).to.equal(server(),'Server is now listening on port number');
        });
    });
});

describe('GET /read', function() {
    it('returns a list of coffee shop', function(done) {
        request.get('/read')
            .expect(200)
            .end(function(err, res) {
                expect(res.body).to.have.lengthOf(48);
                done(err);
            });
    });
});

describe('POST /create', function() {
    it('Creates a new coffee shop', function(done) {
        request.post('/create')
            .send({
                
            })
            .expect(200)
            .end(function(err, res) {
                done(err);
            });
    });
});
