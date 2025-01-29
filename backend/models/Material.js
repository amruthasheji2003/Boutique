// backend/models/Material.js
const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  quantity: { type: String, required: true }, // Quantity of the material
  unit: { type: String, required: true },     // Unit of measurement (e.g., meters, pieces)
  image: { type: String, required: true },    // Store the image URL or path
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);