const mongoose = require('mongoose');

// Define the batch schema
const batchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    unique: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
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
  price: {
    type: Number,
    required: true,
  },
});

// Check if the Batch model already exists before defining it
const Batch = mongoose.models.Batch || mongoose.model('Batch', batchSchema);

module.exports = Batch;
