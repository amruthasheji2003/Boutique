import React, { useEffect, useState } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const removeFromCart = (itemToRemove) => {
    const updatedCart = cartItems.filter(item => item.id !== itemToRemove.id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price.replace('Rs.', '')), 0);
  };

  return (
    <div className="cart-container p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty!</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map(item => (
              <li key={item.id} className="flex justify-between items-center bg-white shadow-lg p-4 rounded-lg">
                <div className="flex items-center">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                  <span>{item.name} - {item.price}</span>
                </div>
                <button 
                  onClick={() => removeFromCart(item)} 
                  className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right">
            <h2 className="text-2xl font-semibold">Total: Rs. {calculateTotal()}</h2>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
