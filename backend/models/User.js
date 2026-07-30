const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true },
  phone: { type: String },
  role: { 
    type: String, 
    enum: ['Victim', 'Volunteer', 'Responder', 'Admin'], 
    default: 'Victim',
    required: true 
  },
  avatar: { type: String },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  status: { type: String, default: 'Active' },
  language: { type: String, default: 'en' }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

module.exports = mongoose.model('User', UserSchema);
