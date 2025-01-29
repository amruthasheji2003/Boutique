// routes/vendorRoutes.js
const express = require('express');
const { registerVendor, loginVendor } = require('../controllers/vendorController');
const { validateVendor } = require('../middleware/vendorMiddleware');

const router = express.Router();

// Route for vendor registration
router.post('/register', validateVendor, registerVendor);
router.post('/login', loginVendor);

module.exports = router;