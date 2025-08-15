 const axios = require('axios');
const getAccessToken =async ()=> {
  const {
      CONSUMER_KEY,
      CONSUMER_SECRET,
      MPESA_BASE_URL
  } = require('../config/mpesa');

    const url = `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;

  try {
    const encodedCredentials = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    const headers = {
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/json'
    };
    const response = await axios.get(url, { headers });
    return response.data.access_token;

  } catch (error) {
    console.error("Error fetching token:", error.response?.data || error.message);
    throw new Error('Failed to get access token.');
  }
};
module.exports = getAccessToken;