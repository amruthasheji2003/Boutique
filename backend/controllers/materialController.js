// backend/controllers/materialController.js
const Material = require('../models/Material');

// Fetch all materials
const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new material
const addMaterial = async (req, res) => {
  const { category, description, price, stock, quantity, unit } = req.body;
  const image = req.file.path; // Get the image path from multer

  const newMaterial = new Material({
    category,
    description,
    price,
    stock,
    quantity,
    unit,
    image,
  });

  try {
    const savedMaterial = await newMaterial.save();
    res.status(201).json(savedMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    // Attempt to find and delete the material by ID
    const material = await Material.findByIdAndDelete(req.params.id);
    
    // Check if the material was found and deleted
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    // Log the error for debugging
    console.error('Error deleting material:', error);

    // Check if the error is due to an invalid ID format
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid material ID format' });
    }

    // Respond with a generic error message
    res.status(500).json({ message: 'An error occurred while deleting the material' });
  }
};

module.exports = {
  getAllMaterials,
  addMaterial,
  deleteMaterial,
};