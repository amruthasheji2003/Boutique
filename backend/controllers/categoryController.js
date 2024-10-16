// backend/controllers/categoryController.js

const Category = require('../models/Category');

// Fetch all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
};

// Add a new category
const addCategory = async (req, res) => {
  const { name } = req.body;

  // Check if the category already exists
  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({ name });
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ message: 'Error adding category', error: err.message });
  }
};

// Export the controller functions
module.exports = {
  getCategories,
  addCategory,
};