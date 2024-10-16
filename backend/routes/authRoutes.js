const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For JWT generation
const User = require('../models/User');

// Secret key for JWT (should be stored in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use environment variable

// Middleware to parse incoming JSON and URL-encoded data
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Add decoded user information to request
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// User Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password with the hashed one
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // Create a token
            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

            // Return the token and success message
            res.status(200).json({ message: "Login successful!", token, role: user.role });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// User Registration Route
router.post('/register', async (req, res) => {
    const { email, password, phoneNumber } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            phoneNumber,
        });

        // Save the user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

// Logout Route (Invalidate JWT on client-side)
router.post('/logout', (req, res) => {
    // On the client side, just remove the token (no need for server-side handling in JWT)
    res.status(200).json({ message: 'Logout successful. Please remove the token from the client.' });
});

// Protected Route Example (only accessible when logged in)
router.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: 'You are authorized to access this route', user: req.user });
});

// Get All Users (Protected Route)
router.get('/users', verifyToken, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Additional routes can be added here...

module.exports = router;
