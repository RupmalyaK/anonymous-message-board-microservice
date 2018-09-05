/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const ThreadsHandler = require("../controller/ThreadsHandler.js");
const RepliesHandler = require("../controller/RepliesHandler.js");


module.exports =  (app , db) => {
  
  
  const threadsHandler = new ThreadsHandler(db);
  const repliesHandler = new RepliesHandler(db);
  app.route('/api/threads/:board')
        .post((req , res) => {

            const board = req.params.board;
            const text = req.body.text;
            const deletePassword = req.body.delete_password;
    
            if(!deletePassword && !text)
            {
              res.status(400).send("no delete_password and text");
              return;
            }
            if(!deletePassword)
            {
              res.status(400).send("no delete_password");
              return;
            }
            
            if(!text)
            {
             res.status(400).send("no text");
             return;   
            }
            
            threadsHandler.insertThread(board , text , deletePassword )
            .then(doc => res.redirect("/b/" + board + '/'))
            .catch(err => console.log(err));

      })
      .get((req ,res) => {

          const board = req.params.board;
          
         
          threadsHandler.getThreads(board)
          .then(docs => {
               const retObj = []; 
               docs.forEach(ele => {
                  const obj = {};
                  obj._id = ele._id; 
                  obj.text = ele.text;
                  obj.created_on = ele.created_on;
                  obj.bumped_on = ele.bumped_on;
                  
                 const replies = ele.replies.sort((a,b) => { 
                  return b.created_on.getTime() - a.created_on.getTime(); 
                  }).slice(0,3);
                   obj.replies = []; 
                  replies.forEach((ele) => {
                   const repObj = {};
                   repObj._id = ele._id;
                   repObj.text = ele.text;
                   repObj.created_on = ele.created_on;
                   obj.replies.push(repObj);
                  });
                    
                  obj.replycount = ele.replycount;
                  retObj.push(obj);  
               }); 
            
        
            res.status(200).json(retObj); 
          })
          .catch(err => console.log(err)); 
      
      })
    .put((req , res) => {
    
    const board = req.params.board; 
    const threadId = req.body.thread_id;
    threadsHandler.reportThread(board , threadId)
    .then((doc) => {
    if (!doc.value)
    {
      res.status(400).send("not success");
      return;
    }
      res.status(200).send("success");
    })
    .catch(err => console.log(err));
      
  })
    .delete((req , res) => {
  const board = req.params.board; 
  const threadId = req.body.thread_id;
  const deletePassword = req.body.delete_password;   
  
  threadsHandler.deleteThread(board , threadId , deletePassword)
  .then(doc => {
  if (doc === "incorrect password")
  {
    res.status(200).send(doc);
    return;
  }
    
  if(doc === "wrong thread id")
  {
    res.status(200).send(doc);
    return; 
  }
    if(!doc.result.n)
    { 
      res.status(200).send("not success");
      
    }
    else {
    
        res.status(200).send("success");
    }

  })
  .catch(err => console.log(err)); 
  });
    
  app.route('/api/replies/:board')

      .post((req , res) => {
       
      const board = req.params.board; 
      const threadId = req.body.thread_id; 
      const text = req.body.text; 
      const deletePassword = req.body.delete_password; 
      repliesHandler.addReply(board , threadId ,text , deletePassword)
      .then(doc => res.redirect("/b/" + board + '/' + threadId ))
      .catch(err => console.log(err));
  })
  
    .get((req,res) => {
    
    const board = req.params.board; 
    const threadId = req.query.thread_id;
    
    repliesHandler.getReplies(board , threadId)
    .then(doc => {
      if(!doc) {
        res.status(422).send("no thread");
        return;
      }
      doc.replies.sort((a,b) => { 
      return b.created_on.getTime() - a.created_on.getTime(); 
      });
      const retObj = {}; 
      retObj._id = doc._id;
      retObj.text = doc.text; 
      retObj.created_on = doc.created_on; 
      retObj.bumped_on = doc.bumped_on;
      
      retObj.replies = []; 
      doc.replies.forEach(ele => {
       const repObj = {};
       repObj._id = ele._id;
       repObj.text = ele.text;
       repObj.created_on = ele.created_on; 
       retObj.replies.push(repObj); 
      });
     
      res.status(200).json(retObj); 
    })
    .catch(err => console.log(err)); 
    
  })
  .put((req , res) => {
   const board = req.params.board; 
   const threadId = req.body.thread_id;
   const replyId = req.body.reply_id; 
    
   repliesHandler.reportReply(board , threadId , replyId)
   .then(doc => {
   if (!doc.result.n)
   {  
     res.status(400).send("not success");
     return;
   }
     res.status(200).send("success");
   })
   .catch(err => console.log(err)); 
  })
  .delete((req , res) => {
  
    const board = req.params.board;
    const threadId = req.body.thread_id;
    const replyId = req.body.reply_id; 
    const deletePassword = req.body.delete_password; 
    repliesHandler.deleteReply(board , threadId , replyId , deletePassword)
    .then(doc => {
    if (doc === "wrong thread")
    {
      res.status(200).send("wrong thread");
      return; 
    }
    if(doc === "incorrect password")
    {
      res.status(200).send("incorrect password");
      return; 
    }
      
    if(doc === "wrong reply_id")
    {
      res.status(200).send("wrong reply_id");  
      return; 
    }
    res.status(200).send(doc);   
    })
    .catch(err => console.log(err));
  });
};
