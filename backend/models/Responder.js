const mongoose = require('mongoose');

const ResponderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  vehicle: { type: String },
  equipment: [{ type: String }],
  status: { type: String, default: 'On Duty' },
  currentLocation: {
    latitude: { type: Number },
    longitude: { type: Number }
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

ResponderSchema.index({ status: 1 });
ResponderSchema.index({ department: 1 });

module.exports = mongoose.model('Responder', ResponderSchema);
