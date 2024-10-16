import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';

const BrowseCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const navigate = useNavigate();

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/categories');
      setCategories(response.data);
    } catch (error) {
      setError('Error fetching categories');
    }
  };

  // Fetch products with query parameters
  const fetchProducts = async (category = '', subcategory = '', query = '') => {
    setLoading(true);
    try {
      let url = `http://localhost:8080/api/products?`;
      // if (category) url += `category=${category}&`;
      // if (subcategory) url += `subcategory=${subcategory}&`;
      if (query) url += `search=${query}`;
      
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Update subcategories when category is selected
  useEffect(() => {
    const selectedCat = categories.find(cat => cat.name === selectedCategory);
    setSubcategories(selectedCat ? selectedCat.subcategories : []);
    setSelectedSubcategory('');
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  // Update products based on subcategory selection
  useEffect(() => {
    fetchProducts(selectedCategory, selectedSubcategory);
  }, [selectedSubcategory]);

  // Filter products based on search query
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    fetchProducts(selectedCategory, selectedSubcategory, query);
  };

  // Wishlist toggle function
  const toggleWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(productId)
        ? prevWishlist.filter((id) => id !== productId)
        : [...prevWishlist, productId]
    );
  };

  // Handle category change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Handle subcategory change
  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
  };

  // Handle product click to view details
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  // Navigate back
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-start mb-6">
        <button
          onClick={handleBackClick}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Back
        </button>
      </div>

      <h1 className="text-4xl font-bold text-center mb-6">Browse Catalog</h1>

      <div className="mb-6 flex justify-center space-x-4">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        {subcategories.length > 0 && (
          <select
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        )}
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search products by name..."
        className="block w-full p-2 border border-gray-300 rounded-lg mb-6"
      />

      {loading ? (
        <div className="text-center">Loading products...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <p className="text-center col-span-full">No products available</p>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="catalog-item bg-white shadow-lg p-4 rounded-lg relative flex flex-col items-center"
                onClick={() => handleProductClick(product)}
              >
                <div className="absolute top-2 right-2 flex space-x-2">
                  <FaHeart
                    className={`cursor-pointer text-2xl ${
                      wishlist.includes(product._id) ? 'text-red-600' : 'text-gray-500'
                    } hover:text-red-600`}
                    title="Add to Wishlist"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product._id);
                    }}
                  />
                  <FaShoppingCart
                    className="text-blue-500 hover:text-blue-600 cursor-pointer text-2xl"
                    title="Add to Cart"
                  />
                </div>

                <img
                  src={`http://localhost:8080/${product.image}`}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-2"
                />
                <h2 className="text-xl font-semibold mb-2 text-center">{product.name}</h2>
                <p className="text-lg text-gray-600 mb-2">Rs.{product.price}</p>
                <p className="text-sm text-gray-600 mb-2">Category: {product.category}</p>
                <p className="text-sm text-gray-600 mb-2">Stock: {product.stock}</p>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              </div>
            ))
          )}
        </div>
      )}

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
              <p className="text-lg text-gray-600">Category: {selectedProduct.category}</p>
              <p className="text-lg text-gray-600">Stock: {selectedProduct.stock}</p>
              <p className="text-lg text-gray-600">{selectedProduct.description}</p>

              <div className="mt-6 space-x-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Add to Cart
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
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
