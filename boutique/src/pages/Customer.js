import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Customer = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div
      className="dashboard-container bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${require('../assets/bg1.jpg')})` }}
    >
      <div className="flex h-full bg-black bg-opacity-70">
        {/* Sidebar with buttons aligned on the left */}
        <div className="flex flex-col justify-start p-6 space-y-4 w-1/4">
          <button
            onClick={() => navigate('/browse-catalog')}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
          >
            Browse Catalog
          </button>
          <button
            onClick={() => navigate('/custom-orders')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Custom Dress Orders
          </button>
          <button
            onClick={() => navigate('/track-orders')}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
          >
            Track Orders
          </button>
          <button
            onClick={() => navigate('/order-history')}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            Order History
          </button>
          <button
            onClick={() => navigate('/view-my-orders')}
            className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate('/editprofile')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate('/wishlist')}
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-300"
          >
            Wishlist
          </button>

          <div className="mt-8">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-grow items-center justify-center">
          <h1 className="text-white text-5xl font-bold">Hey, WELCOME!</h1>
        </div>
      </div>
    </div>
  );
};

export default Customer;
