 const axios = require('axios');
const path = require('path');


require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const getAccessToken = async() => {

    const consumerKey =process.env.MPESA_CONSUMER_KEY
    const consumerSecret =process.env.MPESA_CONSUMER_SECRET
  // Choose one depending on your development environment
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  // const url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"; // live

  try {
    const encodedCredentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

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