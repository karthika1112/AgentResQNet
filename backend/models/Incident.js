const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  incidentId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Rejected', 'Resolved', 'In Progress'], 
    default: 'Pending' 
  },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String },
  images: [{ type: String }],
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  verified: { type: Boolean, default: false },
  verificationStatus: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Rejected'], 
    default: 'Pending' 
  },
  assignedResponder: { type: mongoose.Schema.Types.ObjectId, ref: 'Responder' }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

IncidentSchema.index({ status: 1 });
IncidentSchema.index({ latitude: 1, longitude: 1 });
IncidentSchema.index({ reportedBy: 1 });

module.exports = mongoose.model('Incident', IncidentSchema);
