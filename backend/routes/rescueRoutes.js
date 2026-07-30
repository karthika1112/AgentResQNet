const express = require('express');
const router = express.Router();
const rescueController = require('../controllers/rescueController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, rescueController.createRescueMission);
router.get('/status/:missionId', protect, rescueController.getMissionStatus);
router.put('/update', protect, rescueController.updateMissionGPS);

module.exports = router;
