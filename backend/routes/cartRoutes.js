const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all cart routes
router.use(authMiddleware);

// Get the user's cart
router.get('/', cartController.getCart);

// Add an item to the cart
router.post('/add', cartController.addToCart);

// Update the quantity of an item in the cart
router.put('/update', cartController.updateCartItem);

// Remove an item from the cart
router.delete('/remove/:productId', cartController.removeFromCart);

// Clear the entire cart
router.delete('/clear', cartController.clearCart);

module.exports = router;