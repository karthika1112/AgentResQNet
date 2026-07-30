const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/verify', protect, verificationController.verifyIncident);
router.get('/status/:id', protect, verificationController.getVerificationStatus);

module.exports = router;
