const mongoose = require('mongoose');

const ResourceInventorySchema = new mongoose.Schema({
  food: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
  medicine: { type: Number, default: 0 },
  blankets: { type: Number, default: 0 },
  fuel: { type: Number, default: 0 },
  vehicles: { type: Number, default: 0 },
  medicalKits: { type: Number, default: 0 },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelter', required: true }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

ResourceInventorySchema.index({ warehouse: 1 });

module.exports = mongoose.model('ResourceInventory', ResourceInventorySchema);
