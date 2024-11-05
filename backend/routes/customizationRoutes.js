const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have an auth middleware
const customizationController = require('../controllers/customizationController');

// Create a new customization
router.post('/', authMiddleware, customizationController.createCustomization);

// Get all customizations for the logged-in user
router.get('/user', authMiddleware, customizationController.getCustomizationsByUser);

// Get a specific customization by ID
router.get('/:id', authMiddleware, customizationController.getCustomizationById);

// Update a customization
router.put('/:id', authMiddleware, customizationController.updateCustomization);

// Delete a customization
router.delete('/:id', authMiddleware, customizationController.deleteCustomization);

module.exports = router;