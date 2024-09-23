import React from 'react';

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Elegant Gown',
      imageUrl: require('../assets/product1.jpg'),
      description: 'Gown designed to make every occasion special',
    },
    {
      id: 2,
      name: 'Long Skirt and Top',
      imageUrl: require('../assets/product2.webp'),
      description: 'A versatile and stylish long skirt and top, perfect for both casual outings and dressier events',
    },
    {
      id: 3,
      name: 'Top with Skirt and Shrug',
      imageUrl: require('../assets/product3.webp'),
      description: 'Offers a coordinated look with modern flair, ideal for a variety of occasions',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="home flex items-center justify-center h-screen bg-center" 
        style={{ 
          backgroundImage: `url(${require('../assets/home13.jpg')})`,
          backgroundSize: 'cover', 
          backgroundRepeat: 'no-repeat', 
          backgroundPosition: 'center' 
        }}
      >
      </div>

      {/* Featured Products Section */}
      <div className="featured-products py-10 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card p-4 bg-white rounded-lg shadow-lg">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full rounded-t-lg" 
                style={{ height: 'auto' }} 
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Us Section */}
      <div className="about-us py-16 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg mb-4">
            At Tailor's Touch Boutique, we believe that every garment should tell a unique story. Our personalized tailoring services are designed to meet your specific needs and preferences, ensuring that you look and feel your best. With a commitment to quality craftsmanship and attention to detail, we offer a wide range of custom tailoring options that blend timeless elegance with modern trends.
          </p>
          <p className="text-lg">
            Whether you are preparing for a special event or simply want to refresh your wardrobe with custom pieces, our skilled tailors are here to provide you with exceptional service and exquisite results. Join us in experiencing the art of personalized fashion at its finest.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
