const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Import routes
const authRoutes = require('./routes/authRoutes'); // For authentication (register/login)
const profileRoutes = require('./routes/profileRoutes'); // For profile management
const adminRoutes = require('./routes/adminRoutes'); // For admin user management (ensure this file exists)

// Initialize Express app
const app = express();

// Set the port from environment variables or default to 8080
const PORT = process.env.PORT || 8080;

// MongoDB connection URI (from .env)
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware for Cross-Origin Resource Sharing (CORS)
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from the frontend (React)

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Atlas connected successfully'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define API routes for authentication, profile management, and admin user management
app.use('/api/auth', authRoutes); // Handles user registration and login
app.use('/api/profile', profileRoutes); // Handles profile creation and update
app.use('/api/admin', adminRoutes); // Handles admin user management (this is the new addition)

// Default route for basic server health check
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
