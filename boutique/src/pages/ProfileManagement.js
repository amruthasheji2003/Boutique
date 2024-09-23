import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileManagement = () => {
  const [user, setUser] = useState({
    username: '',
    phoneNumber: '',
    address: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching user details from localStorage (or an API)
    const loggedInUser = JSON.parse(localStorage.getItem('user')); 
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      // Redirect to login if user not found
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user session and redirect to login
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <h1>Profile Management</h1>
      <div>
        <p>Username: {user.username}</p>
        <p>Phone Number: {user.phoneNumber}</p>
        <p>Address: {user.address}</p>
      </div>
      <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfileManagement;
