const mongoose = require("mongoose");

const advanceVisualizationSchema = new mongoose.Schema({
    walletAddress: String,
    jobId: String,
    cid: String,
    timeStamp: Date,
    jobStatus: String
  });
  
const container2 = mongoose.model("container2", advanceVisualizationSchema);

module.exports = container2;