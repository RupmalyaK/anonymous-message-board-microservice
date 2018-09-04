"use strict"

const ObjectId = require("mongodb").ObjectId;


module.exports = function (db) {
          
          this.insertThread = (boardName , text , delete_password) => {
              return new Promise ((resolve , reject) => {  
                  db.collection(boardName).insertOne({
                    text,
                    "created_on":new Date(Date.now()),
                    "bumped_on" :new Date(Date.now()),
                    "replies":[],
                    "replycount":0,
                    delete_password,
                    "reported":false
                  })
                  .then(doc => { console.log(boardName);
                      resolve(doc.ops[0]); 
                  })
                  .catch(err => reject(err)); 
              });  
          }    
        
        this.getThreads = (boardName) => {
          
        return new Promise((resolve , reject) => {
        
              db.collection(boardName).aggregate().sort({"bumped_on":-1}).limit(10) //Doubt: This sort is not working , so I am doing an external sort..
              .toArray((err , docs) => {
                if (err) reject(err);
                resolve(docs);   
              }); 
        
          });
        
        }  
        
        this.reportThread = (boardName , threadId) => {
        
          return new Promise ((resolve , reject) => {
            
            db.collection(boardName).findAndModify({"_id": new ObjectId(threadId)} , [] , {$set:{"repoted":true}} , {"new":true})
            .then(doc => resolve(doc))
            .catch(err => reject(err));
          })  
          
        }
        
        this.deleteThread = (boardName , threadId , deletePassword) => {
         return new Promise ((resolve , reject) => {
         
           db.collection(boardName).findOne({"_id": new ObjectId(threadId)})
           .then(doc =>{
                  if(!doc)
                  {
                    resolve("wrong thread id");
                    return; 
                  }
                 if (doc.delete_password === deletePassword)
                 {
                      db.collection(boardName).deleteOne({"_id": new ObjectId(threadId)})
                       .then(doc => { resolve(doc);       
                            }); 
                   return;
                 }
                 resolve("incorrect password");

               })
           .catch(err => reject (err));
         
         });
        }
        
       this.addReply = (boardName , threadId , text , deletePassword) => {
         return new Promise ((resolve , reject) => {
         
           const replyObj = {}; 
           replyObj._id = new ObjectId();
           replyObj.text = text;
           replyObj.created_on = new Date(Date.now()); 
           replyObj.delete_password = deletePassword;
           replyObj.reported = false; 
           
           db.collection(boardName).findAndModify({"_id":new ObjectId(threadId)} , [] , {"$push":{"replies":replyObj } , "$inc":{"replycount":1} , "$set":{"bumped_on":new Date(Date.now())}} , {"new":true})
           .then(doc => {resolve(doc)})
           .catch(err => reject(err))
           
         });
       } 
          
      this.getReplies = (boardName , threadId) => {
        return new Promise((resolve , reject) => {
        
          db.collection(boardName).findOne({"_id":new ObjectId(threadId)})
          .then(doc => resolve(doc))
          .catch(err => reject(err));
        });
      }
      
      this.reportReply = (boardName , threadId , replyId) => {
        
        return new Promise ((resolve , reject) => {
        db.collection(boardName).update({"_id": new ObjectId(threadId) , "replies._id": new ObjectId(replyId)} , {"$set":{
        "replies.$.reported":true
        }})
         .then(doc => resolve(doc))
         .catch(err => reject(err));  
        });
      }
      
      this.deleteReply = (boardName , threadId , replyId , deletePassword) => {
        return new Promise ((resolve , reject) => {
        db.collection(boardName).findOne({"_id":new ObjectId(threadId)})
        .then(doc => {
          if (!doc)
          {
            resolve("wrong thread");
            return;
          }
          if(doc.replies.length === 0)
          {
            resolve("no reply in this thread");
          }
          doc.replies.forEach((ele , index , array) => { 
          if(ele._id.equals(replyId)) 
          {
            if(ele.delete_password != deletePassword) {
            
              resolve("incorrect password");
              return; 
            }
           db.collection(boardName).update({"_id": new ObjectId(threadId)}, {"$pull":{
            "replies":{"_id":new ObjectId(replyId)}
            } , "$inc":{"replycount":-1}})
            .then(doc => resolve ("success"))
            return;
          } 
             if(index === array.length) 
             {
                resolve("not success");                   
             }
          })
        })
        .catch(err => reject(err));  
        });
      }
      
  }


