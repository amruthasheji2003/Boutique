const express = require('express');
const { adminLogin, fetchAllUsers } = require('../controllers/adminController');
const authenticateAdmin = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login', adminLogin); // Admin login route
router.get('/users', authenticateAdmin, fetchAllUsers); // Fetch all users route, protected by middleware

module.exports = router;
