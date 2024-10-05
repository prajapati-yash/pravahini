const mongoose = require('mongoose');

const UserRatingSchema = new mongoose.Schema({
    aiAgentId: { type: String, required: true },
    rating: { type: Number, required: true },
    userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserRatingSchema.index({ userId: 1, aiAgentId: 1 }, { unique: true });

module.exports = mongoose.model('UserRating', UserRatingSchema);