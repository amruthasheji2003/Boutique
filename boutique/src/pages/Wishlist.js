import React, { useEffect, useState } from 'react';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlistItems(storedWishlist);
  }, []);

  const removeFromWishlist = (itemToRemove) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== itemToRemove.id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  return (
    <div className="wishlist-container p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p className="text-center">Your wishlist is empty!</p>
      ) : (
        <ul className="space-y-4">
          {wishlistItems.map(item => (
            <li key={item.id} className="flex justify-between items-center bg-white shadow-lg p-4 rounded-lg">
              <div className="flex items-center">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                <span>{item.name} - {item.price}</span>
              </div>
              <button 
                onClick={() => removeFromWishlist(item)} 
                className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
