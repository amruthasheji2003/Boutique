const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');

// @route POST /api/batches
// @desc Add a new batch
router.post('/', batchController.addBatch);

// @route GET /api/batches
// @desc Get all batches
router.get('/', batchController.getAllBatches);

// @route GET /api/batches/:id
// @desc Get batch by ID
router.get('/:id', batchController.getBatchById);

// @route PUT /api/batches/:id
// @desc Update a batch by ID
router.put('/:id', batchController.updateBatch);

// @route DELETE /api/batches/:id
// @desc Delete a batch by ID
router.delete('/:id', batchController.deleteBatch);

module.exports = router;
