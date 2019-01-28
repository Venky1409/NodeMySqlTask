var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:1400");

// UNIT test begin

describe("Technical Assessment unit test",function() {

  // #1 should return home page

  it("should return home page",function(done) {

    // calling home page api
    server
    .get("/")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      // Error key should be false.
      res.body.error.should.equal(false);
      done();
    });
  });

  it("should suspend the user",function(done) {

    //calling /api/suspend api
    server
    .post('/api/suspend')
    .send({"student" : "venky.pinku@gmail.com"})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      done();
    });
  });

  it("should retrieve a list of students who can receive a given notification",function(done) {

    //calling /api/retrievefornotifications api
    server
    .post('/api/retrievefornotifications')
    .send({"teacher":  "teacherkenn@gmail.com","notification": "Hey everybody"})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res) {
      res.status.should.equal(200);
      done();
    });
  });

  it("should retrieve a list of students who can receive a given notification",function(done) {

    //calling /api/retrievefornotifications api
    server
    .post('/api/retrievefornotifications')
    .send({"teacher":  "teacherkenn@gmail.com","notification": "Hello students! @studentagnes@example.com @studentmiche@example.com"})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res) {
      res.status.should.equal(200);
      done();
    });
  });

  it("should retrieve a list of students common to a given list of teachers",function(done) {

    // calling /commonstudents api
    server
    .get("/api/commonstudents?teacher=teacherkenn%40gmail.com")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      done();
    });
  });

  it("should retrieve a list of project data",function(done) {

    // calling /projects api
    server
    .get("/api/projects")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      done();
    });
  });

});
