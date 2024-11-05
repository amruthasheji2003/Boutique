const mongoose = require('mongoose');

const customizationSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  measurement: { type: mongoose.Schema.Types.ObjectId, ref: 'Measurement', required: true },
  styleAdjustments: {
    sleeveLength: { type: String, enum: ['short', '3/4', 'long'], required: true },
    neckline: { type: String, enum: ['round', 'v-neck', 'square'], required: true }
  },
  additionalNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customization', customizationSchema);