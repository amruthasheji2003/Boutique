import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8080'

const ManageProducts = () => {
  const [productData, setProductData] = useState({
    productId: '',
    productName: '',
    category: '',
    subcategory: '',
    description: '',
    image: null
  });

  const [batchData, setBatchData] = useState({
    grade: '',
    batchId: '',
    productionDate: '',
    actualPrice: '',
    finalPrice: '',
    stock: '',
  });

  const [batches, setBatches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [submitStatus, setSubmitStatus] = useState('');

  useEffect(() => {
    fetchCategories();
    generateProductId();
    generateBatchId();
  }, []);

  useEffect(() => {
    if (productData.category) {
      fetchSubcategories(productData.category);
    } else {
      setSubcategories([]);
    }
  }, [productData.category]);

  const generateProductId = () => {
    const newProductId = 'PROD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setProductData(prevData => ({ ...prevData, productId: newProductId }));
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(`${API_URL}/api/subcategories/${categoryId}`);
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleProductChange = (e) => {
    const { name, value, type } = e.target;
    setProductData(prevData => ({
      ...prevData,
      [name]: type === 'file' ? e.target.files[0] : value,
    }));
  };

  const handleBatchChange = (e) => {
    const { name, value } = e.target;
    setBatchData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const calculateFinalPrice = () => {
    const actualPrice = parseFloat(batchData.actualPrice);
    if (isNaN(actualPrice)) return;

    let finalPrice;
    switch (batchData.grade) {
      case 'A':
        finalPrice = actualPrice;
        break;
      case 'B':
        finalPrice = actualPrice * 0.8; // 20% discount
        break;
      case 'C':
        finalPrice = actualPrice * 0.7; // 30% discount
        break;
      default:
        finalPrice = actualPrice;
    }

    setBatchData(prevData => ({
      ...prevData,
      finalPrice: finalPrice.toFixed(2)
    }));
  };

  useEffect(() => {
    calculateFinalPrice();
  }, [batchData.grade, batchData.actualPrice]);

  const generateBatchId = () => {
    const newBatchId = 'BATCH-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setBatchData(prevData => ({ ...prevData, batchId: newBatchId }));
  };

  const addBatch = () => {
    if (batchData.grade && batchData.batchId && batchData.productionDate && batchData.actualPrice) {
      setBatches(prevBatches => [...prevBatches, { ...batchData }]);
      setBatchData({
        grade: '',
        batchId: '',
        productionDate: '',
        actualPrice: '',
        finalPrice: '',
        stock: '',
      });
      generateBatchId();
    } else {
      alert('Please fill all batch fields');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (batches.length === 0) {
      alert('Please add at least one batch');
      return;
    }
    setSubmitStatus('Submitting...');

    try {
      const formData = new FormData();

      Object.keys(productData).forEach(key => {
        if (key === 'image') {
          if (productData.image) {
            formData.append('image', productData.image, productData.image.name);
          }
        } else {
          formData.append(key, productData[key]);
        }
      });

      formData.append('batches', JSON.stringify(batches));

      const response = await axios.post(`${API_URL}/api/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Product added successfully:', response.data);
      setSubmitStatus('Product added successfully!');

      // Reset the form
      setProductData({
        productId: '',
        productName: '',
        category: '',
        subcategory: '',
        description: '',
        image: null
      });
      setBatches([]);
      generateProductId();

    } catch (error) {
      console.error('Error adding product:', error);
      setSubmitStatus('Error adding product. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Products</h2>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <form onSubmit={handleSubmit}>
          {/* Product fields */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productId">
              Product ID:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
              type="text"
              id="productId"
              name="productId"
              value={productData.productId}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">
              Product Name:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="productName"
              name="productName"
              value={productData.productName}
              onChange={handleProductChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category:
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
              name="category"
              value={productData.category}
              onChange={handleProductChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subcategory">
              Subcategory:
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="subcategory"
              name="subcategory"
              value={productData.subcategory}
              onChange={handleProductChange}
              required
              disabled={!productData.category}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              value={productData.description}
              onChange={handleProductChange}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Image:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="file"
              id="image"
              name="image"
              onChange={handleProductChange}
              required
            />
          </div>
          
          {/* Batch fields */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Add Batch</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="grade">
                  Grade:
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="grade"
                  name="grade"
                  value={batchData.grade}
                  onChange={handleBatchChange}
                >
                  <option value="">Select Grade</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="batchId">
                  Batch ID:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                  type="text"
                  id="batchId"
                  name="batchId"
                  value={batchData.batchId}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productionDate">
                  Production Date:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="date"
                  id="productionDate"
                  name="productionDate"
                  value={batchData.productionDate}
                  onChange={handleBatchChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="actualPrice">
                  Actual Price:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="number"
                  id="actualPrice"
                  name="actualPrice"
                  value={batchData.actualPrice}
                  onChange={handleBatchChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="finalPrice">
                  Final Price:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                  type="text"
                  id="finalPrice"
                  name="finalPrice"
                  value={batchData.finalPrice}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                  Stock:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="number"
                  id="stock"
                  name="stock"
                  value={batchData.stock}
                  onChange={handleBatchChange}
                  
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addBatch}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Batch
            </button>
          </div>

          {/* Display added batches */}
          {batches.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Added Batches</h3>
              <ul>
                {batches.map((batch, index) => (
                  <li key={index} className="mb-2">
                    Grade: {batch.grade}, Batch ID: {batch.batchId}, Production Date: {batch.productionDate}, 
                    Actual Price: {batch.actualPrice}, Final Price: {batch.finalPrice}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Complete Upload
          </button>
        </form>
        {submitStatus && (
          <p className={`mt-4 text-center ${submitStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {submitStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
