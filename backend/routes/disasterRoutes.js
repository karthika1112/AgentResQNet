const express = require('express');
const router = express.Router();
const disasterController = require('../controllers/disasterController');
const { protect } = require('../middleware/authMiddleware');

router.get('/status', protect, disasterController.getStatus);
router.get('/forecast', protect, disasterController.getForecast);
router.post('/analyse', protect, disasterController.analyseLocation);

module.exports = router;
