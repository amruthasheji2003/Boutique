const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all cart routes
router.use(authMiddleware);

// Add item to cart
router.post('/add', cartController.addToCart);

// Remove item from cart
router.delete('/remove/:productId', cartController.removeFromCart);

// Update item quantity in cart
router.put('/update/:productId', cartController.updateCartItemQuantity);

// Get cart contents
router.get('/', cartController.getCart);

router.delete('/clear', cartController.clearCart);

module.exports = router;