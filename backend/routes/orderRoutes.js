const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

// Create new order
router.post('/', isAuthenticated, orderController.createOrder);

// Get all orders (admin only)
router.get('/all', isAuthenticated, isAdmin, orderController.getAllOrders);

// Get user's orders
router.get('/my-orders', isAuthenticated, orderController.getUserOrders);

// Get specific order
router.get('/:id', isAuthenticated, orderController.getOrderById);

// Update order status (admin only)
router.patch('/:id/status', isAuthenticated, isAdmin, orderController.updateOrderStatus);

// Verify payment
router.post('/verify-payment', isAuthenticated, orderController.verifyPayment);

// Cancel order
router.post('/:id/cancel', isAuthenticated, orderController.cancelOrder);

module.exports = router; 