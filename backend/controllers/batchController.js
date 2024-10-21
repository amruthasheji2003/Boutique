const Batch = require('../models/Batch');
const Product = require('../models/Product');

// Create a new batch
exports.createBatch = async (req, res) => {
  try {
    const { product, batchId, productDate, quality, price, quantity, discount, finalPrice } = req.body;

    // Check if the product exists
    const existingProduct = await Product.findById(product);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newBatch = new Batch({
      product,
      batchId,
      productDate,
      quality,
      price,
      quantity,
      discount,
      finalPrice,
    });

    const savedBatch = await newBatch.save();

    res.status(201).json(savedBatch);
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({ message: 'Error creating batch', error });
  }
};

// Get all batches
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find().populate('product');
    res.status(200).json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: 'Error fetching batches', error });
  }
};

// Get a batch by ID
exports.getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findById(id).populate('product');

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json(batch);
  } catch (error) {
    console.error('Error fetching batch:', error);
    res.status(500).json({ message: 'Error fetching batch', error });
  }
};

// Update a batch
exports.updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const batch = await Batch.findByIdAndUpdate(id, updatedData, { new: true });

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json(batch);
  } catch (error) {
    console.error('Error updating batch:', error);
    res.status(500).json({ message: 'Error updating batch', error });
  }
};

// Delete a batch
exports.deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;

    const batch = await Batch.findByIdAndDelete(id);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json({ message: 'Batch deleted successfully' });
  } catch (error) {
    console.error('Error deleting batch:', error);
    res.status(500).json({ message: 'Error deleting batch', error });
  }
};
