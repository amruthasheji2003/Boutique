// In your models/Category.js (or equivalent file)
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // Add any other fields you may need
});

module.exports = mongoose.model('Category', categorySchema);
