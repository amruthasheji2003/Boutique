const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');

router.post('/batches', batchController.createBatch);
router.get('/batches', batchController.getAllBatches);
router.get('/batches/:id', batchController.getBatchById);
router.put('/batches/:id', batchController.updateBatch);
router.delete('/batches/:id', batchController.deleteBatch);

module.exports = router;
