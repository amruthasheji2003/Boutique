import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
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
      setCart(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Error fetching cart. Please try again.');
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, newQuantity) => {
    try {
      await axios.put(`${API_BASE_URL}/api/cart`, 
        { productId, quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchCart();
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError('Error updating cart item. Please try again.');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchCart();
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError('Error removing item from cart. Please try again.');
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Error clearing cart. Please try again.');
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  if (!cart || !cart.items || cart.items.length === 0) return <div className="container mx-auto p-4">Your cart is empty.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Cart</h1>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item._id} className="flex items-center border-b border-gray-200 py-4">
            <img 
              src={`${API_BASE_URL}/${item.product.image}`} 
              alt={item.product.name}
              className="w-24 h-24 object-cover mr-4"
            />
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{item.product.name}</h3>
              <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
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
              className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right text-xl font-bold">
        Total: ${cart.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
      </div>
      <button 
        onClick={clearCart}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Clear Cart
      </button>
    </div>
  );
}

export default Cart;