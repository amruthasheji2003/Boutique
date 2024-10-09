// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// // Create Cart Context
// const CartContext = createContext();

// // Provide Cart Context to children components
// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const userId = 'userId_here'; // Replace with the actual user ID

//   // Fetch cart items from the backend on mount
//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/cart/${userId}`); // Include userId in the endpoint
//         setCart(response.data); // Adjust based on your backend response structure
//       } catch (error) {
//         console.error('Error fetching cart:', error);
//       }
//     };
//     fetchCart();
//   }, [userId]); // Include userId in dependency array

//   // Add to cart
//   const addToCart = async (product) => {
//     try {
//       const response = await axios.post('http://localhost:8080/api/cart/add', { 
//         userId,  // Use the userId variable here
//         productId: product.id, // Assuming product has an id property
//         quantity: 1 // Specify quantity if needed
//       });
//       setCart(response.data); // Update cart with the response (assumes response contains updated cart)
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//     }
//   };

//   // Remove from cart
//   const removeFromCart = async (productId) => {
//     try {
//       const response = await axios.delete(`http://localhost:8080/api/cart/${userId}/remove/${productId}`); // Include userId in the endpoint
//       setCart(response.data); // Update cart with the response (assumes response contains updated cart)
//     } catch (error) {
//       console.error('Error removing from cart:', error);
//     }
//   };

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// // Custom hook for accessing Cart context
// export const useCart = () => {
//   return useContext(CartContext);
// };

// // Cart component
// const Cart = () => {
//   const { cart, removeFromCart } = useCart();

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
//       {cart.length === 0 ? (
//         <p className="text-gray-600">Your cart is empty.</p>
//       ) : (
//         cart.map((item) => (
//           <div key={item.productId} className="flex justify-between items-center border-b py-2">
//             <p className="text-lg">{item.productName}</p> {/* Assuming productName exists */}
//             <button
//               onClick={() => removeFromCart(item.productId)}
//               className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
//             >
//               Remove
//             </button>
//           </div>
//         ))
//       )}
//       <div className="mt-4">
//         {cart.length > 0 && (
//           <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
//             Proceed to Checkout
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;
