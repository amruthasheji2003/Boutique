import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import logo from '../assets/logo.png'; // Update this path to your logo's location
import backgroundImage from '../assets/customer.jpg'; 

const API_URL = 'http://localhost:8080';

const Customer = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const name = localStorage.getItem('name');
        setUser(name);
        console.log(user);

        // console.log(localStorage)
        const response = await axios.get(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setError(null);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile');
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    navigate('/login'); // Redirect to login page after logout
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/browse-catalog?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div
      className="dashboard-container min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header Section */}
      <header className="h-20 shadow-md bg-white fixed w-full z-30">
        <div className="container mx-auto flex items-center justify-between px-4 h-full">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/">
              <img src={logo} alt="Tailor's Touch Logo" className="h-12 mr-2" />
            </Link>
            <Link
              to="/"
              className="text-green-600 text-3xl font-bold hover:text-pink-500 transition-colors duration-300"
            >
              Tailor's Touch Boutique
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-grow mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-2 rounded-full bg-gray-100 text-black focus:outline-none"
              />
              <FaSearch
                className="absolute right-3 top-2.5 text-gray-600 cursor-pointer"
                onClick={handleSearch}
              />
            </div>
          </div>

          {/* User-related actions */}
          <div className="flex items-center space-x-6">
            <p>Welcome, {user}.</p>
            {/* <Link
              to="/"
              className="hover:text-pink-500 transition-colors duration-300"
            >
              Home
            </Link>
            <button
              onClick={() => navigate('/view-my-orders')}
              className="hover:text-pink-500 transition-colors duration-300"
            >
              My Orders
            </button> */}
            <button
              onClick={() => navigate('/wishlist')}
              className="hover:text-pink-500 transition-colors duration-300"
            >
              <FaHeart className="text-xl" />
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="hover:text-pink-500 transition-colors duration-300"
            >
              <FaShoppingCart className="text-xl" />
            </button>

            {/* Logout button */}
            <div className="bg-gray-200 rounded-md px-4 py-2 shadow-md">
              <button
                onClick={handleLogout}
                className="text-black hover:text-pink-500 transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-grow items-center justify-center mt-20">
        {isLoading ? (
          <p className="text-white text-2xl">Loading...</p>
        ) : error ? (
          <p className="text-white text-2xl">{error}</p>
        ) : user ? (
          <h1 className="text-white text-5xl font-bold">Welcome, {user.firstName}!</h1>
        ) : (
          <p className="text-white text-2xl">No user data available</p>
        )}
      </div>
    </div>
  );
};

export default Customer;
