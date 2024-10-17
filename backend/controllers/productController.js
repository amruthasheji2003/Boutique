const Product = require('../models/Product');
const Batch = require('../models/Batch');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, category, subcategory, description, stock, batches } = req.body;
    
    // Create a new product instance
    const product = new Product({
      name,
      category,
      subcategory,
      description,
      image: req.file ? req.file.filename : '', // Assuming image is uploaded
      stock,
      batches,
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully!', product });
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('batches');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('batches');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.image = req.file.filename; // Update image if provided
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({ message: 'Product updated successfully!', product });
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
