const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load environment variables

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes'); // Uncomment if you're using profile routes
const categoryRoutes = require('./routes/categoryRoutes'); // Import category routes
const authMiddleware = require('./middleware/authMiddleware');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const batchRoutes = require('./routes/batchRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const measurementRoutes = require('./routes/measurementRoutes');
const customizationRoutes = require('./routes/customizationRoutes');

// Initialize Express app
const app = express();

// Set the port from environment variables or default to 8080
const PORT = process.env.PORT || 8080;

// MongoDB connection URI (from .env)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdbname';

// Middleware for Cross-Origin Resource Sharing (CORS)
app.use(cors({ origin: 'https://boutique-80by.onrender.com' })); // Allow requests from the frontend (React)

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB Atlas or local database
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);// Uncomment if using profile routes
app.use('/api/category', categoryRoutes); // Ensure categoryRoutes is valid
app.use('/api/categories', categoryRoutes); // Ensure this matches your routing
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/subcategory', subcategoryRoutes);
app.use('/api', batchRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/measurements',measurementRoutes);
app.use('/api/customizations',customizationRoutes);







// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Default route for basic server health check
app.get('/', (req, res) => {
  res.send('Server is running');
});


// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
