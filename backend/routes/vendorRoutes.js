const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// POST request to add a vendor
router.post('/add-vendor', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Create a new vendor
    const newVendor = new Vendor({
      name,
      email,
      phone,
    });

    // Save vendor to the database
    await newVendor.save();

    res.status(201).json({ message: 'Vendor added successfully', vendor: newVendor });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add vendor' });
  }
});

module.exports = router;
