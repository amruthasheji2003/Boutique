import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import logo from '../assets/logo.png';

const ContactUs = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
    // You might want to navigate to a search results page or filter products
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className='h-20 shadow-md bg-white fixed w-full z-40'>
        <div className='container mx-auto flex items-center justify-between px-4 h-full'>
          {/* Logo Section */}
          <div className='flex items-center'>
            <Link to="/">
              <img src={logo} alt="Tailor's Touch Logo" className="h-12 mr-4" />
            </Link>
            <Link to="/" className='text-green-600 text-3xl font-bold hover:text-pink-500 transition-colors duration-300'>
              Tailor's Touch Boutique
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className='flex items-center w-full max-w-md mx-4'>
            <input
              type='text'
              placeholder='Search for products...'
              className='w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              className='bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors duration-300'
              onClick={handleSearch}
            >
              <FaSearch />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className='flex items-center space-x-8'>
            <Link to="/" className='text-gray-700 hover:text-blue-500 transition-colors duration-300'>Home</Link>
            <Link to="/contact-us" className='text-gray-700 hover:text-blue-500 transition-colors duration-300'>Contact Us</Link>
            <Link to="/login" className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300'>
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Content Section */}
      <div className="contact-us py-16 px-6 bg-white pt-28">
        <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg mb-4">
            We would love to hear from you! Please reach out with any questions, comments, or custom tailoring inquiries.
          </p>
          <p className="text-lg mb-4">
            <strong>Email:</strong> contact@tailorstouch.com
          </p>
          <p className="text-lg mb-4">
            <strong>Phone:</strong> +91 813694 2160, +91 92072 34631
          </p>
          <p className="text-lg mb-8">
            <strong>Address:</strong> 123 Fashion Street, Boutique City, Country
          </p>
        </div>

        {/* Google Map Embed */}
        <div className="max-w-4xl mx-auto mt-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2154.6701490474775!2d76.55534504152551!3d9.67014638124271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07d37b608e9e13%3A0xe19691b596c0387a!2sMH93%2BRWW%2C%20Ettumanoor%2C%20Kerala%20686631!5e1!3m2!1sen!2sin!4v1729699760203!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
            aria-label="Google Map showing our location"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;