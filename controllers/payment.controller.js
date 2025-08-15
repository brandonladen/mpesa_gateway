const Transaction = require('../models/transaction.model');
const { initiateSTKPush } = require('../services/stkPush.service');
const logger = require('../utils/logger');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Initiate M-Pesa payment via STK Push
 */
exports.initiatePayment = async (req, res) => {
    try {
        const { phoneNumber, amount } = req.body;

        if (!phoneNumber || !amount) {
            return errorResponse(res, 400, 'Phone number and amount are required');
        }

        // Create initial transaction record
        const transaction = new Transaction({
            phoneNumber,
            amount
        });

        // Initiate STK Push
        const stkResponse = await initiateSTKPush(phoneNumber, amount);
        
        // Update transaction with M-Pesa request IDs
        transaction.merchantRequestID = stkResponse.MerchantRequestID;
        transaction.checkoutRequestID = stkResponse.CheckoutRequestID;
        await transaction.save();

        return successResponse(res, 200, 'Payment initiated', {
            checkoutRequestID: transaction.checkoutRequestID
        });

    } catch (error) {
        logger.error('Payment initiation failed:', error);
        return errorResponse(res, 500, 'Payment initiation failed');
    }
};

/**
 * Handle M-Pesa callback
 */
exports.confirmPayment = async (req, res) => {
    try {
        const { Body } = req.body;
        const { stkCallback } = Body;
        const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

        // Find the transaction
        const transaction = await Transaction.findOne({ checkoutRequestID: CheckoutRequestID });
        if (!transaction) {
            logger.error(`Transaction not found for CheckoutRequestID: ${CheckoutRequestID}`);
            return res.status(200).json({ success: true }); // Always return success to Safaricom
        }

        // Update transaction status
        transaction.resultCode = ResultCode;
        transaction.resultDesc = ResultDesc;
        
        if (ResultCode === 0) {
            const { CallbackMetadata } = stkCallback;
            const mpesaReceipt = CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber').Value;
            const transactionDate = CallbackMetadata.Item.find(item => item.Name === 'TransactionDate').Value;
            
            transaction.mpesaReceiptNumber = mpesaReceipt;
            transaction.transactionDate = transactionDate;
            transaction.status = 'completed';
        } else {
            transaction.status = 'failed';
        }

        await transaction.save();
        return res.status(200).json({ success: true });

    } catch (error) {
        logger.error('Payment confirmation failed:', error);
        return res.status(200).json({ success: true }); // Always return success to Safaricom
    }
};

/**
 * Get transaction status
 */
exports.getTransactionStatus = async (req, res) => {
    try {
        const { checkoutRequestId } = req.params;
        const transaction = await Transaction.findOne({ checkoutRequestID: checkoutRequestId });

        if (!transaction) {
            return errorResponse(res, 404, 'Transaction not found');
        }

        return successResponse(res, 200, 'Transaction status retrieved', {
            status: transaction.status,
            resultDesc: transaction.resultDesc,
            mpesaReceiptNumber: transaction.mpesaReceiptNumber,
            transactionDate: transaction.transactionDate
        });

    } catch (error) {
        logger.error('Get transaction status failed:', error);
        return errorResponse(res, 500, 'Failed to get transaction status');
    }
};

/**
 * Get transaction history
 */
exports.getTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .sort({ createdAt: -1 })
            .limit(50);

        return successResponse(res, 200, 'Transaction history retrieved', { transactions });

    } catch (error) {
        logger.error('Get transaction history failed:', error);
        return errorResponse(res, 500, 'Failed to get transaction history');
    }
};
