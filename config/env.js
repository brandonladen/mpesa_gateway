const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

// Validate required environment variables
const requiredVars = [
  'NODE_ENV'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.error('Missing required environment variables:', missingVars);
  process.exit(1);
}

// Set default values for development
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

if (!process.env.PORT) {
  process.env.PORT = '3000';
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  // Add other environment variables here as needed
};
