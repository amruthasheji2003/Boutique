const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
  console.log('Received registration data:', JSON.stringify(req.body, null, 2));

  const { firstName, lastName, email, password, phoneNumber } = req.body;

  // Input validation
  if (!firstName || !lastName || !email || !password || !phoneNumber) {
    console.log('Missing required fields:', { 
      firstName: !!firstName, 
      lastName: !!lastName, 
      email: !!email, 
      password: !!password, 
      phoneNumber: !!phoneNumber 
    });
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create a new user
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password, // The model will hash this automatically
      phoneNumber: phoneNumber.trim(),
    });

    console.log('New user object:', JSON.stringify(newUser.toObject(), null, 2));

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token for the new user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Return success response with user data
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        userId: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
      },
      token,
    });

  } catch (error) {
    console.error('Error during registration:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }
    // Log the full error stack trace
    console.error('Full error:', error.stack);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};



// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    // Set the token in an HTTP-only cookie (for security)
    res.cookie('token', token, {
      httpOnly: true,   // Protect against XSS
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'Strict',
      maxAge: 3600000,  // 1 hour expiration
    });

    // Return user data (excluding password)
    res.status(200).json({
      message: 'Login successful',
      user: {
        userId: user._id,
        token: token,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Logout user (clear token)
const logoutUser = (req, res) => {
  res.clearCookie('token');  // Remove the JWT token
  res.status(200).json({ message: 'Logout successful' });
};

module.exports = { registerUser, loginUser, logoutUser };