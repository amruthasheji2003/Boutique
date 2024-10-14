// import React from 'react';
// import { FaShoppingCart, FaHeart } from 'react-icons/fa';
// import { useCart } from '../context/CartContext';

// const Product = ({ product, wishlist, toggleWishlist }) => {
//     const { addToCart } = useCart();

//     const handleAddToCart = () => {
//         addToCart(product);
//         alert(`${product.name} has been added to your cart!`);
//     };

//     return (
//         <div className="catalog-item bg-white shadow-lg p-4 rounded-lg relative flex flex-col items-center">
//             <div className="absolute top-2 right-2 flex space-x-2">
//                 <FaHeart
//                     className={`cursor-pointer text-2xl ${wishlist.includes(product._id) ? 'text-red-600' : 'text-gray-500'} hover:text-red-600`}
//                     title="Add to Wishlist"
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         toggleWishlist(product._id);
//                     }}
//                 />
//                 <FaShoppingCart
//                     className="text-blue-500 hover:text-blue-600 cursor-pointer text-2xl"
//                     title="Add to Cart"
//                     onClick={(e) => {
//                         e.stopPropagation(); // Prevent triggering product click
//                         handleAddToCart(); // Call the function to add to cart
//                     }}
//                 />
//             </div>

//             <div className="relative overflow-hidden rounded-lg mb-4">
//                 <img
//                     src={`http://localhost:8080/${product.image}`}
//                     alt={product.name}
//                     className="w-full h-40 object-cover mb-2"
//                 />
//             </div>

//             <h2 className="text-xl font-semibold mb-2 text-center">{product.name}</h2>
//             <p className="text-lg text-gray-600 mb-2">Rs.{product.price}</p>
//             <p className="text-sm text-gray-600 mb-2">Category: {product.category}</p>
//             <p className="text-sm text-gray-600 mb-2">Stock: {product.stock}</p>
//             <p className="text-sm text-gray-600 mb-2">{product.description}</p>
//         </div>
//     );
// };

// export default Product;
