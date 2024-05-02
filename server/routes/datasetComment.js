const express = require("express");
const router = express.Router();
// const MongoClient = require('mongodb').MongoClient;
// // MongoDB connection URL
// const mongoUri = 'mongodb://localhost:27017';
// const client = new MongoClient(mongoUri);
const datasetComment = require("../models/dataset_comment");
const modelComment = require("../models/model_comments");


// const db = client.db('pravahini');
//add new comment 
router.put('/comment', (req, res) => {
    const data = {
      _id: req.body.data.userId,
      otherData: req.body.data
    };
  
    // console.log("otherData",data.otherData);
  
    let collection;
    if (req.originalUrl == '/dataset/comment') {
      collection = datasetComment;
    } else {
      collection = modelComment;
    }
  
    collection.findOneAndUpdate(
      { _id: data._id },
      {
        $push: {
          comments: {
            $each: [{ ...data.otherData, createdAt: new Date() }],
            $sort: { createdAt: -1 },
            $unset: { "_id": 1 }
          }
        }
      },
      { upsert: true, returnOriginal: false, new: true }
    )
      .then(result => {
        res.status(200).json({ message: 'User data saved successfully', result });
      })
      .catch(err => {
        console.error('Error saving user data:', err);
        res.status(500).json({ error: 'Failed to save user data' });
      });
  });

//reply to specific comment
router.put('/comment/reply', async (req, res) => {
    const newReply = req.body;
    let collection;
    if (req.originalUrl == '/dataset/comment/reply') {
        collection =datasetComment;
    } else {
        collection = modelComment;
    }
    // console.log("reply.....", newReply, "end")

    const commentId = newReply.repliedToCommentId;
    if (!newReply.parentOfRepliedCommentId) {
        const result = await collection.updateOne(
            { 'comments.comId': commentId },
            { $push: { 'comments.$[elem].replies': newReply } },
            { arrayFilters: [{ 'elem.comId': commentId }] }, (err, result) => {
                if (err) {
                    console.error('Error saving user data:', err);
                    res.status(500).json({ error: 'Failed to save user reply' });
                    return;
                }
                res.status(200).json({ message: 'User reply saved successfully' });
            }
        );
    } else {
        const result = await collection.updateOne(
            { 'comments.comId': newReply.parentOfRepliedCommentId },
            { $push: { 'comments.$[elem].replies': newReply } },
            { arrayFilters: [{ 'elem.comId': newReply.parentOfRepliedCommentId }] }, (err, result) => {
                if (err) {
                    console.error('Error saving user data:', err);
                    res.status(500).json({ error: 'Failed to save user reply' });
                    return;
                }
                res.status(200).json({ message: 'User reply saved successfully' });
            }
        );
    }

});


//get all comment
router.get('/comments', async (req, res) => {
    let collection;
    try {
        if (req.originalUrl == '/dataset/comments') {
            collection = datasetComment;
        } else {
            collection = modelComment;
        }
        const comments = await collection.find({}).lean();
        // console.log('User data retrieved successfully:', comments);
        res.status(200).json(comments);
    } catch (err) {
        console.error('Error retrieving user data:', err);
        res.status(500).json({ error: 'Failed to retrieve user data' });
    }

    
});


//delete comment
router.delete('/comment/delete', async (req, res) => {
    try {
    let result;
    let collection;
    const {commentId}  = req.body;
    // console.log("var cid",commentId)

    // console.log("coment Id", req.body);
   
        if (req.originalUrl == '/dataset/comment/delete') {
            collection = datasetComment;
        } else {
            collection = modelComment;
        }

        if (!commentId.parentOfDeleteId) {
            result = await collection.updateMany(
                {}, // No filter condition, update all documents
                { $pull: { comments: { comId: commentId.comIdToDelete } } }
            );
        } else {
            result = await collection.updateOne(
                { 'comments.comId': commentId.parentOfDeleteId },
                { $pull: { 'comments.$[].replies': { comId: commentId.comIdToDelete } } }
            );
        }
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.json({ message: `Deleted ${result.modifiedCount} comment(s)` });
    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }

});


//edit comment
router.put('/comment/edit', async (req, res) => {
    const data = req.body;
    let result;
    let collection;
    // console.log("edit....", req.body);
    try {
        if (req.originalUrl == '/dataset/comment/edit') {
            collection = datasetComment;
        } else {
            collection = modelComment;
        }
        if (!data.parentOfEditedCommentId) {
            result = await collection.updateOne(
                { 'comments.comId': data.comId },
                { $set: { 'comments.$[elem].text': data.text } },
                { arrayFilters: [{ 'elem.comId': data.comId }] }
            );
        } else {
            result = await collection.updateOne(
                { 'comments.comId': data.parentOfEditedCommentId, 'comments.replies.comId': data.comId },
                { $set: { 'comments.$[].replies.$[reply].text': data.text } },
                { arrayFilters: [{ 'reply.comId': data.comId }] }
            );
        }

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.json({ message: `Updated ${result.modifiedCount} comment(s)` });
    } catch (err) {
        console.error('Error updating comment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }

});

module.exports = router;
