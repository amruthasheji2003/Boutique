// // controllers/cartController.js

// const Cart = require('../models/Cart');

// // Add item to cart
// exports.addItemToCart = async (req, res) => {
//     const { userId, item } = req.body;

//     try {
//         let cart = await Cart.findOne({ userId });

//         if (!cart) {
//             // Create a new cart if it doesn't exist
//             cart = new Cart({ userId, items: [item] });
//         } else {
//             // Check if item already exists in cart
//             const existingItemIndex = cart.items.findIndex(i => i.productId.toString() === item.productId);

//             if (existingItemIndex > -1) {
//                 // Update quantity if item already exists
//                 cart.items[existingItemIndex].quantity += item.quantity;
//                 cart.items[existingItemIndex].totalPrice += item.totalPrice; // Update total price
//             } else {
//                 // Add new item to cart
//                 cart.items.push(item);
//             }
//         }

//         // Save cart to database
//         await cart.save();
//         res.status(200).json(cart);
//     } catch (error) {
//         console.error('Error adding to cart:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };
