const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true }, 
  city: { type:String, required: true },
  address: { type:String, required: true },
  postalCode: { type:String, required: true },
  role: { type: String, default: 'customer', enum: ['customer', 'admin'] },
  profileImage: {type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);