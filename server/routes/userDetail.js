const express = require("express");
const router = express.Router();
const userDetailSchema = require("../models/userDetailSchema");
const mongoose = require("mongoose");

// POST request to create a new user
router.post('/register', async (req, res) => {
  try {
    const { address,userData, Email } = req.body;
    // console.log(userData[4]); // Log the value of userData[4]
    // console.log('Request body:', req.body); // Log the request body

    if (!Email || Email === null) {
      return res.status(400).json({ error: 'Email is required' });
    }
    // Create a new user document with _id set to userData[4]
    const newUser = new userDetailSchema({
    // Set the _id field to userData[4]
      address,
      userData,
      Email
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error:', error); // Log the error
    res.status(400).json({ error: error.message });
  }
});
// PUT request to update an existing user
router.put('/register', async (req, res) => {
  try {
    const { address, userData, Email } = req.body;
    const updatedUser = await userDetailSchema.updateOne(
      { address },
      { $set: { userData, Email } },
      { upsert: true, new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Something went wrong' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get('/register', async (req, res) => {
    try {
      const {address}= req.query; // Get the user ID from the query parameter
      // console.log(address);
      const user = await userDetailSchema.findOne({address});
      // console.log(user); // Log the user object
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;
