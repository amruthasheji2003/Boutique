import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', description: '', stock: '' });
  const [editProduct, setEditProduct] = useState(null);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch products from the backend
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

  // Handle input change for both adding and editing products
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editProduct) {
      setEditProduct({ ...editProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Handle adding new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('category', newProduct.category);
    formData.append('stock', newProduct.stock);
    formData.append('description', newProduct.description);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      await axios.post('http://localhost:8080/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNewProduct({ name: '', price: '', category: '', description: '', stock: '' });
      setSelectedImage(null);
      setPreviewImage(null);
      fetchProducts();
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding product');
    }
  };

  // Handle editing product
  const handleEditProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editProduct.name);
    formData.append('price', editProduct.price);
    formData.append('category', editProduct.category);
    formData.append('stock', editProduct.stock);
    formData.append('description', editProduct.description);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      await axios.put(`http://localhost:8080/api/products/${editProduct._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setEditProduct(null);
      setSelectedImage(null);
      setPreviewImage(null);
      fetchProducts();
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating product');
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:8080/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        setError('Error deleting product');
      }
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-4">Manage Products</h1>

      {/* Error display */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Add or Edit Product Form */}
      <div className="bg-gray-100 p-4 mb-4 rounded shadow">
        <h2 className="text-xl">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={editProduct ? handleEditProduct : handleAddProduct} encType="multipart/form-data">
          <input
            type="text"
            name="name"
            value={editProduct ? editProduct.name : newProduct.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            required
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="price"
            value={editProduct ? editProduct.price : newProduct.price}
            onChange={handleInputChange}
            placeholder="Price"
            required
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="category"
            value={editProduct ? editProduct.category : newProduct.category}
            onChange={handleInputChange}
            placeholder="Category"
            required
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="stock"
            value={editProduct ? editProduct.stock : newProduct.stock}
            onChange={handleInputChange}
            placeholder="Stock"
            required
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <textarea
            name="description"
            value={editProduct ? editProduct.description : newProduct.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
            className="block w-full mb-2 p-2 border border-gray-300 rounded resize-none h-20"
          />
          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          {previewImage && (
            <img src={previewImage} alt="Preview" className="w-1/2 h-auto object-contain mb-2" />
          )}
          <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">
            {editProduct ? 'Update Product' : 'Add Product'}
          </button>
          {editProduct && (
            <button type="button" onClick={() => { setEditProduct(null); setPreviewImage(null); }} className="bg-red-500 text-white p-2 rounded w-full mt-2">
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Search Products */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products by name or category..."
        className="block w-full p-2 border border-gray-300 rounded mb-4"
      />

      {/* Display Products */}
      {loading ? (
        <p>Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products available</p>
      ) : (
        <div className="mt-4">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-gray-200 p-4 mb-2 rounded shadow">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Category: {product.category}</p>
              <p>Stock: {product.stock}</p>
              <p>{product.description}</p>
              {product.image && (
                <img 
                  src={`http://localhost:8080/${product.image}`} 
                  alt={product.name} 
                  className="max-w-[200px] h-auto object-contain mb-2 rounded" 
                />
              )}
              <button onClick={() => setEditProduct(product)} className="bg-blue-500 text-white p-1 rounded mr-2">
                Edit
              </button>
              <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-500 text-white p-1 rounded">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
