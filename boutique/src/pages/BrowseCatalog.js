import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // If using react-router
import { FaShoppingCart, FaHeart } from 'react-icons/fa'; // Icons for Cart and Wishlist

const BrowseCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product
  const [wishlist, setWishlist] = useState([]); // State for wishlist

  const navigate = useNavigate(); // Hook for navigation

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      setProducts(response.data);
    } catch (error) {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle product click
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  // Toggle wishlist function
  const toggleWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(productId)
        ? prevWishlist.filter((id) => id !== productId) // Remove from wishlist
        : [...prevWishlist, productId] // Add to wishlist
    );
  };

  // Back button handler
  const handleBackClick = () => {
    navigate(-1); // Use React Router's navigate to go back
  };

  return (
    <div className="container mx-auto p-6">
      {/* Back Button as Header */}
      <div className="flex justify-start mb-6">
        <button
          onClick={handleBackClick}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Back
        </button>
      </div>

      <h1 className="text-4xl font-bold text-center mb-6">Browse Catalog</h1>

      {/* Search Products */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products by name or category..."
        className="block w-full p-2 border border-gray-300 rounded-lg mb-6"
      />

      {/* Loading or Error Handling */}
      {loading ? (
        <div className="text-center">Loading products...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <p className="text-center col-span-full">No products available</p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="catalog-item bg-white shadow-lg p-4 rounded-lg relative flex flex-col items-center"
                onClick={() => handleProductClick(product)} // Click to view details
              >
                {/* Icons for Cart and Wishlist */}
                <div className="absolute top-2 right-2 flex space-x-2">
                  {/* Wishlist Icon */}
                  <FaHeart
                    className={`cursor-pointer text-2xl ${
                      wishlist.includes(product._id) ? 'text-red-600' : 'text-gray-500'
                    } hover:text-red-600`}
                    title="Add to Wishlist"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents triggering the product click event
                      toggleWishlist(product._id);
                    }}
                  />
                  {/* Cart Icon */}
                  <FaShoppingCart
                    className="text-blue-500 hover:text-blue-600 cursor-pointer text-2xl"
                    title="Add to Cart"
                  />
                </div>
                
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={`http://localhost:8080/${product.image}`}
                    alt={product.name}
                    className="w-full h-40 object-cover mb-2"
                  />
                </div>
                
                {/* Product Details */}
                <h2 className="text-xl font-semibold mb-2 text-center">{product.name}</h2>
                <p className="text-lg text-gray-600 mb-2">Rs.{product.price}</p>
                <p className="text-sm text-gray-600 mb-2">Category:{product.category}</p>
                <p className="text-sm text-gray-600 mb-2">Stock: {product.stock}</p>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>

              </div>
            ))
          )}
        </div>
      )}

      {/* Product Details Section */}
      {selectedProduct && (
        <div className="mt-8 p-6 border border-gray-300 rounded-lg bg-white">
          <h2 className="text-3xl font-bold mb-4">Product Details</h2>
          <div className="flex">
            <div className="w-1/2 pr-4">
              <img
                src={`http://localhost:8080/${selectedProduct.image}`}
                alt={selectedProduct.name}
                className="w-full h-auto object-contain max-h-96"
              />
            </div>
            <div className="w-1/2">
              <h3 className="text-2xl font-semibold">{selectedProduct.name}</h3>
              <p className="text-lg text-gray-600">Rs.{selectedProduct.price}</p>
              <p className="text-lg text-gray-600"> {selectedProduct.category}</p>
              <p className="text-lg text-gray-600">Stock: {selectedProduct.stock}</p>
              <p className="text-lg text-gray-600">{selectedProduct.description}</p>

              {/* Buttons in the product details section */}
              <div className="mt-6 space-x-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Add to Cart
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseCatalog;
