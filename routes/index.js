// Combine all routes here
const express = require('express');
const healthController = require('../controllers/health.controller');

const router = express.Router();

// Health check route
router.get('/health', healthController.healthCheck);

// Payment routes
router.use('/payments', require('./payment.routes'));

module.exports = router;
