const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    _id: Number,
    comments: [
        {
            userId: String,
            comId: String,
            avatarUrl: String,
            fullName: String,
            text: String,
            createdAt: Date,
            replies: [
                {
                    repliedToCommentId: String,
                    text: String,
                    comId: String,
                    createdAt: Date,
                    userId: String,
                    fullName: String,
                    avatarUrl: String,
                
                }
            ]
        }
    ]
});
const datasetComment = mongoose.model("datasetComment", commentSchema);
module.exports = datasetComment;