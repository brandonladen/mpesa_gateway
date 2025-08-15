const express = require('express');
const router = express.Router();
const { 
    initiatePayment,
    confirmPayment,
    getTransactionStatus,
    getTransactionHistory
} = require('../controllers/payment.controller');

// @route   POST /api/payments/initiate
// @desc    Initiate M-Pesa STK Push payment
// @access  Public
router.post('/initiate', initiatePayment);

// @route   POST /api/payments/callback
// @desc    Handle M-Pesa payment callback
// @access  Public (but should be restricted to Safaricom IPs in production)
router.post('/callback', confirmPayment);

// @route   GET /api/payments/status/:checkoutRequestId
// @desc    Get status of a specific transaction
// @access  Public
router.get('/status/:checkoutRequestId', getTransactionStatus);

// @route   GET /api/payments/history
// @desc    Get transaction history
// @access  Public (should be protected in production)
router.get('/history', getTransactionHistory);

module.exports = router;
