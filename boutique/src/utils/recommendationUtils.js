// boutique/src/utils/recommendationUtils.js

// Calculate similarity score between two products
const calculateDistance = (product1, product2) => {
    try {
      // Check if products are in the same category and subcategory
      if (product1.category.toString() !== product2.category.toString() || 
          product1.subcategory.toString() !== product2.subcategory.toString()) {
        return Infinity; // Different categories/subcategories should not be recommended
      }
  
      // Normalize price difference (0-1 scale)
      const priceScore = Math.abs(
        Number(product1.batches[0].finalPrice) - Number(product2.batches[0].finalPrice)
      ) / Math.max(Number(product1.batches[0].finalPrice), Number(product2.batches[0].finalPrice) || 1); // Avoid division by zero
  
      // Calculate discount similarity
      const discountScore = Math.abs(
        Number(product1.batches[0].discount) - Number(product2.batches[0].discount)
      ) / 100; // Assuming discount is a percentage
  
      // Calculate weighted distance (lower is better)
      const distance = (
        (priceScore * 0.7) +          // Price similarity: 70%
        (discountScore * 0.3)         // Discount similarity: 30%
      );
  
      return distance; // Return the calculated distance
    } catch (error) {
      console.error('Error calculating distance:', error);
      return Infinity; // Return a high value in case of error
    }
  };
  
  // Find K nearest neighbors within the same category and subcategory
  const findKNearestNeighbors = (currentProduct, allProducts, k = 4) => {
    try {
      // Filter products to only include those in the same category and subcategory
      const candidates = allProducts.filter(p => 
        p.category.toString() === currentProduct.category.toString() && 
        p.subcategory.toString() === currentProduct.subcategory.toString()
      );
  
      if (candidates.length === 0) {
        console.log('No candidates found for category and subcategory:', {
          category: currentProduct.category,
          subcategory: currentProduct.subcategory
        });
        return []; // Return empty if no candidates found
      }
  
      // Calculate distances based on price and discount
      const distances = candidates.map(product => ({
        product,
        distance: calculateDistance(currentProduct, product)
      }));
  
      // Sort by distance and get top K
      const recommendations = distances
        .sort((a, b) => a.distance - b.distance)
        .slice(0, k)
        .map(item => item.product);
  
      return recommendations;
  
    } catch (error) {
      console.error('Error in findKNearestNeighbors:', error);
      return [];
    }
  };
  
  export { findKNearestNeighbors };