const Profile = require('../models/Profile');
const User = require('../models/User');

// Create or update profile
exports.createOrUpdateProfile = async (req, res) => {
  const { firstname, lastname, email, mobile, gender, state, district, city, address, postalcode, profileImage } = req.body;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { firstname, lastname, email, mobile, gender, state, district, city, address, postalcode, profileImage },
        { new: true }
      );
      return res.json(profile);
    }

    // Create new profile
    profile = new Profile({
      user: req.user.id,
      firstname,
      lastname,
      email,
      mobile,
      gender,
      state,
      district,
      city,
      address,
      postalcode,
      profileImage,
    });

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['email']);
    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
