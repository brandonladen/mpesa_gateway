const axios = require('axios');
const logger = require('../utils/logger');

let accessToken = null;
let tokenExpiry = null;

/**
 * Get M-Pesa API access token
 * @returns {Promise<string>} Access token
 */
exports.getAccessToken = async () => {
    try {
        // Check if we have a valid token
        if (accessToken && tokenExpiry && tokenExpiry > Date.now()) {
            return accessToken;
        }

        const consumerKey = process.env.MPESA_CONSUMER_KEY;
        const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

        // Generate auth string
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

        const response = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${auth}`
                }
            }
        );

        accessToken = response.data.access_token;
        // Token expires in 1 hour, we'll refresh after 55 minutes
        tokenExpiry = Date.now() + (55 * 60 * 1000);

        return accessToken;
    } catch (error) {
        logger.error('Failed to get access token:', error.response?.data || error.message);
        throw new Error('Failed to get access token');
    }
};
