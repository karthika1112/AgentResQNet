const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

const connectDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      if (!env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined");
      }
      await mongoose.connect(env.MONGODB_URI, {
        maxPoolSize: 50,
        minPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      logger.info('MongoDB connected successfully.');
      break;
    } catch (error) {
      logger.error(`MongoDB connection error. Retries left: ${retries - 1}`);
      retries -= 1;
      logger.error(error.message);
      if (retries === 0) {
        logger.error('Could not connect to MongoDB. Exiting...');
        process.exit(1);
      }
      // Wait 5 seconds before retrying
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

// Graceful shutdown
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected.');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;
