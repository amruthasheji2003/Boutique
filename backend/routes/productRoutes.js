const express = require('express');
const upload = require('../config/multer'); // Adjust the path based on your directory structure
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

// Define routes
router.get('/', getProducts); // Fetch all products
router.post('/', upload.single('image'), addProduct); // Handle image upload for adding a product
router.put('/:id', upload.single('image'), updateProduct); // Handle image upload for updating a product
router.delete('/:id', deleteProduct); // Delete a product by ID

module.exports = router;
