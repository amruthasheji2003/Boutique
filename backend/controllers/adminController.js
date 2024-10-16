const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Admin Login Controller
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Admin login
    if (email === process.env.ADMIN_EMAIL) {
      if (password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ email, admin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Admin login successful', token, admin: true });
      } else {
        return res.status(401).json({ message: 'Invalid admin password' });
      }
    }

    // Regular user login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, admin: false }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ message: 'User login successful', token, admin: false });

  } catch (error) {
    console.error('Error during admin/user login:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Fetch All Users
const fetchAllUsers = async (req, res) => {
  const { search } = req.query;

  try {
    const query = search
      ? {
          $or: [
            { email: { $regex: search, $options: 'i' } }, // Case-insensitive search by email
            { phoneNumber: { $regex: search, $options: 'i' } }, // Case-insensitive search by phone number
          ],
        }
      : {}; // Fetch all users if no search term

    const users = await User.find(query);
    res.status(200).json(users);

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { adminLogin, fetchAllUsers };
