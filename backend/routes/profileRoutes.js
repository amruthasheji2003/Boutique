const express = require('express');
const router = express.Router();
const { createProfile } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/profile
// @desc    Create a new profile
// @access  Private (Requires Auth)
router.post('/', authMiddleware, createProfile);

module.exports = router;
