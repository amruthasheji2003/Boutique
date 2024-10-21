const mongoose = require('mongoose');

// Define the schema for batches
const batchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
  },
  productionDate: {
    type: Date,
    required: true,
  },
  grade: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: true,
  },
  actualPrice: {
    type: Number,
    required: true,
  },
  finalPrice: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

// Define the main product schema
const productSchema = new mongoose.Schema({
  productId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  subcategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subcategory', 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  batches: [batchSchema], // Embed batches directly within the product
  finalStock: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Create the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
