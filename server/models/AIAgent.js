const mongoose = require('mongoose');

const AIAgentSchema = new mongoose.Schema({
  aiAgentId: { type: String, required: true, unique: true },
  ratingsSum: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  // ... (other fields)
});

AIAgentSchema.index({ aiAgentId: 1 }, { unique: true });

module.exports = mongoose.model('AIAgent', AIAgentSchema);