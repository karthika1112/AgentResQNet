const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');
const { protect } = require('../middleware/authMiddleware');

router.post('/run', protect, workflowController.runWorkflow);
router.get('/status/:workflowId', protect, workflowController.getWorkflowStatus);

module.exports = router;
