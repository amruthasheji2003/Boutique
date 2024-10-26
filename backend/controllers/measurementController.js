const Measurement = require('../models/Measurement');

exports.addMeasurement = async (req, res) => {
  try {
    const { productId, chest, waist, hips, length } = req.body;
    const userId = req.user.userId;

    let measurement = await Measurement.findOne({ user: userId, product: productId });

    if (measurement) {
      // Update existing measurement
      measurement.chest = chest;
      measurement.waist = waist;
      measurement.hips = hips;
      measurement.length = length;
      measurement.updatedAt = Date.now();
    } else {
      // Create new measurement
      measurement = new Measurement({
        user: userId,
        product: productId,
        chest,
        waist,
        hips,
        length
      });
    }

    await measurement.save();

    res.status(200).json({ message: 'Measurement added successfully', measurement });
  } catch (error) {
    console.error('Error adding measurement:', error);
    res.status(500).json({ message: 'Error adding measurement', error: error.message });
  }
};

exports.getMeasurement = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const measurement = await Measurement.findOne({ user: userId, product: productId });

    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }

    res.status(200).json({ measurement });
  } catch (error) {
    console.error('Error fetching measurement:', error);
    res.status(500).json({ message: 'Error fetching measurement', error: error.message });
  }
};