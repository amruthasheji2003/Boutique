const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // For hashing passwords
const User = require('../models/User');


// Middleware to parse incoming JSON and URL-encoded data
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

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
            res.status(200).json({ message: "Login successful!", role: user.role });
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

// User Signup Route (If you want to keep a separate signup route)
router.post('/signup', async (req, res) => {
    const { email, password, phoneNumber } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            phoneNumber
        });

        // Save user to database
        await newUser.save();
        res.status(201).json({ message: 'Registered successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Unable to register', error: error.message });
    }
});

module.exports = router;
