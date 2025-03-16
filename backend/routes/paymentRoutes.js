     // backend/routes/paymentRoutes.js
     const express = require('express');
     const router = express.Router();
     const paymentController = require('../controllers/paymentController');

     // Create Razorpay order
     router.post('/create-order', paymentController.createRazorpayOrder);

     // Create order in database
     router.post('/orders', paymentController.createOrder);

     router.get('/orders/:id', paymentController.getOrderById);

     // Update order
     router.patch('/orders/:id', paymentController.updateOrder);

     // Verify payment
     router.post('/verify', paymentController.verifyPayment);

     // Get user orders
     router.get('/orders/user/:userId', paymentController.getUserOrders);

     module.exports = router;