// Callback tests
const callbackService = require('../services/callback.service');

describe('Callback Service', () => {
  it('should handle a successful callback payload', async () => {
    const mockPayload = {
      Body: {
        stkCallback: {
          MerchantRequestID: '12345',
          CheckoutRequestID: '67890',
          ResultCode: 0,
          ResultDesc: 'The service request is processed successfully.',
          CallbackMetadata: {
            Item: [
              { Name: 'Amount', Value: 10 },
              { Name: 'MpesaReceiptNumber', Value: 'ABC123XYZ' },
              { Name: 'TransactionDate', Value: 20250814 },
              { Name: 'PhoneNumber', Value: 254712345678 },
            ],
          },
        },
      },
    };

    const result = await callbackService.handleCallback(mockPayload);

    expect(result).toHaveProperty('status', 'success');
    expect(result.data).toHaveProperty('MpesaReceiptNumber', 'ABC123XYZ');
  });
});
