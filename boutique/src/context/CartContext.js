// // context/CartContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//     const [cart, setCart] = useState([]);
//     const userId = 'user._id'; // Replace with actual user ID from your auth context

//     const fetchCart = async () => {
//         try {
//             const response = await axios.get(`http://localhost:8080/api/cart/${userId}`);
//             setCart(response.data.items);
//         } catch (error) {
//             console.error('Error fetching cart:', error);
//         }
//     };

//     useEffect(() => {
//         fetchCart();
//     }, []);

//     return (
//         <CartContext.Provider value={{ cart, setCart }}>
//             {children}
//         </CartContext.Provider>
//     );
// };

// export const useCart = () => {
//     return useContext(CartContext);
// };
