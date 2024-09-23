const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors')
const authRoutes = require('./routes/authRoutes'); // Import your authentication routes
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;
app.use(cors({ origin: 'http://localhost:3000' }));
// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Use the authentication routes
app.use('/api/auth', authRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
