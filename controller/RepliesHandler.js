"use strict"

const ObjectId = require("mongodb").ObjectId;


module.exports = function (db) {
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
          const replies = doc.replies; 
          for(let ele = 0 ; ele < replies.length  ; ele++){
             if(replies[ele]._id.equals(replyId)){
                 
               if(replies[ele].delete_password != deletePassword)
               {
                 resolve("incorrect password");
                 return; 
               }
                db.collection(boardName).update({"_id": new ObjectId(threadId)}, {"$pull":{
                "replies":{"_id":new ObjectId(replyId)}
                } , "$inc":{"replycount":-1}})
                .then(doc => resolve ("success"))
                return;
             }  
           }
          resolve("not success");
       
        })
        .catch(err => reject(err));  
        });
      }
      
  }