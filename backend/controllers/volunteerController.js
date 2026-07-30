const VolunteerOffer = require('../models/VolunteerOffer');
const { sendSuccess, sendError } = require('../utils/response');
const { getIO } = require('../config/socket');

exports.createOffer = async (req, res, next) => {
  try {
    const { volunteerName, phoneNumber, offerType, targetArea, latitude, longitude, details } = req.body;
    const offerId = `VOL-${Date.now().toString().slice(-6)}`;

    const newOffer = await VolunteerOffer.create({
      offerId,
      volunteerName,
      phoneNumber,
      offerType,
      targetArea,
      latitude,
      longitude,
      details
    });

    // Notify Admin Dashboards
    getIO().emit('volunteer_offer_created', {
      message: `New Volunteer Offer: ${volunteerName} is offering ${offerType.join(', ')}`,
      data: newOffer
    });

    sendSuccess(res, 201, 'Volunteer offer submitted successfully', newOffer);
  } catch (error) {
    next(error);
  }
};

exports.getOffers = async (req, res, next) => {
  try {
    const offers = await VolunteerOffer.find().sort({ createdAt: -1 }).limit(100);
    sendSuccess(res, 200, 'Volunteer offers fetched', offers);
  } catch (error) {
    next(error);
  }
};

exports.updateOfferStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = await VolunteerOffer.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!updated) return sendError(res, 404, 'Volunteer offer not found');
    
    getIO().emit('volunteer_offer_updated', {
      message: `Volunteer Offer ${updated.offerId} is now ${status}`,
      data: updated
    });

    sendSuccess(res, 200, 'Offer status updated', updated);
  } catch (error) {
    next(error);
  }
};
