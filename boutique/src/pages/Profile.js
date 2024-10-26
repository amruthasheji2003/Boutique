import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    state: '',
    district: '',
    city: '',
    address: '',
    postalCode: ''
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (image) {
      formData.append('profileImage', image);
    }
    Object.keys(user).forEach((key) => {
      formData.append(key, user[key]);
    });

    try {
      await axios.put('/api/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/customer'); // Navigate back after update
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="profile-container">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" value={user.firstName} onChange={handleChange} placeholder="First Name" required />
        <input type="text" name="lastName" value={user.lastName} onChange={handleChange} placeholder="Last Name" required />
        <input type="email" name="email" value={user.email} onChange={handleChange} placeholder="Email" required />
        <input type="tel" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
        <select name="gender" value={user.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input type="text" name="state" value={user.state} onChange={handleChange} placeholder="State" required />
        <input type="text" name="district" value={user.district} onChange={handleChange} placeholder="District" required />
        <input type="text" name="city" value={user.city} onChange={handleChange} placeholder="City" required />
        <input type="text" name="address" value={user.address} onChange={handleChange} placeholder="Address" required />
        <input type="text" name="postalCode" value={user.postalCode} onChange={handleChange} placeholder="Postal Code" required />
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;