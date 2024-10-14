// // components/Cart.js
// import React from 'react';
// import { useCart } from '../context/CartContext';

// const Cart = () => {
//     const { cart } = useCart();

//     return (
//         <div className="container mx-auto p-6">
//             <h1 className="text-4xl font-bold mb-6">Your Cart</h1>
//             {cart.length === 0 ? (
//                 <p>Your cart is empty.</p>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {cart.map(item => (
//                         <div key={item.productId} className="bg-white shadow-lg p-4 rounded-lg">
//                             <img src={`http://localhost:8080/${item.image}`} alt={item.name} className="w-full h-40 object-cover mb-2" />
//                             <h2 className="text-xl font-semibold">{item.name}</h2>
//                             <p className="text-lg text-gray-600">Rs.{item.price}</p>
//                             <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                             <p className="text-sm text-gray-600">Total: Rs.{item.totalPrice}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Cart;
