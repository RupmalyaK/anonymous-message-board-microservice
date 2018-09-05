/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
      test("POST /api/threads/freecodecamp => with text and delete_password", (done) =>{
           
        chai.request(server)
        .post("/api/threads/freecodecamp")
        .send({"text":"freecodecampthread",
               "delete_password":"123456"
              })
        .end((err , res) => {
          assert.equal(res.status , 200);
          done();
        }); 
      
      });
      
      test("POST /api/threads/freecodecamp => with text but no delete_password" , (done) => {
      chai.request(server)
        .post("/api/threads/freecodecamp")
        .send({"text":"freecodecampthread"
              })
        .end((err , res) => {
              assert.equal(res.status , 400 );
              assert.equal(res.text , "no delete_password");
              done();
      });
      });
      
      test("POST /api/threads/freecodecamp => with no text but with delete_password" , (done) => {
      chai.request(server)
        .post("/api/threads/freecodecamp")
        .send({"delete_password":"123456"
              })
        .end((err , res) => {
              assert.equal(res.status , 400 );
              assert.equal(res.text , "no text");
              done();
      });
    });
      
      test("POST /api/threads/freecodecamp => with no text and no delete_password" , (done) => {
      chai.request(server)
        .post("/api/threads/freecodecamp")
        .end((err , res) => {
              assert.equal(res.status , 400 );
              assert.equal(res.text , "no delete_password and text");
              done();
      });
    }); 
  });
    suite('GET', function() {
      
      test("GET /api/threads/freecodecamp" , (done) => {
      chai.request(server)
        .get("/api/threads/freecodecamp")
        .end((err , res) => {
              assert.equal(res.status , 200);
              assert.isArray(res.body, 'response should be an array');
              assert.property(res.body[0], "text", "thread should contain text");
              assert.property(res.body[0], "created_on", "thread should contain created_on");
              assert.property(res.body[0], "bumped_on", "thread should contain bumped_on");
              assert.property(res.body[0], "replies", "thread should contain replies");
              assert.isArray(res.body[0].replies, "replies", "thread should contain replies");      
              done();
      });
    });
      
  });
    
    suite('DELETE', function() {
     
      test("DELETE /api/threads/freecodecamp? => with wrong delete password" , (done) => {
      chai.request(server)
        .delete("/api/threads/freecodecamp")
        .send({"thread_id":"5b8f88d8d809535e40590087",
               "delete_password":"12345" 
              })
        .end((err , res) => {
              assert.equal(res.status , 200 );
              assert.equal(res.text , "incorrect password");
              done();
      });
    }); 
      
    /* test("DELETE /api/threads/freecodecamp? => with right delete password" , (done) => {
      chai.request(server)
        .delete("/api/threads/freecodecamp")
        .send({"thread_id":"5b8f885bfebbdf5b3cec9b57",
               "delete_password":"123456" 
              })
        .end((err , res) => {
              assert.equal(res.status , 200 );
              assert.equal(res.text , "success");
              done();
      });
    });  */
    });
    
    suite('PUT', function() {
      test("PUT /api/threads/freecodecamp => with valid thread_id"  , (done) => {
      chai.request(server)
        .put("/api/threads/freecodecamp")
        .send({"thread_id":"5b8f892c409a5d5ec54695c8"})
        .end((err , res) => {
              assert.equal(res.status , 200);
              assert.equal(res.text , "success");
              done();
      });
    });
    
      test("PUT /api/threads/freecodecamp => with invalid thread_id"  , (done) => {
      chai.request(server)
        .put("/api/threads/freecodecamp")
        .send({"thread_id":"5b8f892c409a5d5ec54695c6"})
        .end((err , res) => {
              assert.equal(res.status , 400);
              assert.equal(res.text , "not success");
              done();
      });
    }); 
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
       test("POST /api/replies/freecodecamp" , (done) => {
      chai.request(server)
        .post("/api/replies/freecodecamp")
        .send(
        {"thread_id":"5b8f8cd9cffdf6782a88dc04",
         "text":"freecodecamp reply",
          "delete_password":"123456"
        }
          )
        .end((err , res) => {
              assert.equal(res.status , 200 );
              done();
      });
    }); 
    });
    
    suite('GET', function() {
      
      test("get /api/replies/freecodecamp => with valid thread_id" , (done) => {
      chai.request(server)
        .get("/api/replies/freecodecamp")
        .query({"thread_id":"5b8f8cd9cffdf6782a88dc04"})
        .end((err , res) => { 
              assert.equal(res.status , 200);
              assert.property(res.body, "text", "thread should contain text");
              assert.property(res.body, "created_on", "thread should contain created_on");
              assert.property(res.body, "bumped_on", "thread should contain bumped_on");
              assert.property(res.body, "replies", "thread should contain replies");
              assert.isArray(res.body.replies, "replies", "replies should be an array"); 
              assert.property(res.body.replies[0], "text", "reply should contain text");
              assert.property(res.body.replies[0], "created_on", "reply should contain created_on");
              done();
      });
    });
      
     test("get /api/replies/freecodecamp => with invalid thread_id" , (done) => {
      chai.request(server)
        .get("/api/replies/freecodecamp")
        .send({"thread_id":"5b8f8cd9cffdf6782a88dc05",
              })
        .end((err , res) => { 
              assert.equal(res.status , 422);
              assert.equal(res.text , "no thread" , "No thread should present with this thread_id");
              done();
      });
    });
      
    });
    
    suite('PUT', function() {
      
    test("PUT /api/replies/freecodecamp => with valid thread_id and reply_id" , (done) => {
      chai.request(server)
        .put("/api/replies/freecodecamp")
        .send({"thread_id":"5b8f8cd9cffdf6782a88dc04",
                 "reply_id":"5b8f942461a05d2ed74845e2"
               })
        .end((err , res) => { 
              assert.equal(res.status , 200);
              assert.equal(res.text , "success");
              done();
      });
    });
      
    });
    
    suite('DELETE', function() {
      
     /* test("DELETE /api/replies/freecodecamp => with valid thread_id , reply_id and delete_password" , (done) => {
      chai.request(server)
        .delete("/api/replies/freecodecamp")
        .send({"thread_id":"5b8f8cd9cffdf6782a88dc04",
                 "reply_id":"5b8f96825d20b63aa0f36a37",
                  "delete_password":"123456" 
               })
        .end((err , res) => { 
              assert.equal(res.status , 200);
              assert.equal(res.text , "success");
              done();
      });
    });*/
      
     test("DELETE /api/replies/freecodecamp => with valid thread_id , reply_id and delete_password" , (done) => {
      chai.request(server)
        .delete("/api/replies/freecodecamp")
        .send({"thread_id":"5b8f8cd9cffdf6782a88dc04",
                 "reply_id":"5b8f96825d20b63aa0f36a37",
                  "delete_password":"123456" 
               })
        .end((err , res) => { 
              assert.equal(res.status , 200);
              assert.equal(res.text , "not success");
              done();
      });
    }); 
    });
    
  });

});
