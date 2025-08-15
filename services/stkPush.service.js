const axios = require('axios');
const { getAccessToken } = require('./mpesaAuth.service');
const logger = require('../utils/logger');

/**
 * Initiate STK Push request to M-Pesa
 * @param {string} phoneNumber - Customer phone number (254XXXXXXXXX format)
 * @param {number} amount - Amount to charge
 * @returns {Promise} STK Push response
 */
exports.initiateSTKPush = async (phoneNumber, amount) => {
    try {
        const accessToken = await getAccessToken();
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        
        // Get these from environment variables
        const shortCode = process.env.MPESA_SHORTCODE;
        const passkey = process.env.MPESA_PASSKEY;
        const callbackUrl = process.env.MPESA_CALLBACK_URL;
        
        // Generate password
        const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: shortCode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phoneNumber,
                PartyB: shortCode,
                PhoneNumber: phoneNumber,
                CallBackURL: callbackUrl,
                AccountReference: 'MPesa Payment',
                TransactionDesc: 'Payment'
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        return response.data;
    } catch (error) {
        logger.error('STK Push failed:', error.response?.data || error.message);
        throw new Error('Failed to initiate payment');
    }
};
