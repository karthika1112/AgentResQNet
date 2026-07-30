const express = require('express');
const router = express.Router();
const victimController = require('../controllers/victimController');
const { protect } = require('../middleware/authMiddleware');

// Help Request Routes (SOS)
router.post('/help-request', victimController.createHelpRequest); // Public or protected
router.get('/help-request', victimController.getHelpRequests);
router.get('/help-request/:id', victimController.getHelpRequestById);
router.patch('/help-request/:id', protect, victimController.updateHelpRequest);
router.delete('/help-request/:id', protect, victimController.deleteHelpRequest);

// Incident Reporting Route
router.post('/report', victimController.reportDisaster);
router.get('/incidents', victimController.getIncidents);

// Live Stats Route
router.get('/live-stats', victimController.getLiveStats);

module.exports = router;
