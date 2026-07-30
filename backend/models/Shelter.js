const mongoose = require('mongoose');

const ShelterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  capacity: { type: Number, required: true },
  occupied: { type: Number, default: 0 },
  availableBeds: { type: Number, default: 0 },
  foodAvailable: { type: Boolean, default: false },
  medicalAvailable: { type: Boolean, default: false },
  contactNumber: { type: String },
  status: { type: String, default: 'Open' }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

ShelterSchema.index({ latitude: 1, longitude: 1 });
ShelterSchema.index({ status: 1 });

module.exports = mongoose.model('Shelter', ShelterSchema);
