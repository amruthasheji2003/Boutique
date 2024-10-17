const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Store the filename of the image
    required: true,
  },
  stock: {
    type: Number, // Number of units available
    required: true,
  },
  batches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch', // Reference to the Batch model
  }],
});

// Check if the Product model already exists before defining it
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
