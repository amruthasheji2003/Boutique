const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
//   description: { type: String, required: true },
  image: { type: String }, // Store the filename of the uploaded image
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
