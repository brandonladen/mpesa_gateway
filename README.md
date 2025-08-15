# M-Pesa Gateway API

A robust Node.js REST API for integrating M-Pesa mobile money payments into applications. This gateway provides a secure and reliable interface for initiating STK Push payments, handling callbacks, and managing transactions.

## Features

- **STK Push Integration**: Initiate M-Pesa payments via STK Push
- **OAuth Authentication**: Secure token-based authentication with M-Pesa API
- **Callback Handling**: Process payment confirmations and updates
- **Transaction Management**: Track and store payment transactions
- **Comprehensive Logging**: Detailed logging for debugging and monitoring
- **Error Handling**: Robust error handling with standardized responses
- **CORS Support**: Cross-origin resource sharing enabled
- **Testing Suite**: Jest-based test coverage for critical components
- **Environment Configuration**: Flexible configuration management
- **Graceful Shutdown**: Proper server shutdown handling

## Project Structure

```
mpesa_gateway/
├── app.js                 # Express application setup and middleware
├── server.js             # Server entry point and configuration
├── package.json          # Dependencies and scripts
├── config/
│   └── env.js           # Environment configuration and validation
├── controllers/
│   └── health.controller.js  # Health check endpoint
├── middlewares/
│   └── errorHandler.js   # Global error handling middleware
├── models/
│   └── transaction.model.js  # Transaction data model (MongoDB)
├── routes/
│   ├── index.js         # Main route aggregator
│   └── payment.routes.js # Payment-related endpoints
├── services/
│   ├── mpesaAuth.service.js  # M-Pesa OAuth authentication
│   └── stkPush.service.js    # STK Push payment processing
├── utils/
│   ├── logger.js        # Custom logging utility
│   ├── response.js      # Standardized API response helper
│   └── timestamp.js     # Timestamp generation utility
└── tests/
    ├── callback.test.js  # Callback endpoint tests
    └── payment.test.js   # Payment service tests
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- M-Pesa Developer Account
- M-Pesa API Credentials (Consumer Key, Consumer Secret, Shortcode, Passkey)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/brandonladen/mpesa_gateway
   cd mpesa_gateway
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3000

   # M-Pesa Configuration
   MPESA_BASE_URL=https://sandbox.safaricom.co.ke
   MPESA_CONSUMER_KEY=your_consumer_key_here
   MPESA_CONSUMER_SECRET=your_consumer_secret_here
   MPESA_SHORTCODE=your_shortcode_here
   MPESA_PASSKEY=your_passkey_here
   CALLBACK_URL=https://your-domain.com/api/payments/callback

   # CORS Configuration (optional)
   ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Watch Mode (Development)
```bash
npm run dev:watch
```

### Running Tests
```bash
npm test
```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and health information.

### STK Push Payment
```
POST /api/payments/stkpush
```

**Request Body:**
```json
{
  "amount": 100,
  "phoneNumber": "254712345678",
  "accountReference": "INV001",
  "transactionDesc": "Payment for services"
}
```

**Response:**
```json
{
  "success": true,
  "message": "STK Push initiated successfully",
  "data": {
    "MerchantRequestID": "12345",
    "CheckoutRequestID": "67890",
    "ResponseCode": "0",
    "ResponseDescription": "Success. Request accepted for processing",
    "CustomerMessage": "Success message to customer"
  }
}
```

### Payment Callback
```
POST /api/payments/callback
```
Receives payment confirmation from M-Pesa. This endpoint processes the callback data and updates transaction status.

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Application environment | Yes | `development` |
| `PORT` | Server port | No | `3000` |
| `MPESA_BASE_URL` | M-Pesa API base URL | Yes | - |
| `MPESA_CONSUMER_KEY` | M-Pesa consumer key | Yes | - |
| `MPESA_CONSUMER_SECRET` | M-Pesa consumer secret | Yes | - |
| `MPESA_SHORTCODE` | M-Pesa business shortcode | Yes | - |
| `MPESA_PASSKEY` | M-Pesa passkey | Yes | - |
| `CALLBACK_URL` | Payment callback URL | Yes | - |
| `ALLOWED_ORIGINS` | CORS allowed origins | No | `*` |

### M-Pesa Configuration

1. **Get API Credentials**: Register at [M-Pesa Developer Portal](https://developer.safaricom.co.ke/)
2. **Configure Shortcode**: Set up your business shortcode
3. **Generate Passkey**: Create a passkey for your shortcode
4. **Set Callback URL**: Configure the callback URL for payment confirmations

## Security Features

- **OAuth 2.0 Authentication**: Secure token-based API access
- **Input Validation**: Request parameter validation
- **Error Handling**: Secure error responses without sensitive data exposure
- **CORS Configuration**: Configurable cross-origin access control
- **Request Logging**: Comprehensive request/response logging

## Logging

The application uses a custom logging utility that provides:

- **Console Output**: Colored log messages for development
- **File Logging**: Persistent logs in production
- **Log Levels**: Error, Warning, Info, Debug
- **Structured Logging**: JSON metadata support
- **Timestamp**: ISO format timestamps

Logs are stored in the `logs/` directory with separate files for each log level.

## Testing

The application includes comprehensive test coverage:

- **Unit Tests**: Service layer testing with mocked dependencies
- **Integration Tests**: API endpoint testing
- **Test Framework**: Jest with node-mocks-http

Run tests with:
```bash
npm test
```

## Usage Examples

### Initiating a Payment

```javascript
const axios = require('axios');

const paymentData = {
  amount: 500,
  phoneNumber: "254712345678",
  accountReference: "ORDER123",
  transactionDesc: "Payment for online order"
};

try {
  const response = await axios.post('http://localhost:3000/api/payments/stkpush', paymentData);
  console.log('Payment initiated:', response.data);
} catch (error) {
  console.error('Payment failed:', error.response.data);
}
```

### Handling Callbacks

The application automatically processes M-Pesa callbacks and logs transaction details. You can extend the callback handler to:

- Store transactions in a database
- Send notifications
- Update order status
- Generate receipts

## Transaction Flow

1. **Client Request**: Client sends payment request to `/api/payments/stkpush`
2. **Authentication**: Service generates OAuth token from M-Pesa
3. **STK Push**: Initiates STK Push request to M-Pesa
4. **User Action**: User receives STK Push and enters PIN
5. **Callback**: M-Pesa sends confirmation to callback URL
6. **Processing**: Application processes callback and updates transaction status

## Error Handling

The application provides standardized error responses:

- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication errors)
- **403**: Forbidden (access denied)
- **404**: Not Found (resource not found)
- **500**: Internal Server Error (server errors)

All errors are logged with detailed context for debugging.

## Deployment

### Production Considerations

1. **Environment Variables**: Ensure all required environment variables are set
2. **HTTPS**: Use HTTPS in production for secure communication
3. **Logging**: Configure appropriate log levels and storage
4. **Monitoring**: Implement health checks and monitoring
5. **Rate Limiting**: Consider implementing rate limiting for API endpoints

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the ISC License.

## Related Links

- [M-Pesa Developer Documentation](https://developer.safaricom.co.ke/)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/)

---

