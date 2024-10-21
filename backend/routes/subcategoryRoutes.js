const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');

// Get subcategories by category ID (category as path parameter)
router.get('/:category', subcategoryController.getSubcategoriesByCategory);
// Get subcategories by category ID (category as query parameter)
// router.get('/', subcategoryController.getSubcategoriesByCategory);


// Create a new subcategory
router.post('/', subcategoryController.createSubcategory);

// Delete a subcategory by ID
router.delete('/:id', subcategoryController.deleteSubcategory);

module.exports = router;
