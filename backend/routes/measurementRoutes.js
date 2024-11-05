const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurementController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);


router.post('/add', measurementController.addMeasurement);
router.get('/:productId', measurementController.getMeasurement);
router.get('/', measurementController.getAllMeasurements);
router.delete('/:measurementId', measurementController.deleteMeasurement);


module.exports = router;