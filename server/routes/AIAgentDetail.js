// Import required modules
const express = require('express');
const router = express.Router();
const  AIAgent  = require('../models/CreateAIAgent');

// API Endpoint to create a new AI Agent
router.post('/ai-agents', async (req, res) => {
  try {
    console.log(req.body);  
    const { aiAgentId, keyFeatures, useCase } = req.body;
    // Create a new AI Agent document
    const newAIAgent = new AIAgent({
      aiAgentId,
      keyFeatures,
      useCase
    });

    // Save the AI Agent to the database
    await newAIAgent.save();

    res.status(201).json({ message: 'AI Agent data saved successfully', aiAgent: newAIAgent });
  } catch (error) {
    console.error('Error saving AI Agent data:', error);
    res.status(500).json({ error: 'Failed to save AI Agent data' });
  }
});

// API Endpoint to get an AI Agent by ID
router.get('/ai-agents/:aiAgentId', async (req, res) => {
  try {
    const aiAgent = await AIAgent.findOne({ aiAgentId: req.params.aiAgentId });
    if (!aiAgent) {
      return res.status(404).json({ error: 'AI Agent not found' });
    }
    res.json(aiAgent);
  } catch (error) {
    console.error('Error fetching AI Agent data:', error);
    res.status(500).json({ error: 'Failed to fetch AI Agent data' });
  }
});

module.exports = router;