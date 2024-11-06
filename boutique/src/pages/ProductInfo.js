import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://boutique-backend-j6re.onrender.com';

const ProductInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(() => {
    const saved = localStorage.getItem(`selectedBatch_${id}`);
    return saved ? JSON.parse(saved) : null;
  });
  const [quantity, setQuantity] = useState(() => {
    const saved = localStorage.getItem(`quantity_${id}`);
    return saved ? parseInt(saved) : 1;
  });
  const [measurements, setMeasurements] = useState(() => {
    const saved = localStorage.getItem(`measurements_${id}`);
    return saved ? JSON.parse(saved) : null;
  });
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [cartMessage, setCartMessage] = useState(null);
  const [wishlistMessage, setWishlistMessage] = useState(null);
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [basicMeasurements, setBasicMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
    length: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
        
        if (selectedBatch) {
          const foundBatch = response.data.batches.find(b => b.batchId === selectedBatch.batchId);
          if (foundBatch) {
            setSelectedBatch(foundBatch);
          } else {
            setSelectedBatch(null);
            localStorage.removeItem(`selectedBatch_${id}`);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error fetching product details. Please try again.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, selectedBatch]);

  useEffect(() => {
    if (selectedBatch) {
      localStorage.setItem(`selectedBatch_${id}`, JSON.stringify(selectedBatch));
    }
  }, [selectedBatch, id]);

  useEffect(() => {
    localStorage.setItem(`quantity_${id}`, quantity.toString());
  }, [quantity, id]);

  useEffect(() => {
    if (measurements) {
      localStorage.setItem(`measurements_${id}`, JSON.stringify(measurements));
    }
  }, [measurements, id]);

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
    if (!selectedBatch) {
      setCartMessage({ text: 'Please select a batch before adding to cart.', type: 'error' });
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
        batchId: selectedBatch.batchId,
        quantity: quantity,
        measurements: measurements
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data && response.data.cart) {
        setCartMessage({ text: `${product.name} added to cart successfully!`, type: 'success' });
        // Clear local storage after successful add to cart
        localStorage.removeItem(`selectedBatch_${id}`);
        localStorage.removeItem(`quantity_${id}`);
        localStorage.removeItem(`measurements_${id}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setCartMessage({ text: err.response?.data?.message || err.message || 'Failed to add item to cart. Please try again.', type: 'error' });
    }
    setTimeout(() => {
      setCartMessage(null);
    }, 3000);
  };

  const handleAddToWishlist = async () => {
    if (!selectedBatch) {
      setWishlistMessage({ text: 'Please select a batch before adding to wishlist.', type: 'error' });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setWishlistMessage({ text: 'Please log in to add items to wishlist.', type: 'error' });
        return;
      }
  
      const response = await axios.post(`${API_URL}/api/wishlist/add`, {
        productId: product._id,
        batchId: selectedBatch.batchId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data && response.data.wishlist) {
        setWishlistMessage({ text: `${product.name} added to wishlist successfully!`, type: 'success' });
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
    setBasicMeasurements({
      ...basicMeasurements,
      [e.target.name]: e.target.value,
    });
  };

  const handleMeasurementSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setWishlistMessage({ text: 'Please log in to add measurements.', type: 'error' });
        return;
      }
  
      const response = await axios.post(`${API_URL}/api/measurements/add`, {
        productId: product._id,
        ...basicMeasurements
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data && response.data.measurement) {
        setMeasurements(response.data.measurement);
        setIsMeasurementModalOpen(false);
        setWishlistMessage({ text: 'Measurements added successfully!', type: 'success' });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error adding measurements:', err);
      setWishlistMessage({ text: err.response?.data?.message || err.message || 'Failed to add measurements. Please try again.', type: 'error' });
    }
    setTimeout(() => {
      setWishlistMessage(null);
    }, 3000);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

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
              src={product.imageUrl} 
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
          <p className="text-sm text-gray-500 mb-4">{product.category?.name} &gt; {product.subcategory?.name}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
            <select 
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedBatch ? selectedBatch.batchId : ''}
              onChange={(e) => setSelectedBatch(product.batches.find(b => b.batchId === e.target.value))}
            >
              <option value="">Select a batch</option>
              {product.batches.map((batch) => (
                <option key={batch.batchId} value={batch.batchId}>
                  Grade {batch.grade} - ₹{batch.finalPrice} (Stock: {batch.stock})
                </option>
              ))}
            </select>
          </div>

          {selectedBatch && (
            <>
              <div className="mb-6">
                <p className="text-lg font-semibold">Price: ₹{(selectedBatch.finalPrice * quantity).toFixed(2)}</p>
                <p className="text-sm text-gray-600">Grade: {selectedBatch.grade}</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <select 
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                >
                  {[...Array(Math.min(5, selectedBatch.stock)).keys()].map(num => (
                    <option key={num + 1} value={num + 1}>{num + 1}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Measurements</label>
                <button 
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setIsMeasurementModalOpen(true)}
                >
                  {measurements ? 'Edit Measurements' : 'Add Measurements'}
                </button>
                {measurements && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Measurements added:</p>
                    <ul className="list-disc list-inside">
                      <li>Chest: {measurements.chest} inches</li>
                      <li>Waist: {measurements.waist} inches</li>
                      <li>Hips: {measurements.hips} inches</li>
                      <li>Length: {measurements.length} inches</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex space-x-4 mb-6">
                <button 
                  className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleAddToCart}
                  disabled={selectedBatch.stock === 0}
                >
                  {selectedBatch.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button 
                  className="flex-1 bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleBuyNow}
                  disabled={selectedBatch.stock === 0}
                >
                  Buy Now
                </button>
                <button 
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  onClick={handleAddToWishlist}
                >
                  Add to Wishlist
                </button>
              </div>
            </>
          )}
          
          <p className="text-sm text-gray-500 mb-2">
            Free shipping on all continental US orders.
          </p>
          {selectedBatch && (
            <p className="text-sm font-semibold text-gray-700">
              {selectedBatch.stock > 0 ? `${selectedBatch.stock} item(s) left` : 'Out of stock'}
            </p>
          )}
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
  );
};

export default ProductInfo;