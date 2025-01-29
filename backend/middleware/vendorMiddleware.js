// middleware/vendorMiddleware.js
const { body, validationResult } = require('express-validator');

// Middleware to validate vendor registration data
exports.validateVendor = [
  body('organizationName')
    .notEmpty()
    .withMessage('Organization name is required'),
  
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('gstin')
    .notEmpty()
    .withMessage('GSTIN is required'),
  
  body('phoneNumber')
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number must be 10 digits long'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];