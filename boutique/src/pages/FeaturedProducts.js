import React from 'react';

const FeaturedProducts = () => {
  const FeaturedProducts = [
    {
      id: 1,
      name: 'Elegant Evening Gown',
      imageUrl: require('../assets/product1.jpg'),
      description: 'A stunning evening gown with exquisite detailing.',
    },
    {
      id: 2,
      name: 'Casual Summer Dress',
      imageUrl: require('../assets/product2.webp'),
      description: 'Perfect for a casual outing on a sunny day.',
    },
    {
      id: 3,
      name: 'Classic Suit',
      imageUrl: require('../assets/product3.webp'),
      description: 'A classic suit tailored to perfection.',
    },
  ];

  return (
    <div className="FeaturedProducts py-10 px-6">
      <h2 className="text-3xl font-bold text-center mb-8">FeaturedProducts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FeaturedProducts.map(product => (
          <div key={product.id} className="product-card p-4 bg-white rounded-lg shadow-lg">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="h-48 w-full object-contain rounded-t-lg" 
            />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedProducts;
