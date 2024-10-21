const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category').populate('subcategory');
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  const {
    productId,
    productName,
    category,
    subcategory,
    description,
    batches
  } = req.body;

  // Validate required fields
  if (!productId || !productName || !category || !subcategory || !description || !batches) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  let imagePath = null;
  if (req.file) {
    imagePath = `uploads/${req.file.filename}`; // Store relative path to image
  } else {
    return res.status(400).json({ message: 'Image is required.' });
  }

  try {
    // Parse batches if it's a string (from FormData)
    const parsedBatches = typeof batches === 'string' ? JSON.parse(batches) : batches;

    // Validate batches
    if (!Array.isArray(parsedBatches) || parsedBatches.length === 0) {
      return res.status(400).json({ message: 'At least one batch is required.' });
    }

    // Calculate total stock from all batches
    const totalStock = parsedBatches.reduce((sum, batch) => sum + parseInt(batch.stock), 0);

    // Create new product
    const newProduct = new Product({
      productId,
      name: productName,
      category,
      subcategory,
      finalStock: totalStock, // Set total stock
      description,
      image: imagePath,
      batches: parsedBatches.map(batch => ({
        batchId: batch.batchId,
        productionDate: new Date(batch.productionDate),
        grade: batch.grade,
        actualPrice: parseFloat(batch.actualPrice),
        finalPrice: parseFloat(batch.finalPrice),
        stock: parseInt(batch.stock) // Add stock to each batch
      }))
    });

    const product = await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error saving product', error: error.message });
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

    // Update image if a new one is uploaded
    if (req.file) {
      const newImagePath = `uploads/${req.file.filename}`;

      // Delete old image from server (optional)
      if (product.image) {
        const oldImagePath = path.join(__dirname, '..', product.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }

      updatedData.image = newImagePath; // Add new image path
    }

    // Parse and update batches if provided
    if (updatedData.batches) {
      updatedData.batches = JSON.parse(updatedData.batches).map(batch => ({
        batchId: batch.batchId,
        productionDate: new Date(batch.productionDate),
        grade: batch.grade,
        actualPrice: parseFloat(batch.actualPrice),
        finalPrice: parseFloat(batch.finalPrice),
        stock: parseInt(batch.stock) // Add stock to each batch
      }));

      // Recalculate total stock
      updatedData.stock = updatedData.batches.reduce((sum, batch) => sum + batch.stock, 0);
    }

    // Update the product with the new data
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error(error); // Log the error for debugging
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

    // Delete associated image from server
    if (product.image) {
      const imagePath = path.join(__dirname, '..', product.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting product image:', err);
      });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
