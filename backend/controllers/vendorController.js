const Vendor = require('../models/Vendor'); // Ensure this path is correct
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new vendor
exports.registerVendor = async (req, res) => {
  const { organizationName, email, password, gstin, phoneNumber } = req.body;

  try {
    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: 'Vendor already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new vendor
    const vendor = new Vendor({
      organizationName,
      email,
      password: hashedPassword,
      gstin,
      phoneNumber,
    });

    await vendor.save();

    // Generate a token (optional)
    const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Vendor registered successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
exports.loginVendor = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if vendor exists
      const vendor = await Vendor.findOne({ email });
      if (!vendor) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, vendor.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Generate a token
      const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };