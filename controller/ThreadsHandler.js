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
        
              db.collection(boardName).aggregate().sort({"bumped_on":-1}).limit(10) 
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
}