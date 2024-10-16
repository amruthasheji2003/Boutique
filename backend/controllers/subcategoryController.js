const Subcategory = require('../models/Subcategory');

// Get all subcategories by category
exports.getSubcategoriesByCategory = async (req, res) => {
  const { category } = req.query;

  try {
    const subcategories = await Subcategory.find({ category });
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategories', error });
  }
};

// Create a new subcategory
exports.createSubcategory = async (req, res) => {
  const { name, category } = req.body;

  try {
    const newSubcategory = new Subcategory({ name, category });
    await newSubcategory.save();
    res.status(201).json(newSubcategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating subcategory', error });
  }
};

// Delete a subcategory
exports.deleteSubcategory = async (req, res) => {
  const { id } = req.params;

  try {
    await Subcategory.findByIdAndDelete(id);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subcategory', error });
  }
};
