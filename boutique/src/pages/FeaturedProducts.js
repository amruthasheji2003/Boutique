import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const FeaturedProducts = ({ isAuthenticated, handleLogout }) => {
  const navigate = useNavigate();

  const featuredProducts = [
    {
      id: 1,
      name: 'Elegant Evening Gown',
      imageUrl: require('../assets/product1.jpg'),
      description: 'A stunning evening gown with exquisite detailing.',
    },
    {
      id: 2,
      name: 'Casual Summer Dress',
      imageUrl: require('../assets/product2.webp'),
      description: 'Perfect for a casual outing on a sunny day.',
    },
    {
      id: 3,
      name: 'Classic Suit',
      imageUrl: require('../assets/product3.webp'),
      description: 'A classic suit tailored to perfection.',
    },
  ];

  return (
    <>
      {/* Header Section */}
      <header className='h-16 shadow-md bg-yellow-900 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <div className='flex items-center gap-4'>
            {/* Back to Home Button at top left */}
            
            {/* Website title */}
            <Link to="/" className='text-green text-2xl font-bold hover:text-pink-100 transition-colors duration-300 ml-4'>
              Tailor's Touch Boutique
            </Link>
           
            {/* Navigation Links */}
            <nav className='hidden lg:flex items-center space-x-40 ml-20'>
              <Link to="/" className='text-white text-lg hover:text-blue-300 transition-colors duration-300'>Home</Link>
              <Link to="/featured-products" className='text-white text-lg hover:text-blue-300 transition-colors duration-300'>Featured Products</Link>
              <Link to="/contact-us" className='text-white text-lg hover:text-blue-300 transition-colors duration-300'>Contact Us</Link>
            </nav>
          </div>
          <button
              onClick={() => navigate('/')}
              className="text-white text-lg hover:text-blue-300 transition-colors duration-300"
            >
              Back 
            </button>

          <div className='flex items-center gap-10'>
            {/* Conditional Login/Logout */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className='px-4 py-2 rounded-full text-teal-800 bg-white hover:bg-gray-100 transition-colors duration-300'
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className='px-4 py-2 rounded-full text-teal-800 bg-white hover:bg-gray-100 transition-colors duration-300'>
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Adjusted padding to compensate for fixed header */}
      <div className="FeaturedProducts pt-28 px-6"> {/* Added 'pt-28' for space under fixed header */}
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card p-4 bg-white rounded-lg shadow-lg">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-48 w-full object-contain rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FeaturedProducts;
