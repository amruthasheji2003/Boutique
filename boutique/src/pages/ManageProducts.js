import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    subcategory: '',
    description: '',
    stock: '',
  });
  const [batchDetails, setBatchDetails] = useState({
    batchId: '',
    productDate: '',
    quantity: '',
  });
  const [editProduct, setEditProduct] = useState(null);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Define searchQuery state

  const navigate = useNavigate();

  const categories = {
    'Men\'s Wear': ['Shirts', 'Trousers', 'Suits', 'Kurta', 'Sherwani', 'Blazers'],
    'Women\'s Wear': ['Salwar Suits', 'Lehenga', 'Churidars', 'Kurtis', 'Gowns', 'Blouses', 'Frocks', 'Skirts', 'Skirt with Top'],
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editProduct) {
      setEditProduct({ ...editProduct, [name]: value });
    } else if (name in newProduct) {
      setNewProduct({ ...newProduct, [name]: value });
    } else {
      setBatchDetails({ ...batchDetails, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const uniqueBatchId = `BATCH-${Date.now()}`;
    const currentDate = new Date().toISOString().split('T')[0];

    if (newProduct.price < 0 || newProduct.stock < 0) {
      setError('Price and Stock must be non-negative numbers.');
      return;
    }

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('category', newProduct.category);
    formData.append('subcategory', newProduct.subcategory);
    formData.append('stock', newProduct.stock);
    formData.append('description', newProduct.description);
    formData.append('batchId', uniqueBatchId);
    formData.append('productDate', currentDate);
    formData.append('quantity', batchDetails.quantity);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      await axios.post('http://localhost:8080/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      resetForm();
      fetchProducts();
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding product');
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();

    if (editProduct.price < 0 || editProduct.stock < 0) {
      setError('Price and Stock must be non-negative numbers.');
      return;
    }

    const formData = new FormData();
    formData.append('name', editProduct.name);
    formData.append('price', editProduct.price);
    formData.append('category', editProduct.category);
    formData.append('subcategory', editProduct.subcategory);
    formData.append('stock', editProduct.stock);
    formData.append('description', editProduct.description);
    formData.append('batchId', batchDetails.batchId);
    formData.append('productDate', batchDetails.productDate);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      await axios.put(`http://localhost:8080/api/products/${editProduct._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      resetForm();
      fetchProducts();
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating product');
    }
  };

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

  const resetForm = () => {
    setNewProduct({ name: '', price: '', category: '', subcategory: '', description: '', stock: '' });
    setBatchDetails({ batchId: '', productDate: '', quantity: '' });
    setEditProduct(null);
    setSelectedImage(null);
    setPreviewImage(null);
    setError('');
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-3xl font-bold mb-6">Manage Products</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Add/Edit Form */}
      <div className="bg-gray-100 p-6 mb-6 rounded shadow-lg">
        <h2 className="text-2xl mb-4">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={editProduct ? handleEditProduct : handleAddProduct} encType="multipart/form-data" className="space-y-4">
          {/* Form Fields */}
          <input type="text" name="name" value={editProduct ? editProduct.name : newProduct.name} onChange={handleInputChange} placeholder="Product Name" required className="block w-full p-3 border border-gray-300 rounded" />
          <input type="number" name="price" value={editProduct ? editProduct.price : newProduct.price} onChange={handleInputChange} placeholder="Price" required className="block w-full p-3 border border-gray-300 rounded" min="0" />
          <select name="category" value={editProduct ? editProduct.category : newProduct.category} onChange={handleInputChange} required className="block w-full p-3 border border-gray-300 rounded">
            <option value="">Select Category</option>
            {Object.keys(categories).map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select name="subcategory" value={editProduct ? editProduct.subcategory : newProduct.subcategory} onChange={handleInputChange} required className="block w-full p-3 border border-gray-300 rounded">
            <option value="">Select Subcategory</option>
            {(categories[newProduct.category] || []).map((subcategory) => (
              <option key={subcategory} value={subcategory}>{subcategory}</option>
            ))}
          </select>
          <input type="number" name="stock" value={editProduct ? editProduct.stock : newProduct.stock} onChange={handleInputChange} placeholder="Stock" required className="block w-full p-3 border border-gray-300 rounded" min="0" />
          <textarea name="description" value={editProduct ? editProduct.description : newProduct.description} onChange={handleInputChange} placeholder="Description" required className="block w-full p-3 border border-gray-300 rounded"></textarea>

          {/* Batch Details */}
          <h3 className="text-lg font-bold">Batch Details</h3>
          <input type="text" name="batchId" value={editProduct ? batchDetails.batchId : `BATCH-${Date.now()}`} readOnly className="block w-full p-3 border border-gray-300 rounded bg-gray-100" />
          <input type="date" name="productDate" value={batchDetails.productDate} onChange={handleInputChange} required className="block w-full p-3 border border-gray-300 rounded" />
          <input type="number" name="quantity" value={batchDetails.quantity} onChange={handleInputChange} placeholder="Batch Quantity" required className="block w-full p-3 border border-gray-300 rounded" min="0" />

          {/* Image Upload */}
          <input type="file" onChange={handleImageChange} className="block w-full p-3 border border-gray-300 rounded" />
          {previewImage && <img src={previewImage} alt="Preview" className="mt-4 h-32 w-32 object-cover rounded" />}

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {editProduct ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 border border-gray-300 rounded w-full max-w-lg"
        />
      </div>

      {/* Display Products in Grid */}
      {loading ? (
        <p>Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
{filteredProducts.map((product) => (
  <div key={product._id} className="bg-white p-4 rounded-lg shadow-lg">
    <img
      src={`http://localhost:8080/${product.image}`}
      alt={product.name}
      className="w-full h-48 object-contain mb-4 rounded"
    />
    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
    <p className="text-sm text-gray-600">Rs.{product.price}</p>
    <p className="text-sm text-gray-600">Category: {product.category}</p>
    <p className="text-sm text-gray-600">Stock: {product.stock}</p>
    <p className="text-sm text-gray-600">{product.description}</p> {/* Add this line for description */}
    <button
      onClick={() => setEditProduct(product)}
      className="bg-blue-500 text-white px-3 py-1 rounded mt-4 hover:bg-blue-600"
    >
      Edit
    </button>
    <button
      onClick={() => handleDeleteProduct(product._id)}
      className="bg-red-500 text-white px-3 py-1 rounded mt-4 ml-2 hover:bg-red-600"
    >
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
