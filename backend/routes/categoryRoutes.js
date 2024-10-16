const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Route to fetch all categories
router.get('/', categoryController.getCategories);

// Route to add a new category
router.post('/', categoryController.addCategory);

module.exports = router;
