import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import churidar1 from '../assets/churidar1.jpg';
import churidar2 from '../assets/churidar2.jpg';
import lehenga1 from '../assets/lehenga1.jpg';
import lehenga2 from '../assets/lehenga2.jpg';
import lehenga3 from '../assets/lehenga3.jpg';
import pattpavada from '../assets/pattpavada.webp';
import pattpavada2 from '../assets/pattpavada2.jpg';
import frock1 from '../assets/frock1.jpg';
import frock2 from '../assets/frock2.jpg';

const BrowseCatalog = () => {
  const [catalogItems, setCatalogItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = [
          { id: 1, name: 'Anarkali', price: 'Rs.850', imageUrl: churidar1 },
          { id: 2, name: 'Lehenga', price: 'Rs.1200', imageUrl: lehenga1 },
          { id: 3, name: 'Lehenga', price: 'Rs.3000', imageUrl: lehenga2 },
          { id: 4, name: 'Anarkali', price: 'Rs.1000', imageUrl: churidar2 },
          { id: 5, name: 'Lehenga', price: 'Rs.2800', imageUrl: lehenga3 },
          { id: 6, name: 'Pattpavada', price: 'Rs.1000', imageUrl: pattpavada },
          { id: 7, name: 'Pattpavada', price: 'Rs.2000', imageUrl: pattpavada2 },
          { id: 8, name: 'Frock', price: 'Rs.850', imageUrl: frock1 },
          { id: 9, name: 'Frock', price: 'Rs.900', imageUrl: frock2 }
        ];

        await new Promise(resolve => setTimeout(resolve, 1000));
        setCatalogItems(data);
      } catch (error) {
        setError('Failed to load catalog items.');
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const addToCart = (item) => {
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!currentCart.find(cartItem => cartItem.id === item.id)) {
      currentCart.push(item);
      localStorage.setItem('cart', JSON.stringify(currentCart));
      alert(`${item.name} has been added to the cart!`);
    } else {
      alert(`${item.name} is already in your cart!`);
    }
  };

  const addToWishlist = (item) => {
    const currentWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!currentWishlist.find(wishlistItem => wishlistItem.id === item.id)) {
      currentWishlist.push(item);
      localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
      alert(`${item.name} has been added to your wishlist!`);
    } else {
      alert(`${item.name} is already in your wishlist!`);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="catalog-container p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Browse Catalog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogItems.map((item) => (
          <div key={item.id} className="catalog-item bg-white shadow-lg p-4 rounded-lg">
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-auto object-contain max-h-48" 
              />
            </div>
            <h2 className="text-2xl font-semibold mb-2">{item.name}</h2>
            <p className="text-lg text-gray-600 mb-4">{item.price}</p>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-2"
              onClick={() => addToCart(item)}
            >
              Add to Cart
            </button>
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              onClick={() => addToWishlist(item)}
            >
              Add to Wishlist
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button 
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 mr-4"
          onClick={() => navigate('/cart')}
        >
          View Cart
        </button>
        <button 
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 mr-4"
          onClick={() => navigate('/wishlist')}
        >
          View Wishlist
        </button>
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          onClick={() => navigate('/customer')}
        >
          Back to Customer Page
        </button>
      </div>
    </div>
  );
};

export default BrowseCatalog;
