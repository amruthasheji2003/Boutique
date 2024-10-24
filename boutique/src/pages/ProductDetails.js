import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!product) return <div className="text-center mt-8">Product not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/admin/view-products" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">
        &larr; Back to Products
      </Link>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-64 w-full object-cover md:w-64" src={product.imageUrl} alt={product.name} />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{product.productId}</div>
            <h2 className="block mt-1 text-2xl leading-tight font-bold text-black">{product.name}</h2>
            <p className="mt-2 text-gray-500">{product.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <p className="text-gray-700"><strong>Category:</strong> {product.category.name}</p>
              <p className="text-gray-700"><strong>Subcategory:</strong> {product.subcategory.name}</p>
              <p className="text-gray-700"><strong>Total Stock:</strong> {product.totalStock}</p>
              {product.batchesCount > 1 ? (
                <>
                  <p className="text-gray-700"><strong>Average Price:</strong> ₹{parseFloat(product.averagePrice).toFixed(2)}</p>
                  <p className="text-gray-700"><strong>Price Range:</strong> ₹{product.priceRange.min.toFixed(2)} - ₹{product.priceRange.max.toFixed(2)}</p>
                </>
              ) : (
                <p className="text-gray-700"><strong>Price:</strong> ₹{product.latestBatch.finalPrice.toFixed(2)}</p>
              )}
              <p className="text-gray-700"><strong>Number of Batches:</strong> {product.batchesCount}</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <h3 className="text-xl font-semibold mb-4">Batch Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.batches.map((batch, index) => (
              <div key={batch.batchId} className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Batch {index + 1}</h4>
                <p><strong>Batch ID:</strong> {batch.batchId}</p>
                <p><strong>Production Date:</strong> {new Date(batch.productionDate).toLocaleDateString()}</p>
                <p><strong>Grade:</strong> {batch.grade}</p>
                <p><strong>Price:</strong> ₹{batch.finalPrice.toFixed(2)}</p>
                <p><strong>Stock:</strong> {batch.stock}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;