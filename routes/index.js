// Combine all routes here
const express = require("express");
const healthController = require('../controllers/health.controller');
const paymentRoutes = require('./payment.routes');

const router = express.Router();

// Health check route
router.get('/health', healthController.healthCheck);

// Payment routes
router.use('/payments', paymentRoutes);

module.exports = router;
