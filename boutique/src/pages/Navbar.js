import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch profile when component mounts
    const fetchProfile = async () => {
      const res = await fetch('/api/profile/me', {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      const data = await res.json();
      setProfile(data);
    };

    fetchProfile();
  }, []);

  return (
    <nav>
      <Link to="/">Home</Link>
      {profile ? (
        <div>
          <img
            src={profile.profileImage || '/assets/user-default.png'}
            alt="Profile"
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
          <Link to="/profile">My Profile</Link>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default NavBar;
