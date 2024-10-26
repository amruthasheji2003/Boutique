import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const API_BASE_URL = 'http://localhost:8080';

function Wishlist() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistMessage, setWishlistMessage] = useState(null);
  const [cart, setCart] = useState({ items: [] });
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
    fetchCart();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Wishlist data received:', response.data);
      setWishlist(response.data.wishlist);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Error fetching wishlist. Please try again.');
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCart(response.data.cart);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/wishlist/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      console.log('Server response:', response.data);
  
      if (response.data && response.data.wishlist) {
        // Update the wishlist state with the new data from the server
        setWishlist(response.data.wishlist);
        setWishlistMessage({ text: 'Product removed from wishlist successfully!', type: 'success' });
      } else {
        // If the server doesn't return the updated wishlist, update the local state
        setWishlist(prevWishlist => ({
          ...prevWishlist,
          products: prevWishlist.products.filter(id => id.toString() !== productId)
        }));
        setWishlistMessage({ text: 'Product removed from wishlist', type: 'success' });
      }
  
      // Optionally, you can trigger a re-fetch of the wishlist here
      // fetchWishlist();
    } catch (err) {
      console.error('Error removing item from wishlist:', err);
      if (err.response && err.response.status === 404) {
        setWishlistMessage({ text: 'Wishlist not found', type: 'error' });
      } else {
        setWishlistMessage({ 
          text: err.response?.data?.message || 'Failed to remove item from wishlist. Please try again.', 
          type: 'error' 
        });
      }
    }
  };
  const clearWishlist = async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/wishlist/clear`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data && response.data.message) {
        setWishlist({ products: [] });
        setWishlistMessage({ text: response.data.message, type: 'success' });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error clearing wishlist:', err);
      setWishlistMessage({ text: err.response?.data?.message || err.message || 'Failed to clear wishlist. Please try again.', type: 'error' });
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/cart/add`, 
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (response.data && response.data.cart) {
        setCart(response.data.cart);
        setWishlistMessage({ text: 'Item added to cart successfully!', type: 'success' });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error adding item to cart:', err);
      setWishlistMessage({ text: err.response?.data?.message || err.message || 'Failed to add item to cart. Please try again.', type: 'error' });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  console.log('Wishlist state:', wishlist); // Log wishlist state for debugging

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
          <nav className="flex items-center space-x-6">
            <Link to="/" className='text-gray-700 hover:text-pink-500 transition-colors duration-300'>Home</Link>
            <Link to="/wishlist" className='text-gray-700 hover:text-pink-500 transition-colors duration-300 relative'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist && wishlist.products && wishlist.products.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {wishlist.products.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className='text-gray-700 hover:text-pink-500 transition-colors duration-300 relative'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart && cart.items && cart.items.length > 0 && (
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

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
        {(!wishlist || !wishlist.products || wishlist.products.length === 0) ? (
          <div className="text-center">
            <p className="text-xl mb-4">Your wishlist is empty.</p>
            <Link 
              to="/browse-catalog"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.products.map((product) => (
              <div key={product._id} className="bg-white p-4 rounded-lg shadow flex items-center">
                <img 
                  src={product.image ? `${API_BASE_URL}/${product.image}` : '/placeholder-image.jpg'}
                  alt={product.name}
                  className="w-24 h-24 object-cover mr-4 rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">
                    Price: Rs.{product.price ? product.price.toFixed(2) : 'N/A'}
                  </p>
                  <button 
                    onClick={() => addToCart(product._id)}
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
                <button 
                  onClick={() => removeFromWishlist(product._id)}
                  className="ml-4 text-red-500 hover:text-red-700 transition-colors duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <button 
                onClick={clearWishlist}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
              >
                Clear Wishlist
              </button>
            </div>
          </div>
        )}
        {wishlistMessage && (
          <div className={`mt-4 p-2 rounded ${wishlistMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {wishlistMessage.text}
          </div>
        )}
      </main>
    </div>
  );
}

export default Wishlist;