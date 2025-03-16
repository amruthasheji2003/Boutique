// boutique/src/components/ProductRecommendations.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { findKNearestNeighbors } from '../utils/recommendationUtils'; // Ensure this path is correct

const API_URL = 'http://localhost:8080';

const ProductRecommendations = ({ currentProduct }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Fetch all products for recommendations
        const allProductsResponse = await axios.get(`${API_URL}/api/products`);
        const allProducts = allProductsResponse.data;

        // Filter products based on the same category and subcategory
        const filteredProducts = allProducts.filter(product => 
          product.category.toString() === currentProduct.category.toString() && // Match category
          product.subcategory.toString() === currentProduct.subcategory.toString() // Match subcategory
        );

        // Get recommendations based on the current product using KNN
        const similarProducts = findKNearestNeighbors(currentProduct, filteredProducts, 4);
        setRecommendations(similarProducts);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Error fetching recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProduct]);

  if (loading) return <div className="text-center py-8">Loading recommendations...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mt-8">Recommended Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {recommendations.length > 0 ? (
          recommendations.map(recProduct => (
            <div key={recProduct._id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <img src={`${API_URL}/${recProduct.image}`} alt={recProduct.name} className="w-full h-48 object-cover" />
              <h3 className="p-4 text-lg font-medium">{recProduct.name}</h3>
              <p className="p-4 text-gray-700">Price: ₹{recProduct.batches[0].finalPrice}</p> {/* Assuming finalPrice is in batches */}
              <button 
                onClick={() => window.location.href = `/product-info/${recProduct._id}`} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No recommendations available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductRecommendations;