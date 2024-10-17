const express = require('express');
const { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Adjust the path as needed

const router = express.Router();

// Routes for product management
router.post('/', upload.single('image'), createProduct); // POST /api/products
router.get('/', getProducts); // GET /api/products
router.get('/:id', getProductById); // GET /api/products/:id
router.put('/:id', upload.single('image'), updateProduct); // PUT /api/products/:id
router.delete('/:id', deleteProduct); // DELETE /api/products/:id

module.exports = router;
