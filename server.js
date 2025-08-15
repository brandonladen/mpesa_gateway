const app = require('./app');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
require('./config/env');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mpesa_gateway';

let server;

mongoose.connect(MONGO_URI)
  .then(() => {
    logger.info('MongoDB Connected...');
    server = app.listen(PORT, () => {
      logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });
  })
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received');
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received');
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

module.exports = server;
