const User = require('../models/User');

// Fetch all signed-up users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'email phoneNumber'); // Only return email and phoneNumber
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
