const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    console.log('getCart function called');
    console.log('User:', req.user);

    const userId = req.user.id;
    console.log('UserId:', userId);

    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    console.log('Cart found:', cart);
    
    if (!cart) {
      console.log('No cart found, creating new cart');
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
      console.log('New cart created:', cart);
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart', error: error.message, stack: error.stack });
  }
};

exports.addToCart = async (req, res) => {
  try {
    console.log('addToCart function called');
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    console.log('Adding to cart:', { userId, productId, quantity });

    // Find the product
    const product = await Product.findOne({ productId: productId });
    console.log('Product found:', product);

    if (!product) {
      console.log('Product not found');
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get the price from the latest batch
    const latestBatch = product.batches[0];
    if (!latestBatch) {
      console.log('No batch available for this product');
      return res.status(400).json({ message: 'No batch available for this product' });
    }
    const price = latestBatch.finalPrice;
    console.log('Price:', price);

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    console.log('Existing cart:', cart);

    if (!cart) {
      console.log('Creating new cart');
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === product._id.toString());
    console.log('Existing item index:', existingItemIndex);

    if (existingItemIndex > -1) {
      console.log('Updating existing item');
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      console.log('Adding new item to cart');
      cart.items.push({
        product: product._id,
        quantity: quantity,
        price: price
      });
    }

    console.log('Cart before save:', JSON.stringify(cart, null, 2));
    await cart.save();
    console.log('Cart saved successfully');

    await cart.populate('items.product');
    console.log('Cart after populate:', JSON.stringify(cart, null, 2));

    res.status(200).json({
      message: 'Product added to cart successfully',
      cart: cart
    });

  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'An error occurred while adding the product to the cart', error: error.message });
  }
};
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    if (quantity > 0) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      message: 'Cart updated successfully',
      cart: cart
    });

  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'An error occurred while updating the cart item', error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      message: 'Product removed from cart successfully',
      cart: cart
    });

  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ message: 'An error occurred while removing the product from the cart', error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: 'Cart cleared successfully',
      cart: cart
    });

  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'An error occurred while clearing the cart', error: error.message });
  }
};