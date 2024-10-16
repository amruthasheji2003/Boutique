const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load environment variables

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const profileRoutes = require('./routes/profileRoutes'); // Uncomment if you're using profile routes
const categoryRoutes = require('./routes/categoryRoutes'); // Ensure this route exists and is correctly defined
const authMiddleware = require('./middleware/authMiddleware');

// Initialize Express app
const app = express();

// Set the port from environment variables or default to 8080
const PORT = process.env.PORT || 8080;

// MongoDB connection URI (from .env)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdbname';

// Middleware for Cross-Origin Resource Sharing (CORS)
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from the frontend (React)

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
app.use('/api/products', productRoutes);
app.use('/api/profile', authMiddleware, profileRoutes); // Uncomment if using profile routes
app.use('/api/category', categoryRoutes); // Ensure categoryRoutes is valid

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
