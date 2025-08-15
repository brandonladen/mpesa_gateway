const logger = require('../utils/logger');
const Transaction = require('../models/transaction.model');

async function handleCallback(payload) {
    try {
        const { Body: { stkCallback } } = payload;
        const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

        const transaction = await Transaction.findOne({ checkoutRequestID: CheckoutRequestID });
        if (!transaction) {
            logger.error(`Transaction not found for CheckoutRequestID: ${CheckoutRequestID}`);
            return { status: 'error', message: 'Transaction not found' };
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

        return {
            status: 'success',
            data: {
                MerchantRequestID,
                CheckoutRequestID,
                ResultCode,
                ResultDesc,
                MpesaReceiptNumber: transaction.mpesaReceiptNumber,
                TransactionDate: transaction.transactionDate
            }
        };
    } catch (error) {
        logger.error('Error handling callback:', error);
        throw new Error('Failed to process callback');
    }
}

module.exports = { handleCallback };
