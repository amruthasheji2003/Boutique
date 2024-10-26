const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurementController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, measurementController.addMeasurement);
router.get('/:productId', authMiddleware, measurementController.getMeasurement);

module.exports = router;