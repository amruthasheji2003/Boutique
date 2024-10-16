import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import logo from '../assets/logo.png'; // Import the logo image

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/browse-catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const featuredProducts = [
    {
      id: 1,
      name: 'Elegant Gown',
      imageUrl: require('../assets/product1.jpg'),
      description: 'Gown designed to make every occasion special',
    },
    {
      id: 2,
      name: 'Long Skirt and Top',
      imageUrl: require('../assets/product2.webp'),
      description: 'A versatile and stylish long skirt and top, perfect for both casual outings and dressier events',
    },
    {
      id: 3,
      name: 'Top with Skirt and Shrug',
      imageUrl: require('../assets/product3.webp'),
      description: 'Offers a coordinated look with modern flair, ideal for a variety of occasions',
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <header className='h-20 shadow-md bg-white fixed w-full z-40'>
        <div className='container mx-auto flex items-center justify-between px-4 h-full'>
          {/* Logo Section */}
          <div className='flex items-center'>
            <Link to="/">
              <img src={logo} alt="Tailor's Touch Logo" className="h-12 mr-4" /> {/* Logo added */}
            </Link>
            <Link to="/" className='text-green text-3xl font-bold hover:text-pink-100 transition-colors duration-300'>
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
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
            />
            <button 
              className='bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors duration-300'
              onClick={handleSearch} // Handle search button click
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

      {/* Hero Section */}
      <div 
        className="home flex items-center justify-center h-screen bg-center" 
        style={{ 
          backgroundImage: `url(${require('../assets/home13.jpg')})`,
          backgroundSize: 'cover', 
          backgroundRepeat: 'no-repeat', 
          backgroundPosition: 'center' 
        }}
      >
      </div>

      {/* Featured Products Section */}
      <div className="featured-products py-10 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card p-4 bg-white rounded-lg shadow-lg">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full rounded-t-lg" 
                style={{ height: 'auto' }} 
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Us Section */}
      <div className="about-us py-16 px-6 bg-gray-100">
        <h2 className="text-4xl font-bold text-center mb-6 text-green-600">About Us</h2>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg mb-4">
            At Tailor's Touch Boutique, we specialize in custom tailoring, blending timeless craftsmanship with modern style.
          </p>
          <p className="text-lg mb-4">
            Our commitment to quality ensures that every piece is crafted to perfection, making you look and feel extraordinary.
          </p>
          <p className="text-lg">
            Discover the elegance of personalized fashion tailored just for you, where every stitch tells your story.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
