// backend/routes/materialRoutes.js
const express = require('express');
const multer = require('multer');
const materialController = require('../controllers/materialController');


const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Append timestamp to filename
  },
});

const upload = multer({ storage });

// Define routes
router.get('/', materialController.getAllMaterials); // Fetch all materials
router.post('/add', upload.single('image'), materialController.addMaterial); // Add a new material
router.delete('/:id', materialController.deleteMaterial); // Delete a material by ID

module.exports = router;