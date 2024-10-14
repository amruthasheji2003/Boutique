import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState({});
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get('/api/users/USER_ID'); // Replace USER_ID with actual ID
      setUser(response.data);
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
    formData.append('profileImage', image);
    Object.keys(user).forEach((key) => {
      formData.append(key, user[key]);
    });

    await axios.put(`/api/users/${user._id}`, formData);
    navigate('/customer'); // Navigate back after update
  };

  return (
    <div className="profile-container">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" value={user.firstName || ''} onChange={handleChange} placeholder="First Name" required />
        <input type="text" name="lastName" value={user.lastName || ''} onChange={handleChange} placeholder="Last Name" required />
        <input type="email" name="email" value={user.email || ''} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="mobile" value={user.mobile || ''} onChange={handleChange} placeholder="Mobile" required />
        <input type="text" name="gender" value={user.gender || ''} onChange={handleChange} placeholder="Gender" />
        <input type="text" name="state" value={user.state || ''} onChange={handleChange} placeholder="State" />
        <input type="text" name="district" value={user.district || ''} onChange={handleChange} placeholder="District" />
        <input type="text" name="city" value={user.city || ''} onChange={handleChange} placeholder="City" />
        <input type="text" name="address" value={user.address || ''} onChange={handleChange} placeholder="Address" />
        <input type="text" name="postalCode" value={user.postalCode || ''} onChange={handleChange} placeholder="Postal Code" />
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
