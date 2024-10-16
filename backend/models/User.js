const mongoose = require('mongoose');

// Regular expression for validating phone numbers (10-digit number)
const phoneRegex = /^[0-9]{10}$/;

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // Convert email to lowercase
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    match: phoneRegex, // Validate phone number format
  },
  profileImage: {
    type: String,
    default: 'default_profile_image.jpg', // Default profile image
  },
  role: {
    type: String,
    enum: ['customer', 'admin'], // Define roles if needed
    default: 'customer', // Default role
  },
}, { timestamps: true }); // Automatically create createdAt and updatedAt timestamps

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare password for authentication
userSchema.methods.comparePassword = async function (password) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);

