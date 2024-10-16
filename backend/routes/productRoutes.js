const express = require('express');
const upload = require('../config/multer'); // Adjust the path based on your directory structure
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();
router.get('/', getProducts);
router.post('/', upload.single('image'), addProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
