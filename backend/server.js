const express = require('express');
const http = require('http');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const { sendError } = require('./utils/response');
const env = require('./config/env');
const logger = require('./utils/logger');
const routes = require('./routes');

const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // disabled for local dev ease, can enable in strict prod
  crossOriginEmbedderPolicy: false
}));
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Increased limit for development and active dashboard polling
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Standard Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('dev'));

// Mount Routers
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Routes
app.use('/api', routes);

// 404 Handler
app.use((req, res, next) => {
  sendError(res, 404, 'Endpoint not found');
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  sendError(res, err.status || 500, err.message || 'Internal Server Error', process.env.NODE_ENV === 'development' ? err : {});
});

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

const seedAdmin = require('./utils/seedAdmin');

// Start Server
const startServer = async () => {
  try {
    // Wait for MongoDB to connect before starting server
    await connectDB();
    
    // Auto-seed default Admin account if one doesn't exist
    await seedAdmin();

    server.listen(env.PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
