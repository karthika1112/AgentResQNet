const mongoose = require('mongoose');

const HelpRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  victimId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  victimName: { type: String, required: true },
  phoneNumber: { type: String },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String },
  helpType: [{
    type: String,
    enum: [
      'Food', 'Drinking Water', 'Clothes', 'Blankets', 'Medicine', 
      'Baby Food', 'Sanitary Kits', 'Temporary Shelter', 
      'Medical Assistance', 'Blood Requirement', 'Special Needs', 'Rescue'
    ]
  }],
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  description: { type: String },
  images: [{ type: String }],
  videos: [{ type: String }],
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Dispatched', 'Completed'],
    default: 'Pending'
  },
  assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
  assignedRescueTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueMission' },
  commanderNotes: { type: String },
  aiRecommendation: { type: String }
}, {
  timestamps: true,
  versionKey: false
});

HelpRequestSchema.index({ latitude: 1, longitude: 1 });
HelpRequestSchema.index({ status: 1 });
HelpRequestSchema.index({ priority: 1 });

module.exports = mongoose.model('HelpRequest', HelpRequestSchema);
