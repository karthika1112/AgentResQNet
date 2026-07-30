const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  resourceName: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelter' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'Available' },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

ResourceSchema.index({ category: 1 });
ResourceSchema.index({ status: 1 });

module.exports = mongoose.model('Resource', ResourceSchema);
