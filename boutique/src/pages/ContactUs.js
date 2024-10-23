import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import logo from '../assets/logo.png';

const ContactUs = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSearch = () => {
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
    // You might want to navigate to a search results page or filter products
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement form submission logic here
    console.log('Form submitted:', formData);
    // You might want to send this data to an API or perform other actions
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
        <h2 className="text-4xl font-bold text-center mb-12 text-green-600">Get in Touch</h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-8 text-center text-gray-700">
            We would love to hear from you! Please reach out with any questions, comments, or custom tailoring inquiries.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <FaEnvelope className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-700">tailorstouchboutique@gmail.com</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <FaPhone className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-700">+91 813694 2160</p>
              <p className="text-gray-700">+91 92072 34631</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <FaMapMarkerAlt className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Address</h3>
              <p className="text-gray-700">Tailor's Touch Boutique,MH93+RWW, Ettumanoor, Kerala</p>
            </div>
          </div>
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

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto mt-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-green-600">Send us a Message</h3>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" 
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" 
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="4" 
                value={formData.message}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              ></textarea>
            </div>
            <div>
              <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;