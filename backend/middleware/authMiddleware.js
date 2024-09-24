const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Retrieve the token from 'x-auth-token' or 'Authorization' headers
  const token = req.header('x-auth-token') || req.header('Authorization');

  // If no token is provided, send a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ message: 'Authorization denied. No token provided.' });
  }

  // Extract the actual token if it is in Bearer format
  let actualToken = token;
  if (token.startsWith('Bearer ')) {
    actualToken = token.split(' ')[1];
  }

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    // Attach the decoded user data to the request object
    req.user = decoded.user;

    // Proceed to the next middleware or route
    next();
  } catch (err) {
    // Handle invalid or expired tokens with a clear error message
    return res.status(401).json({ message: 'Token is invalid or expired.' });
  }
};

module.exports = authMiddleware;
