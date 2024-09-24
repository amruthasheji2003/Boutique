const mongoose = require('mongoose');

// Create Vendor schema
const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  }
});

// Create Vendor model
const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
