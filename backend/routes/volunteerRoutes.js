const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

// Routes for Volunteer Offers
router.post('/offer', volunteerController.createOffer);
router.get('/offer', volunteerController.getOffers);
router.patch('/offer/:id', volunteerController.updateOfferStatus);

module.exports = router;
