// const mongoose = require('mongoose');

// const batchSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true,
//   },
//   batchId: {
//     type: String,
//     required: true,
//   },
//   productDate: {
//     type: Date,
//     required: true,
//   },
//   quality: {
//     type: String,
//     enum: ['A', 'B', 'C'],
//     default: 'A',
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//   },
//   discount: {
//     type: Number,
//     default: 0,
//   },
//   finalPrice: {
//     type: Number,
//     required: true,
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('Batch', batchSchema);
