const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure this path is correct

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch users from the database
    res.json(users);
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
