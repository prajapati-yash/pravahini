const mongoose = require('mongoose');

// AI Agent Schema
const CreateAiAgentSchema = new mongoose.Schema({
    aiAgentId: {
      type: String,
      required: true,
      unique: true
    },
    keyFeatures: {
      type: String,
      required: true
    },
    useCase: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  // AI Agent Model
  const AIAgent = mongoose.model('CreateAIAgent', CreateAiAgentSchema);
  module.exports = AIAgent;
  