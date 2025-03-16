const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, address, phoneNumber } = req.body;
    const userId = req.user._id; // Assuming user is authenticated

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate total price and validate items
    let totalPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item._id);
      if (!product) {
        return res.status(404).json({ message: `Product ${item._id} not found` });
      }

      // Get the batch with available stock
      const availableBatch = product.batches.find(batch => batch.stock >= item.quantity);
      if (!availableBatch) {
        return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
      }

      totalPrice += availableBatch.finalPrice * item.quantity;
      validatedItems.push({
        _id: product._id,
        name: product.name,
        price: availableBatch.finalPrice,
        quantity: item.quantity
      });
    }

    // Create order in database
    const order = new Order({
      userId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      address,
      phoneNumber,
      items: validatedItems,
      totalPrice,
      status: 'Pending'
    });

    await order.save();

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalPrice * 100, // Convert to paise
      currency: 'INR',
      receipt: order._id.toString()
    });

    // Update order with Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      order,
      razorpayOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only admin can update order status
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update order status' });
    }

    order.status = status;
    order.updatedAt = Date.now();
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};

// Verify and update payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    const order = await Order.findOne({ razorpayOrderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create payment record
    const payment = new Payment({
      orderId: order._id,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      amount: order.totalPrice,
      status: 'paid'
    });

    await payment.save();

    // Update order status
    order.status = 'Paid';
    order.paymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.updatedAt = Date.now();
    await order.save();

    // Update product stock
    for (const item of order.items) {
      const product = await Product.findById(item._id);
      if (product) {
        const batchToUpdate = product.batches.find(batch => batch.stock >= item.quantity);
        if (batchToUpdate) {
          batchToUpdate.stock -= item.quantity;
          product.finalStock = product.batches.reduce((total, batch) => total + batch.stock, 0);
          await product.save();
        }
      }
    }

    res.json({ message: 'Payment verified successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to cancel this order
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Only allow cancellation of pending orders
    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot cancel order that is not pending' });
    }

    order.status = 'Cancelled';
    order.updatedAt = Date.now();
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
}; 