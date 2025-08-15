// OAuth token logic
const axios = require("axios");
const logger = require("../utils/logger");


const generateAccessToken =async ()=> {
  const {
      MPESA_CONSUMER_KEY,
      MPESA_CONSUMER_SECRET,
      MPESA_BASE_URL
  } = require("../config/env.js");

    const url = `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;

  try {
    const encodedCredentials = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');

    const headers = {
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/json'
    };
    const response = await axios.get(url, { headers });

    const token = response.data.access_token;
    return token;
  } catch (error) {
    logger.error("Error fetching M-Pesa access token", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw new Error("Failed to get access token.");
  }
};

module.exports = { generateAccessToken };

