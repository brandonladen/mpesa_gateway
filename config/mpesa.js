const envUtils = require('../common/envUtils');

envUtils.loadEnv();

module.exports = {
  MPESA_BASE_URL: envUtils.get('MPESA_BASE_URL'),
  CONSUMER_KEY: envUtils.get('MPESA_CONSUMER_KEY'),
  CONSUMER_SECRET: envUtils.get('MPESA_CONSUMER_SECRET'),
  SHORTCODE: envUtils.get('MPESA_SHORTCODE'),
  PASSKEY: envUtils.get('MPESA_PASSKEY'),
  CALLBACK_URL: envUtils.get('CALLBACKURL')
};