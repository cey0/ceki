// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/userM');

router.post('/signup', async (req, res) => {
  try {
    // Logic to create/register a user
    // Access req.body to get user registration data
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
