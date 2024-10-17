const Batch = require('../models/Batch');
const Product = require('../models/Product');

// Controller to add a new batch
exports.addBatch = async (req, res) => {
  const { productId, productDate, quantity, price } = req.body;

  // Validate input
  if (!productId || !productDate || !quantity || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Ensure that the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create a new batch
    const batch = new Batch({
      batchId: `BATCH-${Date.now()}`, // Unique batch ID
      product: productId,
      productDate,
      quantity,
      price,
    });

    // Save the batch
    await batch.save();

    res.status(201).json({ message: 'Batch added successfully', batch });
  } catch (error) {
    console.error('Error adding batch:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to fetch all batches
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find().populate('product');
    res.status(200).json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to fetch a single batch by ID
exports.getBatchById = async (req, res) => {
  const { id } = req.params;

  try {
    const batch = await Batch.findById(id).populate('product');
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json(batch);
  } catch (error) {
    console.error('Error fetching batch:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to update a batch
exports.updateBatch = async (req, res) => {
  const { id } = req.params;
  const { productId, productDate, quantity, price } = req.body;

  try {
    // Find the batch
    const batch = await Batch.findById(id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Ensure the product exists if updated
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      batch.product = productId;
    }

    // Update batch details
    batch.productDate = productDate || batch.productDate;
    batch.quantity = quantity || batch.quantity;
    batch.price = price || batch.price;

    // Save the updated batch
    await batch.save();

    res.status(200).json({ message: 'Batch updated successfully', batch });
  } catch (error) {
    console.error('Error updating batch:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to delete a batch
exports.deleteBatch = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the batch
    const batch = await Batch.findById(id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Delete the batch
    await batch.remove();

    res.status(200).json({ message: 'Batch deleted successfully' });
  } catch (error) {
    console.error('Error deleting batch:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
