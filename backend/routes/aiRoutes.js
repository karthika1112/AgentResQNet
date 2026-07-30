const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Standard rate limiter can be applied here later

router.get('/health', protect, authorize('Admin'), aiController.checkHealth);
router.post('/test', protect, authorize('Admin'), aiController.testPrompt);

module.exports = router;
