// models/hashModel.js
const mongoose = require('mongoose');

const hashSchema = new mongoose.Schema({
  hashes: {
    type: [String],
    required: true
  }
});

const HashModel = mongoose.model('datasetHashes', hashSchema);

module.exports = HashModel;
