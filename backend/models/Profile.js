const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String, required: true },
  mobile: { type: String },
  gender: { type: String },
  state: { type: String },
  district: { type: String },
  city: { type: String },
  address: { type: String },
  postalcode: { type: String },
  profileImage: { type: String }, // URL of profile picture
});

module.exports = mongoose.model('Profile', ProfileSchema);
