     // backend/controllers/paymentController.js
     const Razorpay = require('razorpay');
     const Order = require('../models/Order');
     const Payment = require('../models/Payment');
     const crypto = require('crypto');

     // Initialize Razorpay with better error handling
     let razorpay;
     try {
       // Check if environment variables are set
       if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
         throw new Error('Razorpay credentials are missing in environment variables. Please check your .env file.');
       }

       // Initialize Razorpay instance
       razorpay = new Razorpay({
         key_id: process.env.RAZORPAY_KEY_ID.trim(),
         key_secret: process.env.RAZORPAY_KEY_SECRET.trim()
       });

       // Test the connection by listing orders (this will fail if credentials are invalid)
       console.log('Testing Razorpay connection...');
       razorpay.orders.all()
         .then(() => console.log('✓ Razorpay connection test successful'))
         .catch(err => {
           console.error('✗ Razorpay connection test failed:', err.message);
           console.error('Please check your Razorpay credentials in .env file');
         });

     } catch (error) {
       console.error('Failed to initialize Razorpay:', error.message);
     }

     const paymentController = {
       // Create Razorpay order
       createRazorpayOrder: async (req, res) => {
         try {
           // Check if Razorpay is properly initialized
           if (!razorpay) {
             console.error('Razorpay not initialized');
             return res.status(500).json({
               success: false,
               message: 'Payment service not initialized',
               details: 'Missing or invalid Razorpay credentials'
             });
           }

           const { amount, orderId } = req.body;
           console.log('Received payment request:', { amount, orderId });

           // Validate amount
           if (!amount || isNaN(amount) || amount < 100) {
             return res.status(400).json({
               success: false,
               message: 'Invalid amount',
               details: 'Amount must be at least 1 INR (100 paise)'
             });
           }

           // Create Razorpay order options
           const options = {
             amount: Math.round(amount),
             currency: 'INR',
             receipt: `order_rcpt_${Date.now()}`,
             notes: {
               orderId: orderId
             }
           };

           console.log('Creating Razorpay order with options:', options);

           // Create Razorpay order
           const order = await razorpay.orders.create(options);
           console.log('Razorpay order created:', order);

           // Create payment record in database
           const payment = new Payment({
             orderId: orderId,
             razorpayOrderId: order.id,
             amount: amount,
             status: 'created'
           });
           await payment.save();

           // Send response
           res.status(200).json({
             success: true,
             key_id: process.env.RAZORPAY_KEY_ID,
             order: order,
             payment: payment
           });

         } catch (error) {
           console.error('Error creating Razorpay order:', error);
           res.status(500).json({
             success: false,
             message: 'Failed to create order',
             error: error.message || 'Unknown error occurred'
           });
         }
       },

       // Get order by ID
       getOrderById: async (req, res) => {
         try {
           const { id } = req.params;
           console.log('Fetching order details for ID:', id);

           const order = await Order.findById(id);
           if (!order) {
             console.log('Order not found:', id);
             return res.status(404).json({ message: 'Order not found' });
           }

           // Get payment details if available
           const payment = await Payment.findOne({ orderId: id });
           
           // Combine order and payment details
           const orderDetails = {
             ...order.toObject(),
             payment: payment ? {
               razorpayOrderId: payment.razorpayOrderId,
               razorpayPaymentId: payment.razorpayPaymentId,
               status: payment.status
             } : null
           };

           console.log('Order details found:', orderDetails);
           res.json(orderDetails);
         } catch (error) {
           console.error('Error fetching order:', error);
           res.status(500).json({ message: 'Error fetching order details', error: error.message });
         }
       },

       // Create order in database
       createOrder: async (req, res) => {
         try {
           const { userId, userEmail, userName, address, phoneNumber, items, totalPrice } = req.body;
           console.log('Creating order with data:', { userId, userEmail, userName, totalPrice });

           // Validate required fields
           if (!userId || !userEmail || !userName || !address || !phoneNumber || !items || !totalPrice) {
             return res.status(400).json({ message: 'All fields are required' });
           }

           // Create new order
           const newOrder = new Order({
             userId,
             userEmail,
             userName,
             address,
             phoneNumber,
             items,
             totalPrice,
             status: 'Pending',
             createdAt: new Date()
           });

           const savedOrder = await newOrder.save();
           console.log('Order saved successfully:', savedOrder._id);
           res.status(201).json({
             id: savedOrder._id,
             message: 'Order created successfully',
             order: savedOrder
           });
         } catch (error) {
           console.error('Error creating order:', error);
           res.status(500).json({ message: 'Error creating order', error: error.message });
         }
       },

       // Update order
       updateOrder: async (req, res) => {
         try {
           const { id } = req.params;
           const updates = req.body;
           console.log('Updating order:', id, 'with data:', updates);

           const order = await Order.findById(id);
           if (!order) {
             return res.status(404).json({ message: 'Order not found' });
           }

           // Validate payment status
           if (updates.status && !['Pending', 'Paid', 'Failed', 'Cancelled'].includes(updates.status)) {
             return res.status(400).json({ message: 'Invalid order status' });
           }

           // Apply updates
           Object.keys(updates).forEach((key) => {
             if (key in order) {
               order[key] = updates[key];
             }
           });

           order.updatedAt = new Date();
           const updatedOrder = await order.save();
           console.log('Order updated successfully:', updatedOrder._id);
           res.status(200).json(updatedOrder);
         } catch (error) {
           console.error('Error updating order:', error);
           res.status(400).json({ message: 'Error updating order', error: error.message });
         }
       },

       // Verify payment
       verifyPayment: async (req, res) => {
         try {
           const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
           console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id });

           // Verify signature
           const sign = razorpay_order_id + "|" + razorpay_payment_id;
           const expectedSign = crypto
             .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
             .update(sign.toString())
             .digest("hex");

           if (razorpay_signature === expectedSign) {
             console.log('Payment signature verified successfully');
             res.status(200).json({ message: "Payment verified successfully" });
           } else {
             console.error('Invalid payment signature');
             res.status(400).json({ message: "Invalid signature" });
           }
         } catch (error) {
           console.error('Error verifying payment:', error);
           res.status(500).json({ message: "Error verifying payment", error: error.message });
         }
       },

       // Get user orders
       getUserOrders: async (req, res) => {
         try {
           const { userId } = req.params;
           console.log('Fetching orders for user:', userId);

           const orders = await Order.find({ userId })
             .sort({ createdAt: -1 });

           console.log(`Found ${orders.length} orders for user:`, userId);
           res.json(orders);
         } catch (error) {
           console.error('Error fetching orders:', error);
           res.status(500).json({ message: 'Error fetching orders', error: error.message });
         }
       }
     };

     module.exports = paymentController;