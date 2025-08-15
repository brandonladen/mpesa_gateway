const axios = require('axios');
const { generateAccessToken } = require('./mpesaAuth.service');
const {
  MPESA_BASE_URL,
  SHORTCODE,
  PASSKEY,
  CALLBACK_URL
} = require('../config/env.js');

async function initiatePayment(amount, phoneNumber, accountReference, transactionDesc) {
  const accessToken = await generateAccessToken();

  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

  const payload = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: parseFloat(amount.replace(/[^0-9.-]+/g, "")),
    PartyA: phoneNumber,
    PartyB: SHORTCODE,
    PhoneNumber: phoneNumber,
    CallBackURL: CALLBACK_URL,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc
  };

  try {
    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error initiating payment:', error.response?.data || error.message);
    throw new Error('Failed to initiate payment');
  }
}

module.exports = { initiatePayment };