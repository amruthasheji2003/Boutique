import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
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
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  // Fetch products and categories when the component mounts
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      console.log(response.data); // Log the response
      setProducts(response.data);
    } catch (error) {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };
  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/categories');
      setCategories(response.data);
    } catch (error) {
      setError('Error fetching categories');
    }
  };

  // Fetch subcategories based on selected category
  const fetchSubcategories = async (category) => {
    if (!category) {
      setSubcategories([]); // Clear subcategories if no category is selected
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/subcategories/${category}`);
      setSubcategories(response.data);
    } catch (error) {
      setError('Error fetching subcategories');
    }
  };

  // Handle input change for form
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (editProduct) {
      setEditProduct((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewProduct((prev) => {
        const updatedProduct = { ...prev, [name]: value };
        if (name === 'category') {
          fetchSubcategories(value); // Fetch subcategories based on the selected category
          updatedProduct.subcategory = ''; // Reset subcategory when category changes
        }
        return updatedProduct;
      });
    }
  };

  // Handle batch input changes
  const handleBatchInputChange = (e) => {
    const { name, value } = e.target;
    setBatchDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle adding a new product
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

  // Handle editing an existing product
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

  // Reset form inputs
  const resetForm = () => {
    setNewProduct({ name: '', price: '', category: '', subcategory: '', description: '', stock: '' });
    setBatchDetails({ batchId: '', productDate: '', quantity: '' });
    setEditProduct(null);
    setSelectedImage(null);
    setPreviewImage(null);
    setError('');
    setSubcategories([]); // Clear subcategories when resetting
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state indicator
  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-3xl font-bold mb-6">Manage Products</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Add/Edit Form */}
      <div className="bg-gray-100 p-6 mb-6 rounded shadow-lg">
        <h2 className="text-2xl mb-4">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={editProduct ? handleEditProduct : handleAddProduct} encType="multipart/form-data" className="space-y-4">
          {/* Form Fields */}
          <input
            type="text"
            name="name"
            value={editProduct ? editProduct.name : newProduct.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            required
            className="block w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="price"
            value={editProduct ? editProduct.price : newProduct.price}
            onChange={handleInputChange}
            placeholder="Price"
            required
            className="block w-full p-3 border border-gray-300 rounded"
            min="0"
          />
          <select
            name="category"
            value={editProduct ? editProduct.category : newProduct.category}
            onChange={handleInputChange}
            required
            className="block w-full p-3 border border-gray-300 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          <select
            name="subcategory"
            value={editProduct ? editProduct.subcategory : newProduct.subcategory}
            onChange={handleInputChange}
            required
            className="block w-full p-3 border border-gray-300 rounded"
            disabled={!subcategories.length}
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
            ))}
          </select>
          <textarea
            name="description"
            value={editProduct ? editProduct.description : newProduct.description}
            onChange={handleInputChange}
            placeholder="Product Description"
            className="block w-full p-3 border border-gray-300 rounded"
          />

          <input
            type="number"
            name="stock"
            value={editProduct ? editProduct.stock : newProduct.stock}
            onChange={handleInputChange}
            placeholder="Stock Quantity"
            required
            className="block w-full p-3 border border-gray-300 rounded"
            min="0"
          />

          {/* Batch Details */}
          <input
            type="text"
            name="batchId"
            value={batchDetails.batchId}
            onChange={handleBatchInputChange}
            placeholder="Batch ID (auto-generated)"
            disabled
            className="block w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="date"
            name="productDate"
            value={batchDetails.productDate}
            onChange={handleBatchInputChange}
            placeholder="Product Date"
            required
            className="block w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="quantity"
            value={batchDetails.quantity}
            onChange={handleBatchInputChange}
            placeholder="Batch Quantity"
            required
            className="block w-full p-3 border border-gray-300 rounded"
            min="0"
          />

          {/* Image Upload */}
          <div>
            <input type="file" onChange={handleImageChange} className="mb-4" />
            {previewImage && <img src={previewImage} alt="Preview" className="w-24 h-24 object-cover rounded" />}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-700 transition"
          >
            {editProduct ? 'Update Product' : 'Add Product'}
          </button>

          {/* Cancel Button */}
          {editProduct && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-4 bg-gray-500 text-white py-3 px-6 rounded hover:bg-gray-700 transition"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Product List */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by product name or category"
          className="block w-full p-3 mb-6 border border-gray-300 rounded"
        />

        <table className="table-auto w-full bg-white rounded shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Subcategory</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">{product.category}</td>
                <td className="border px-4 py-2">{product.subcategory}</td>
                <td className="border px-4 py-2">{product.price}</td>
                <td className="border px-4 py-2">{product.stock}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => {
                      setEditProduct(product);
                      setBatchDetails({
                        batchId: product.batchId,
                        productDate: product.productDate,
                        quantity: product.quantity,
                      });
                      setPreviewImage(product.image);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
