import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const API_URL = 'http://localhost:8080';

const formatPrice = (price) => {
  return `₹${new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)}`;
};

const BrowseCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartMessage, setCartMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCart();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    } else {
      setSubcategories([]);
      setSelectedSubcategory('');
    }
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching products. Please try again later.');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(`${API_URL}/api/subcategories/${categoryId}`);
      setSubcategories(response.data);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCart(response.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const getProductPriceRange = (product) => {
    if (!product.batches || product.batches.length === 0) {
      return 'Price not available';
    }

    const prices = product.batches.map(batch => batch.finalPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice === maxPrice) {
      return formatPrice(minPrice);
    } else {
      return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  }

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartMessage({ text: 'Please log in to add items to cart.', type: 'error' });
        return;
      }

      const response = await axios.post(`${API_URL}/api/cart/add`, {
        productId: product._id,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.cart) {
        setCart(response.data.cart);
        setCartMessage({ text: `${product.name} added to cart successfully!`, type: 'success' });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        setCartMessage({ text: 'Your session has expired. Please log in again.', type: 'error' });
      } else {
        setCartMessage({ text: err.response?.data?.message || err.message || 'Failed to add item to cart. Please try again.', type: 'error' });
      }
    }
    setTimeout(() => {
      setCartMessage(null);
    }, 3000);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory('');
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const addToWishlist = (product) => {
    if (!wishlist.some(item => item._id === product._id)) {
      setWishlist([...wishlist, product]);
      console.log(`Added ${product.name} to wishlist`);
    }
  };

  const filteredProducts = products.filter(product => 
    (selectedCategory === '' || product.category._id === selectedCategory) &&
    (selectedSubcategory === '' || product.subcategory._id === selectedSubcategory) &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 relative">
      <header className='h-16 shadow-md bg-white fixed w-full z-30'>
        <div className='container mx-auto flex items-center justify-between px-4 h-full'>
          
          <Link to="/">
            <img src={logo} alt="Tailor's Touch Logo" className="h-12 mr-2" />
          </Link>
          <Link to="/" className='text-green-600 text-3xl font-bold hover:text-pink-500 transition-colors duration-300'>
            Tailor's Touch Boutique
          </Link>
          <div className="flex-grow mx-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <nav className="flex items-center space-x-6">
            <Link to="/" className='text-gray-700 hover:text-pink-500 transition-colors duration-300'>Home</Link>
            <Link to="/wishlist" className='text-gray-700 hover:text-pink-500 transition-colors duration-300 relative'>
              Wishlist
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className='text-gray-700 hover:text-pink-500 transition-colors duration-300 relative'>
              Cart
              {cart.items && cart.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
            <button 
            onClick={handleGoBack}
            className="text-gray-600 hover:text-gray-900 transition-colors duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          </nav>
        </div>
        
      </header>

      <main className="flex-grow container mx-auto px-4 pt-20 pb-8"> 
        <div className="mb-6 flex flex-wrap items-center">
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/4 md:pl-4">
            <select
              value={selectedSubcategory}
              onChange={handleSubcategoryChange}
              className="w-full py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              disabled={!selectedCategory}
            >
              <option value="">All Subcategories</option>
              {subcategories.map(subcategory => (
                <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {loading && <div className="text-center mt-8">Loading...</div>}
        {error && <div className="text-center mt-8 text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map(product => {
              const priceRange = getProductPriceRange(product);
              return (
                <div 
                  key={product._id} 
                  className="bg-white rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="relative pb-[125%] overflow-hidden">
                    <img 
                      src={`${API_URL}/${product.image}`} 
                      alt={product.name} 
                      className="absolute top-0 left-0 w-full h-full object-cover object-center cursor-pointer"
                      onClick={() => handleProductClick(product._id)}
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToWishlist(product);
                      }}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-pink-500 transition-colors duration-300"
                      title="Add to Wishlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <h2 className="text-sm font-medium text-gray-900 mb-1 truncate">{product.name}</h2>
                    <p className="text-xs text-gray-500 mb-2 truncate">{product.category.name}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-bold text-gray-900">
                        {priceRange}
                      </p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="px-3 py-1 bg-pink-500 text-white text-xs font-medium rounded hover:bg-pink-600 transition-colors duration-300"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="text-center mt-8 text-gray-500">No products found.</p>
        )}
      </main>

      {cartMessage && (
        <div 
          className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
            cartMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white z-50 transition-opacity duration-300`}
        >
          {cartMessage.text}
        </div>
      )}
    </div>
  );
};

export default BrowseCatalog;