const mongoose = require('mongoose');

const DisasterSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['Flood', 'Cyclone', 'Earthquake', 'Wildfire', 'Landslide', 'Industrial Accident', 'Urban Emergency'], 
    required: true 
  },
  riskLevel: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    required: true 
  },
  location: { type: String, required: true },
  forecast: { type: String },
  source: { type: String },
  startTime: { type: Date },
  endTime: { type: Date },
  status: { type: String, default: 'Active' },
  officialLink: { type: String }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

DisasterSchema.index({ type: 1 });
DisasterSchema.index({ status: 1 });

module.exports = mongoose.model('Disaster', DisasterSchema);
