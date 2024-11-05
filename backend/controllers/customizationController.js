const Customization = require('../models/Customization');
const Product = require('../models/Product');
const Measurement = require('../models/Measurement');

exports.createCustomization = async (req, res) => {
  try {
    const { productId, measurementId, styleAdjustments, additionalNotes } = req.body;
    const userId = req.user.id; // Assuming you have user authentication middleware

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const measurement = await Measurement.findById(measurementId);
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }

    const customization = new Customization({
      product: productId,
      user: userId,
      measurement: measurementId,
      styleAdjustments,
      additionalNotes
    });

    await customization.save();

    res.status(201).json({ message: 'Customization created successfully', customization });
  } catch (error) {
    console.error('Error in createCustomization:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCustomizationsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const customizations = await Customization.find({ user: userId })
      .populate('product')
      .populate('measurement');
    res.json(customizations);
  } catch (error) {
    console.error('Error in getCustomizationsByUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCustomizationById = async (req, res) => {
  try {
    const customization = await Customization.findById(req.params.id)
      .populate('product')
      .populate('measurement');
    if (!customization) {
      return res.status(404).json({ message: 'Customization not found' });
    }
    res.json(customization);
  } catch (error) {
    console.error('Error in getCustomizationById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCustomization = async (req, res) => {
  try {
    const { measurementId, styleAdjustments, additionalNotes } = req.body;
    const customization = await Customization.findById(req.params.id);

    if (!customization) {
      return res.status(404).json({ message: 'Customization not found' });
    }

    if (customization.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    if (measurementId) {
      const measurement = await Measurement.findById(measurementId);
      if (!measurement) {
        return res.status(404).json({ message: 'Measurement not found' });
      }
      customization.measurement = measurementId;
    }

    customization.styleAdjustments = styleAdjustments || customization.styleAdjustments;
    customization.additionalNotes = additionalNotes || customization.additionalNotes;
    customization.updatedAt = Date.now();

    await customization.save();

    res.json({ message: 'Customization updated successfully', customization });
  } catch (error) {
    console.error('Error in updateCustomization:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCustomization = async (req, res) => {
  try {
    const customization = await Customization.findById(req.params.id);

    if (!customization) {
      return res.status(404).json({ message: 'Customization not found' });
    }

    if (customization.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    await customization.remove();

    res.json({ message: 'Customization removed' });
  } catch (error) {
    console.error('Error in deleteCustomization:', error);
    res.status(500).json({ message: 'Server error' });
  }
};