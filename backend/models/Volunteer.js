const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [{ type: String }],
  availability: { type: Boolean, default: true },
  vehicle: { type: String },
  currentLocation: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  assignedMission: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueMission' },
  status: { type: String, default: 'Available' }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

VolunteerSchema.index({ status: 1 });
VolunteerSchema.index({ availability: 1 });

module.exports = mongoose.model('Volunteer', VolunteerSchema);
