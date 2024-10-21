import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaSearch } from 'react-icons/fa';
import logo from '../assets/logo.png'; // Update this path to your logo's location
import backgroundImage from '../assets/customer.jpg'; // Update this path to your background image's location

const Customer = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    // Add your logout logic here (e.g., clear tokens, redirect to login page)
    navigate('/'); // Redirect to login page after logout
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
            <Link
              to="/" // Navigate to home page
              className="hover:text-pink-500 transition-colors duration-300"
            >
              Home
            </Link>
            <button
              onClick={() => navigate('/view-my-orders')}
              className="hover:text-pink-500 transition-colors duration-300"
            >
              My Orders
            </button>
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
            {/* Logout button inside a rectangular box */}
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
        <h1 className="text-white text-5xl font-bold">Hey, WELCOME!</h1>
      </div>
    </div>
  );
};

export default Customer;
