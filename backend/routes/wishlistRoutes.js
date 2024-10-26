const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all wishlist routes
router.use(authMiddleware);

// Add product to wishlist
router.post('/add', wishlistController.addToWishlist);

// Remove product from wishlist
router.delete('/remove/:productId', wishlistController.removeFromWishlist);

// Get user's wishlist
router.get('/', wishlistController.getWishlist);
// Clear entire wishlist
router.delete('/clear', wishlistController.clearWishlist);

module.exports = router;