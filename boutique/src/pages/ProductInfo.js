import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png'; // Make sure this path is correct


const API_URL = 'https://boutique-backend-j6re.onrender.com'

const ProductInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [measurements, setMeasurements] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartMessage, setCartMessage] = useState(null);
  const [wishlistMessage, setWishlistMessage] = useState(null);
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [basicMeasurements, setBasicMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
    length: '',
  });
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProductAndData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [productResponse, measurementResponse, cartResponse, wishlistResponse] = await Promise.all([
          axios.get(`https://boutique-backend-j6re.onrender.com/api/products/${id}`),
          axios.get(`https://boutique-backend-j6re.onrender.com/api/measurements/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/api/wishlist`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setProduct(productResponse.data);
        if (measurementResponse.data.measurement) {
          setMeasurements(measurementResponse.data.measurement);
        }
        
        // Check if the item is in the cart
        const cartItems = cartResponse.data.cart.items;
        const isProductInCart = cartItems.some(item => item.product._id === id);
        setIsInCart(isProductInCart);
        setCartItems(cartItems.map(item => item.product._id));

        // Check if the item is in the wishlist
        const wishlistItems = wishlistResponse.data.wishlist.products;
        setIsInWishlist(wishlistItems.some(item => item._id === id));
        setWishlist(wishlistItems);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching product details. Please try again.');
        setLoading(false);
      }
    };

    fetchProductAndData();
  }, [id]);

  useEffect(() => {
    if (product && product.batches.length > 0) {
      const availableBatches = product.batches.filter(batch => batch.stock > 0);
      const highestPricedBatch = availableBatches.sort((a, b) => b.finalPrice - a.finalPrice)[0];
      setSelectedVariation(highestPricedBatch);
    }
  }, [product]);

  useEffect(() => {
    if (selectedVariation) {
      setTotalPrice(selectedVariation.finalPrice * quantity);
    }
  }, [selectedVariation, quantity]);

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, parseInt(e.target.value));
    setQuantity(newQuantity);
  };

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
    if (isInCart) {
      setCartMessage({ text: `${product.name} is already in your cart.`, type: 'info' });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartMessage({ text: 'Please log in to add items to cart.', type: 'error' });
        return;
      }

      const response = await axios.post(`${API_URL}/api/cart/add`, {
        productId: product._id,
        quantity: quantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.cart) {
        setCart(response.data.cart);
        setCartItems(prevItems => [...prevItems, product._id]);
        setIsInCart(true);
        setCartMessage({ text: `${product.name} added to cart successfully!`, type: 'success' });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        setCart(null);
        setCartMessage({ text: 'Your session has expired. Please log in again.', type: 'error' });
      } else {
        setCartMessage({ text: err.response?.data?.message || err.message || 'Failed to add item to cart. Please try again.', type: 'error' });
      }
    }
    setTimeout(() => {
      setCartMessage(null);
    }, 3000);
  };

  const handleBuyNow = async () => {
    if (!isInCart) {
      await handleAddToCart();
    }
    navigate('/checkout');
  };

  const handleAddToWishlist = async () => {
    if (isInWishlist) {
      setWishlistMessage({ text: 'This item is already in your wishlist.', type: 'info' });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setWishlistMessage({ text: 'Please log in to add items to wishlist.', type: 'error' });
        return;
      }

      const response = await axios.post(`${API_URL}/api/wishlist/add`, {
        productId: product._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.wishlist) {
        setWishlistMessage({ text: `${product.name} added to wishlist successfully!`, type: 'success' });
        setIsInWishlist(true);
        setWishlist(prevWishlist => [...prevWishlist, product]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setWishlistMessage({ text: err.response?.data?.message || err.message || 'Failed to add item to wishlist. Please try again.', type: 'error' });
    }
    setTimeout(() => {
      setWishlistMessage(null);
    }, 3000);
  };

  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    setBasicMeasurements(prev => ({ ...prev, [name]: value }));
  };

  const handleMeasurementSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartMessage({ text: 'Please log in to save measurements.', type: 'error' });
        return;
      }
      const name = localStorage.getItem('name');
      
      const response = await axios.post(`${API_URL}/api/measurements/${id}`, basicMeasurements, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.measurement) {
        setMeasurements(response.data.measurement);
        setIsMeasurementModalOpen(false);
        setCartMessage({ text: 'Measurements saved successfully!', type: 'success' });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error saving measurements:', err);
      setCartMessage({ text: err.response?.data?.message || err.message || 'Failed to save measurements. Please try again.', type: 'error' });
    }
    setTimeout(() => {
      setCartMessage(null);
    }, 3000);
  };

  const openMeasurementModal = () => {
    setIsMeasurementModalOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <>
      <header className='h-16 shadow-md bg-white fixed top-0 left-0 right-0 z-30'>
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist && wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {wishlist.length}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/5 mb-8 lg:mb-0">
            <div className="relative" onMouseEnter={handleZoomToggle} onMouseLeave={handleZoomToggle} onMouseMove={handleMouseMove}>
              <img
                ref={imageRef}
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
              {isZoomed && (
                <div
                  className="absolute top-0 left-0 w-full h-full bg-no-repeat pointer-events-none"
                  style={{
                    backgroundImage: `url(${product.imageUrl})`,
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundSize: '200%',
                  }}
                />
              )}
            </div>
          </div>
          <div className="lg:w-3/5 lg:pl-12">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl text-gray-600 mb-6">{product.description}</p>
            {selectedVariation && (
              <>
                <div className="mb-6">
                  <p className="text-2xl font-semibold mb-2">₹{totalPrice.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">MRP <span className="line-through">₹{(selectedVariation.finalPrice * 1.2).toFixed(2)}</span> (20% OFF)</p>
                  {selectedVariation.grade && (
                    <p className="text-sm text-gray-600 mt-2">Grade: {selectedVariation.grade}</p>
                  )}
                  <p className="text-sm font-semibold text-gray-700 mt-2">
                    {selectedVariation.stock > 0 ? `${selectedVariation.stock} item(s) left` : 'Out of stock'}
                  </p>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <select 
                    className="w-full md:w-1/3 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={quantity}
                    onChange={handleQuantityChange}
                    disabled={isInCart}
                  >
                    {[...Array(Math.min(5, selectedVariation.stock)).keys()].map(num => (
                      <option key={num + 1} value={num + 1}>{num + 1}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-8">
                  <button 
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4"
                    onClick={openMeasurementModal}
                  >
                    {measurements ? 'Edit Measurements' : 'Add Measurements'}
                  </button>
                  {measurements && (
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold mb-1">Measurements:</p>
                      <ul className="list-disc list-inside">
                        <li>Chest: {measurements.chest} inches</li>
                        <li>Waist: {measurements.waist} inches</li>
                        <li>Hips: {measurements.hips} inches</li>
                        <li>Length: {measurements.length} inches</li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex space-x-4 mb-8">
                  <button 
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isInCart || selectedVariation.stock === 0
                        ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                        : 'bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-500'
                    }`}
                    disabled={isInCart || selectedVariation.stock === 0}
                  >
                    {selectedVariation.stock === 0 ? 'Out of Stock' : isInCart ? 'In Cart' : 'Add to Cart'}
                  </button>
                  <button 
                    className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={handleBuyNow}
                    disabled={selectedVariation.stock === 0}
                  >
                    Buy Now
                  </button>
                </div>
                <Link 
                  to={`/customize/${id}`}
                  className="w-full bg-purple-500 text-white py-3 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-center block mb-4"
                >
                  Customize This Dress
                </Link>
                <button 
                  className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleAddToWishlist}
                  disabled={isInWishlist}
                >
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </>
            )}
            <p className="text-sm text-gray-500 mt-6">
              Free shipping on all continental US orders.
            </p>
          </div>
        </div>
        {cartMessage && (
          <div className={`mt-4 p-2 rounded ${cartMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {cartMessage.text}
          </div>
        )}
        {wishlistMessage && (
          <div className={`mt-4 p-2 rounded ${wishlistMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {wishlistMessage.text}
          </div>
        )}
        {isMeasurementModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add Basic Measurements</h3>
              <div className="space-y-4">
                {Object.keys(basicMeasurements).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                      type="number"
                      name={key}
                      value={basicMeasurements[key]}
                      onChange={handleMeasurementChange}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={`Enter ${key} measurement`}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setIsMeasurementModalOpen(false)}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMeasurementSubmit}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductInfo;