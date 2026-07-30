const express = require('express');
const router = express.Router();
const commanderController = require('../controllers/commanderController');
const { protect } = require('../middleware/authMiddleware');

// The commander chat endpoint requires authentication
router.post('/chat', protect, commanderController.chat);

module.exports = router;
