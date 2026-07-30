const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

router.route('/profile')
  .get(protect, authController.getProfile)
  .put(protect, authController.updateProfile);

router.get('/users', protect, authorize('Admin'), authController.getAllUsers);

module.exports = router;
