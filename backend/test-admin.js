const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

async function checkAdmin() {
  await connectDB();
  const admin = await User.findOne({ email: 'admin@resqnet.com' });
  if (admin) {
    console.log('Admin found in DB:', admin);
    const isMatch = await admin.matchPassword('AdminPassword123!');
    console.log('Password match:', isMatch);
  } else {
    console.log('Admin not found!');
  }
  process.exit();
}
checkAdmin();
