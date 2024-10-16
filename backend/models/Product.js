const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
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
  batch: {
    batchId: {
      type: String,
      required: true,
    },
    productDate: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
});

// Check if the Product model already exists before defining it
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
