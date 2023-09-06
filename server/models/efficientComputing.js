const mongoose = require("mongoose");

const efficientComputingSchema = new mongoose.Schema({
    walletAddress: String,
    jobId: String,
    cid: String,
    timeStamp: Date,
    jobStatus: String
})

const container1= mongoose.model("container1", efficientComputingSchema);

module.exports = container1;