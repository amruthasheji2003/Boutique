const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  // Check for token in the Authorization header
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key

    // Fetch the user from the database using the ID from the token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is an admin (assuming an 'isAdmin' field exists)
    if (user.isAdmin) { // Adjust to your model structure
      next(); // User is admin, proceed to the next middleware/route
    } else {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = adminMiddleware;
