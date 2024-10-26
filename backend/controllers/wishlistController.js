const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    // Check if product already in wishlist
    const productIndex = wishlist.products.findIndex(id => id.toString() === productId);

    if (productIndex === -1) {
      // Add new product if it doesn't exist in wishlist
      wishlist.products.push(productId);
    } else {
      // Product already exists in wishlist
      return res.status(200).json({ message: 'Product already in wishlist', wishlist });
    }

    await wishlist.save();
    await wishlist.populate('products');

    res.status(200).json({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
};
exports.removeFromWishlist = async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user.userId;
  
      const wishlist = await Wishlist.findOne({ user: userId });
      if (!wishlist) {
        return res.status(404).json({ message: 'wishlist not found' });
      }
  
      wishlist.items = wishlist.items.filter(item => item.product.toString() !== productId);
      await wishlist.save();
      await wishlist.populate('items.product');
  
      res.status(200).json({ message: 'Product removed from wishlist', wishlist });
    } catch (error) {
      console.error('Error removing from wishlsit:', error);
      res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
    }
  };

exports.getWishlist = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
      if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found' });
      }
  
      res.status(200).json({ wishlist });
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
    }
  };

exports.clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = [];
    await wishlist.save();

    res.status(200).json({ message: 'Wishlist cleared', wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing wishlist', error: error.message });
  }
};