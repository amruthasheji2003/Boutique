const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  const { name, price, category, subcategory, stock, description, batchId, productDate, quantity } = req.body;

  // Validate the required fields
  if (!name || !price || !category || !subcategory || !stock || !description || !batchId || !productDate || !quantity || !req.file) {
    return res.status(400).json({ message: 'All fields are required, including batch details and an image.' });
  }

  const imagePath = `uploads/${req.file.filename}`; // Store the relative path to the image

  const newProduct = new Product({
    name,
    price,
    category,
    subcategory,
    stock,
    description,
    batch: {
      batchId,
      productDate,
      quantity,
    },
    image: imagePath,
  });

  try {
    const product = await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error saving product', error });
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the image if a new one is uploaded
    if (req.file) {
      const newImagePath = `uploads/${req.file.filename}`;

      // Delete old image (optional, if you want to remove the old image from the server)
      if (product.image) {
        const oldImagePath = path.join(__dirname, '..', product.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }

      updatedData.image = newImagePath;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete the associated image from the server
    if (product.image) {
      const imagePath = path.join(__dirname, '..', product.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting product image:', err);
      });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
