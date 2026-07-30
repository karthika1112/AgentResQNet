const mongoose = require('mongoose');

const RescueMissionSchema = new mongoose.Schema({
  missionId: { type: String, required: true, unique: true },
  incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
  assignedResponder: { type: mongoose.Schema.Types.ObjectId, ref: 'Responder' },
  assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' }],
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Resolved', 'Cancelled'], 
    default: 'Pending' 
  },
  startTime: { type: Date },
  endTime: { type: Date },
  ETA: { type: String },
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

RescueMissionSchema.index({ status: 1 });
RescueMissionSchema.index({ priority: 1 });

module.exports = mongoose.model('RescueMission', RescueMissionSchema);
