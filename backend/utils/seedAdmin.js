const User = require('../models/User');
const bcrypt = require('bcryptjs');
const logger = require('./logger');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'Admin' });

    if (!adminExists) {
      // Create default admin
      const adminData = {
        name: 'System Admin',
        email: 'admin@resqnet.com',
        password: 'AdminPassword123!',
        role: 'Admin'
      };

      // We don't hash the password manually here because User.js has a pre-save hook that will hash it for us.
      await User.create(adminData);
      logger.info('Default Admin account created: admin@resqnet.com / AdminPassword123!');
    } else {
      logger.info('Admin account already exists.');
    }
  } catch (error) {
    logger.error('Error seeding admin account:', error);
  }
};

module.exports = seedAdmin;
