const express = require("express");
const HashModel = require("../models/hashModel");
const router = express.Router();

router.post("/hashesValue", async (req, res) => {
  try {
    const { hash } = req.body;
    if (!hash) {
      return res.status(400).json({ message: "Hash is required" });
    }

    // Find the hash document or create a new one if it doesn't exist
    let hashDocument = await HashModel.findOne();
    if (!hashDocument) {
      hashDocument = new HashModel({ hashes: [] });
    }

    // Add the new hash to the array and save the document
    hashDocument.hashes.push(hash);
    await hashDocument.save();

    res.status(201).json({ message: "Hash added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// GET request to fetch all hashes
router.get('/hashesValue', async (req, res) => {
  try {
    const hashDocument = await HashModel.findOne();
    if (!hashDocument) {
      return res.status(404).json({ message: 'No hashes found' });
    }

    res.status(200).json({ hashes: hashDocument.hashes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;