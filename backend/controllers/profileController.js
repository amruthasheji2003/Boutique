const Profile = require('../models/Profile');

// Create Profile
exports.createProfile = async (req, res) => {
  const { firstname, lastname, email, mobile, gender, state, district, city, address, postalcode } = req.body;

  try {
    const newProfile = new Profile({
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
    });

    const savedProfile = await newProfile.save();
    res.json(savedProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
