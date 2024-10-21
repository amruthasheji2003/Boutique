import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:8080';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCart(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching cart. Please try again.');
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await axios.put(`${API_URL}/api/cart/update`, 
        { productId, quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setCart(response.data);
    } catch (err) {
      setError('Error updating cart. Please try again.');
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCart(response.data);
    } catch (err) {
      setError('Error removing item from cart. Please try again.');
    }
  };

  if (loading) return <div className="text-center py-10">Loading cart...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!cart || cart.items.length === 0) return <div className="text-center py-10">Your cart is empty.</div>;

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-5">Your Cart</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {cart.items.map(item => (
          <div key={item.product._id} className="flex items-center border-b border-gray-200 py-4 px-6">
            <img 
              src={`${API_URL}/${item.product.image}`} 
              alt={item.product.name} 
              className="w-20 h-20 object-cover mr-4 rounded"
            />
            <div className="flex-grow">
              <h2 className="text-lg font-semibold">{item.product.name}</h2>
              <p className="text-gray-600">Price: ₹{item.price.toFixed(2)}</p>
              <div className="flex items-center mt-2">
                <button 
                  onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))} 
                  className="bg-gray-200 px-2 py-1 rounded"
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)} 
                  className="bg-gray-200 px-2 py-1 rounded"
                >
                  +
                </button>
                <button 
                  onClick={() => removeItem(item.product._id)} 
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-right">
        <p className="text-xl font-bold">Total: ₹{cart.total.toFixed(2)}</p>
        <Link 
          to="/checkout" 
          className="mt-4 inline-block bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition-colors duration-300"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;