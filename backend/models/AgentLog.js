const mongoose = require('mongoose');

const AgentLogSchema = new mongoose.Schema({
  agentName: { type: String, required: true },
  request: { type: mongoose.Schema.Types.Mixed, required: true },
  response: { type: mongoose.Schema.Types.Mixed, required: true },
  executionTime: { type: Number },
  confidence: { type: Number },
  status: { type: String, default: 'Success' },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

AgentLogSchema.index({ agentName: 1 });
AgentLogSchema.index({ status: 1 });
AgentLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AgentLog', AgentLogSchema);
