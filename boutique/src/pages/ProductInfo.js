import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

const ProductInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(response.data);
        if (response.data.batches && response.data.batches.length > 0) {
          setSelectedSize(response.data.batches[0].size);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error fetching product details. Please try again.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const handleMouseMove = (e) => {
    if (isZoomed && imageRef.current) {
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setZoomPosition({ x, y });
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add items to cart.');
        return;
      }

      const response = await axios.post(`${API_URL}/api/cart/add`, {
        productId: product._id,
        quantity: quantity,
        size: selectedSize
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.cart) {
        alert('Product added to cart successfully!');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const handleAddToWishlist = async () => {
    // ... (keep existing handleAddToWishlist function)
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  const totalStock = product.batches.reduce((sum, batch) => sum + batch.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back
      </button>
      <div className="flex flex-col lg:flex-row -mx-4">
        <div className="lg:w-2/3 px-4 mb-8 lg:mb-0">
          <div 
            className="relative overflow-hidden bg-gray-100 rounded-lg"
            style={{ paddingBottom: '100%' }}
            onMouseMove={handleMouseMove}
            ref={imageRef}
          >
            <img 
              src={`${API_URL}/${product.image}`} 
              alt={product.name}
              className={`absolute top-0 left-0 w-full h-full object-contain transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
              style={isZoomed ? {
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
              } : {}}
            />
            <button
              onClick={handleZoomToggle}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
            >
              {isZoomed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="lg:w-1/3 px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">{product.category.name} &gt; {product.subcategory.name}</p>
          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">₹{product.batches[0].finalPrice.toFixed(2)}</span>
            <span className="ml-2 text-lg text-green-600 font-semibold">Save {product.batches[0].discount}%</span>
          </div>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Select Size</h3>
            <div className="flex flex-wrap -mx-2">
              {product.batches.map((batch) => (
                <div key={batch.size} className="px-2 mb-2">
                  <button
                    className={`w-12 h-12 rounded-full border ${
                      selectedSize === batch.size
                        ? 'border-indigo-500 bg-indigo-50'
                        : batch.quantity > 0
                        ? 'border-gray-300 hover:border-gray-400'
                        : 'border-gray-200 bg-gray-100 cursor-not-allowed'
                    } flex items-center justify-center`}
                    onClick={() => batch.quantity > 0 && setSelectedSize(batch.size)}
                    disabled={batch.quantity === 0}
                  >
                    {batch.size}
                  </button>
                  {batch.quantity === 0 && (
                    <p className="text-xs text-red-500 mt-1">Out of stock</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <select 
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
            >
              {[1,2,3,4,5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-4 mb-6">
            <button 
              className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleAddToCart}
              disabled={!selectedSize || product.batches.find(b => b.size === selectedSize).quantity === 0}
            >
              Add to Cart
            </button>
            <button 
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={handleAddToWishlist}
            >
              Add to Wishlist
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Free shipping on all continental US orders.
          </p>
          <p className="text-sm font-semibold text-gray-700">
            {totalStock > 0 ? `${totalStock} item(s) left` : 'Out of stock'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;