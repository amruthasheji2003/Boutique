const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ensure the product has a price
    if (!product.price && (!product.batches || product.batches.length === 0)) {
      return res.status(400).json({ message: 'Product price is not available' });
    }

    // Determine the price to use
    let price;
    if (product.price) {
      price = product.price;
    } else {
      // Assuming the most recent batch has the current price
      price = product.batches[0].finalPrice;
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product already in cart
    const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (cartItemIndex > -1) {
      // Update quantity if product exists
      cart.items[cartItemIndex].quantity += quantity;
    } else {
      // Add new item if product doesn't exist in cart
      cart.items.push({
        product: productId,
        quantity: quantity,
        price: price // Use the determined price
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};


exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = cart.items.find(item => item.product.toString() === productId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cartItem.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({ message: 'Cart updated', cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find the user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear the items array
    cart.items = [];

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};