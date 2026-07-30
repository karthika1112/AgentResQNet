const mongoose = require('mongoose');

const VolunteerOfferSchema = new mongoose.Schema({
  offerId: { type: String, required: true, unique: true },
  volunteerName: { type: String, required: true },
  phoneNumber: { type: String },
  offerType: [{
    type: String,
    enum: [
      'Food', 'Drinking Water', 'Clothes', 'Medicine', 
      'Transport / Vehicle', 'Manpower', 'Medical Expertise', 'Shelter Space'
    ]
  }],
  targetArea: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  details: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Allocated', 'Completed'],
    default: 'Pending'
  }
}, {
  timestamps: true,
  versionKey: false
});

VolunteerOfferSchema.index({ status: 1 });

module.exports = mongoose.model('VolunteerOffer', VolunteerOfferSchema);
