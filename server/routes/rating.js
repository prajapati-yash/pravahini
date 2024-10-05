    const express = require('express');
    const router = express.Router();
    const AIAgent = require('../models/AIAgent');
    const UserRating = require('../models/UserRating');
// POST route to submit a rating
router.post('/rate-ai-agent', async (req, res) => {
    console.log('Received rating request');
    try {
      console.log('Request body:', req.body);
      const { aiAgentId, rating, userId } = req.body;
      
      let aiAgent = await AIAgent.findOne({ aiAgentId });
      
      if (!aiAgent) {
        console.log('AI Agent not found. Creating new AI Agent with ID:', aiAgentId);
        aiAgent = new AIAgent({
          aiAgentId,
          ratingsSum: rating,
          ratingCount: 1,
          averageRating: rating
        });
      } else {
        console.log('Updating existing AI Agent with ID:', aiAgentId);
        // Update existing AI Agent's rating information
        aiAgent.ratingsSum = (aiAgent.ratingsSum || 0) + rating;
        aiAgent.ratingCount = (aiAgent.ratingCount || 0) + 1;
        aiAgent.averageRating = aiAgent.ratingsSum / aiAgent.ratingCount;
      }
  
      // Check if user has already rated this AI Agent
      let existingRating = await UserRating.findOne({ userId, aiAgentId });
      if (existingRating) {
        console.log('User has already rated this AI Agent');
        return res.status(400).json({ message: 'You have already rated this AI Agent' });
      }
  
      // Create new UserRating
      const newRating = new UserRating({ userId, aiAgentId, rating });
      
      // Save both AIAgent and UserRating
      await Promise.all([aiAgent.save(), newRating.save()]);
  
      console.log('Rating submitted successfully');
      res.status(200).json({ 
        message: 'Rating submitted successfully', 
        averageRating: aiAgent.averageRating, 
        ratingCount: aiAgent.ratingCount 
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
      res.status(500).json({ message: 'Error submitting rating' });
    }
  });
  

 // GET route to retrieve rating information for an AI Agent
router.get('/get-ai-agent-rating/:aiAgentId', async (req, res) => {
    try {
      // Extracting AI Agent ID from the route parameter
      const { aiAgentId } = req.params;
  
      // Extracting userId (or userAddress) from query parameters
      const { userId } = req.query;
  
      console.log('Fetching rating for AI Agent with ID:', aiAgentId);
      console.log('User Address:', userId);
  
      // Find the AI Agent's details by ID
      const aiAgent = await AIAgent.findOne({ aiAgentId });
  
      if (!aiAgent) {
        return res.status(404).json({ message: 'AI Agent not found' });
      }
  
      // Initialize userRating as null in case no user-specific rating is found
      let userRating = null;
  
      // If userId is provided, fetch the user's specific rating
      if (userId) {
        const userRatingDoc = await UserRating.findOne({ userId, aiAgentId });
        if (userRatingDoc) {
          userRating = userRatingDoc.rating;
        }
      }
  
      // Send back the response with average rating, rating count, and user-specific rating
      res.status(200).json({
        averageRating: aiAgent.averageRating || 0,
        ratingCount: aiAgent.ratingCount || 0,
        userRating // If userRating exists, it will be included; otherwise, it's null
      });
    } catch (error) {
      console.error('Error fetching rating:', error);
      res.status(500).json({ message: 'Error fetching rating' });
    }
  });
  

    module.exports = router;