const express = require('express');
const router = express.Router();
const evacuationController = require('../controllers/evacuationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/shelters', protect, evacuationController.getShelters);
router.get('/nearest', protect, evacuationController.getNearestShelter);
router.post('/route', protect, evacuationController.calculateRoute);

module.exports = router;
