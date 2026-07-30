const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, resourceController.getGlobalInventory);
router.post('/request', protect, resourceController.requestResources);
router.put('/update', protect, resourceController.updateInventory);

module.exports = router;
