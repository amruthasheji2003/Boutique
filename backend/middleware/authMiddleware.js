const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Check token in 'x-auth-token' header or 'Authorization' header
  const token = req.header('x-auth-token') || req.header('Authorization');

  // If no token is provided
  if (!token) {
    return res.status(401).json({ message: 'Authorization denied, no token provided.' });
  }

  let actualToken = token;

  // If token is in 'Bearer' format, split and extract the token part
  if (token.startsWith('Bearer ')) {
    actualToken = token.split(' ')[1];
  }

  try {
    // Verify the token
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    // Attach the user data to the request object
    req.user = decoded.user;

    // Proceed to the next middleware or route
    next();
  } catch (err) {
    // Invalid token or other errors
    return res.status(401).json({ message: 'Invalid or expired token, authorization denied.' });
  }
};

module.exports = authMiddleware;
