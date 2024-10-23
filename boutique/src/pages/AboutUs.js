import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import logo from '../assets/logo.png';

const AboutUs = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className='h-16 shadow-md bg-white fixed w-full z-30'>
        <div className='container mx-auto flex items-center justify-between px-4 h-full'>
          {/* Logo Section */}
          <div className='flex items-center'>
            <Link to="/">
              <img src={logo} alt="Tailor's Touch Logo" className="h-12 mr-4" />
            </Link>
            <Link to="/" className='text-white text-3xl font-bold hover:text-gray-300 transition-colors duration-300'>
              Tailor's Touch Boutique
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className='flex items-center w-full max-w-md mx-4'>
            <input
              type='text'
              placeholder='Search for products...'
              className='w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-400'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              className='bg-gray-700 text-white px-4 py-2 rounded-r-md hover:bg-gray-600 transition-colors duration-300'
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
      {/* About Us Content */}
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">About Tailor's Touch Boutique</h1>
          
          <section className="mb-16 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-gray-200 pb-2">Our Story</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Tailor's Touch Boutique was founded in 2010 with a passion for creating bespoke clothing that celebrates individuality and style. Our journey began in a small workshop and has since grown into a beloved boutique known for its quality craftsmanship and personalized service.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We believe that every person deserves clothing that fits perfectly and reflects their unique personality. This belief drives our commitment to providing tailored solutions for all our customers.
            </p>
          </section>

          <section className="mb-16 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-gray-200 pb-2">Our Mission</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              At Tailor's Touch Boutique, our mission is to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Provide high-quality, custom-tailored clothing that fits perfectly and lasts long</li>
              <li>Offer a wide range of styles to suit diverse tastes and occasions</li>
              <li>Deliver exceptional customer service and a personalized shopping experience</li>
              <li>Promote sustainable fashion practices and ethical manufacturing</li>
            </ul>
          </section>

          <section className="mb-16 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-gray-200 pb-2">Our Team</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Our team of skilled tailors, designers, and customer service professionals work together to bring your fashion visions to life. With years of experience and a keen eye for detail, we ensure that every garment that leaves our boutique meets our high standards of quality and style.
            </p>
          </section>

          <section className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-gray-200 pb-2">Visit Us</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We invite you to visit our boutique and experience the Tailor's Touch difference for yourself. Our friendly staff is always ready to assist you in finding the perfect outfit or creating a custom piece that's uniquely yours.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Thank you for choosing Tailor's Touch Boutique. We look forward to serving you and being a part of your style journey.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;