import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://boutique-backend-j6re.onrender.com'; // Adjust this to match your backend URL

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product. Please try again.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setProduct(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleBatchChange = (index, e) => {
    const { name, value } = e.target;
    setProduct(prev => {
      const updatedBatches = [...prev.batches];
      updatedBatches[index] = { 
        ...updatedBatches[index], 
        [name]: name === 'stock' ? parseInt(value, 10) : value 
      };
      return { ...prev, batches: updatedBatches };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    Object.keys(product).forEach(key => {
      if (key !== 'image' && key !== 'batches' && key !== 'category' && key !== 'subcategory') {
        formData.append(key, product[key]);
      }
    });

    if (product.image instanceof File) {
      formData.append('image', product.image);
    }

    formData.append('batches', JSON.stringify(product.batches));

    try {
      await axios.put(`${API_URL}/api/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/admin/view-products');
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Product ID</label>
          <input
            type="text"
            id="productId"
            name="productId"
            value={product.productId}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={product.category.name}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            readOnly
          />
        </div>
        <div>
          <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">Subcategory</label>
          <input
            type="text"
            id="subcategory"
            name="subcategory"
            value={product.subcategory.name}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            readOnly
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            className="mt-1 block w-full"
          />
        </div>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Batches</h2>
        {product.batches.map((batch, index) => (
          <div key={index} className="border p-4 rounded-md">
            <h3 className="font-medium mb-2">Batch {index + 1}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={`batchId-${index}`} className="block text-sm font-medium text-gray-700">Batch ID</label>
                <input
                  type="text"
                  id={`batchId-${index}`}
                  name="batchId"
                  value={batch.batchId}
                  onChange={(e) => handleBatchChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label htmlFor={`productionDate-${index}`} className="block text-sm font-medium text-gray-700">Production Date</label>
                <input
                  type="date"
                  id={`productionDate-${index}`}
                  name="productionDate"
                  value={batch.productionDate.split('T')[0]}
                  onChange={(e) => handleBatchChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label htmlFor={`grade-${index}`} className="block text-sm font-medium text-gray-700">Grade</label>
                <input
                  type="text"
                  id={`grade-${index}`}
                  name="grade"
                  value={batch.grade}
                  onChange={(e) => handleBatchChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label htmlFor={`actualPrice-${index}`} className="block text-sm font-medium text-gray-700">Actual Price</label>
                <input
                  type="number"
                  id={`actualPrice-${index}`}
                  name="actualPrice"
                  value={batch.actualPrice}
                  onChange={(e) => handleBatchChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label htmlFor={`finalPrice-${index}`} className="block text-sm font-medium text-gray-700">Final Price</label>
                <input
                  type="number"
                  id={`finalPrice-${index}`}
                  name="finalPrice"
                  value={batch.finalPrice}
                  onChange={(e) => handleBatchChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label htmlFor={`stock-${index}`} className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  id={`stock-${index}`}
                  name="stock"
                  value={batch.stock}
                  onChange={(e) => handleBatchChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
            </div>
          </div>
        ))}
        
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;