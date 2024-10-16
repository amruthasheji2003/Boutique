// routes/vendorRoutes.js
const express = require('express');
const { addVendor, getVendors } = require('../controllers/vendorController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware'); // Ensure this checks for admin permissions
const router = express.Router();

// Protected routes for admin
router.post('/', authMiddleware, adminMiddleware, addVendor); // Add a new vendor
router.get('/', authMiddleware, adminMiddleware, getVendors); // Retrieve all vendors

module.exports = router;
