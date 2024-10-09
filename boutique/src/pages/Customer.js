import React from 'react';
import { useNavigate } from 'react-router-dom';

const Customer = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here (e.g., clear tokens, redirect to login page)
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <div
      className="dashboard-container bg-cover bg-center min-h-screen flex flex-col"
      style={{ backgroundImage: `url(${require('../assets/bg1.jpg')})` }}
    >
      {/* Fixed Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-black bg-opacity-70 text-white z-50">
        <div className="flex space-x-6"> {/* Adjusted space between options */}
          <button
            onClick={() => navigate('/browse-catalog')}
            className="px-4 py-2 hover:underline transition duration-300"
          >
            Browse Catalog
          </button>
          <button
            onClick={() => navigate('/custom-orders')}
            className="px-4 py-2 hover:underline transition duration-300"
          >
            Custom Dress Orders
          </button>
          <button
            onClick={() => navigate('/track-orders')}
            className="px-4 py-2 hover:underline transition duration-300"
          >
            Track Orders
          </button>
          <button
            onClick={() => navigate('/order-history')}
            className="px-4 py-2 hover:underline transition duration-300"
          >
            Order History
          </button>
          <button
            onClick={() => navigate('/view-my-orders')}
            className="px-4 py-2 hover:underline transition duration-300"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate('/createprofile')}
            className="px-4 py-2 hover:underline transition duration-300"
          >
           Create Profile
          </button>
          <button
            onClick={() => navigate('/wishlist')}
            className="px-4 py-2 hover:underline transition duration-300"
          >
            Wishlist
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="px-4 py-2 hover:underline transition duration-300"
          >
            My Cart
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 hover:underline transition duration-300"
        >
          Logout
        </button>
      </nav>

      {/* Main content area */}
      <div className="flex flex-grow items-center justify-center">
        <h1 className="text-white text-5xl font-bold mt-24">Hey, WELCOME!</h1>
      </div>
    </div>
  );
};

export default Customer;
