import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const API_BASE_URL = 'http://localhost:8080';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    // You might want to fetch the wishlist here as well
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Cart data received:', response.data);
      setCart(response.data.cart);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Error fetching cart. Please try again.');
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, newQuantity) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/cart/update/${productId}`,
        { quantity: newQuantity },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setCart(response.data.cart);
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError('Error updating cart item. Please try again.');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data && response.data.cart) {
        setCart(response.data.cart);
        setCartMessage({ text: 'Item removed from cart successfully!', type: 'success' });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setCartMessage({ text: err.response?.data?.message || err.message || 'Failed to remove item from cart. Please try again.', type: 'error' });
    }
  };

  const clearCart = async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/cart/clear`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data && response.data.message) {
        setCart({ items: [] });
        setCartMessage({ text: response.data.message, type: 'success' });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      setCartMessage({ text: err.response?.data?.message || err.message || 'Failed to clear cart. Please try again.', type: 'error' });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

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
            {/* You can add a search input here if needed */}
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
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        {(!cart || !cart.items || cart.items.length === 0) ? (
          <div className="text-center">
            <p className="text-xl mb-4">Your cart is empty.</p>
            <Link 
              to="/browse-catalog"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.product._id} className="bg-white p-4 rounded-lg shadow flex items-center">
                <img 
                  src={item.product.image ? `${API_BASE_URL}/${item.product.image}` : '/placeholder-image.jpg'}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover mr-4 rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                  <p className="text-gray-600">Price: Rs.{item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button 
                      onClick={() => updateCartItem(item.product._id, item.quantity - 1)} 
                      disabled={item.quantity <= 1}
                      className="bg-gray-200 px-2 py-1 rounded-l disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartItem(item.product._id, item.quantity + 1)}
                      className="bg-gray-200 px-2 py-1 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.product._id)}
                  className="ml-4 text-red-500 hover:text-red-700 transition-colors duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="mt-6 text-right text-xl font-bold">
              Total: Rs.{cart.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
            </div>
            <div className="flex justify-end mt-4">
              <button 
                onClick={clearCart}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
        {cartMessage && (
          <div className={`mt-4 p-2 rounded ${cartMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {cartMessage.text}
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;