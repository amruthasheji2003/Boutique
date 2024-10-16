const express = require('express');
const { createOrUpdateProfile, getProfile } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to check authentication

const router = express.Router();

// Get user profile
router.get('/me', authMiddleware, getProfile);

// Create or update profile
router.post('/', authMiddleware, createOrUpdateProfile);

module.exports = router;
