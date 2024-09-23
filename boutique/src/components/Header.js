import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage when component mounts
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);  // If token exists, user is authenticated
    }
  }, []);  // Empty dependency array to run only on component mount

  const handleLogout = () => {
    localStorage.removeItem('token');  // Clear token from localStorage
    setIsAuthenticated(false);         // Update state to reflect logout
    navigate('/login');                // Redirect to login page
  };

  return (
    <header className='h-16 shadow-md bg-yellow-900 fixed w-full z-40'>
      <div className='h-full container mx-auto flex items-center px-4 justify-between'>
        <div className='flex items-center gap-4'>
          <Link to="/" className='text-green text-2xl font-bold hover:text-pink-100 transition-colors duration-300'>
            Tailor's Touch Boutique
          </Link>
          <nav className='hidden lg:flex items-center space-x-40 ml-20'>
            <Link to="/" className='text-white text-lg hover:text-blue-300 transition-colors duration-300'>Home</Link>
            <Link to="/featured-products" className='text-white text-lg hover:text-blue-300 transition-colors duration-300'>Featured Products</Link>
            <Link to="/contact-us" className='text-white text-lg hover:text-blue-300 transition-colors duration-300'>Contact Us</Link>
          </nav>
        </div>

        <div className='flex items-center gap-10'>
          <Link to="/cart" className='text-2xl relative text-white'>
            <FaShoppingCart />
            <div className='bg-green-500 text-gray-900 w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
              <p className='text-sm'></p>
            </div>
          </Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className='px-4 py-2 rounded-full text-teal-800 bg-white hover:bg-gray-100'
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className='px-4 py-2 rounded-full text-teal-800 bg-white hover:bg-gray-100'>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
