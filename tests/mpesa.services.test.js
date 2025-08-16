const { generateAccessToken } = require('../services/mpesaAuth.service');
const axios = require('axios');

jest.mock('axios');

describe('M-Pesa Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate access token successfully', async () => {
    const mockToken = 'test_access_token';
    const mockResponse = {
      data: {
        access_token: mockToken
      }
    };

    axios.get.mockResolvedValue(mockResponse);

    const token = await generateAccessToken();

    expect(token).toBe(mockToken);
    expect(axios.get).toHaveBeenCalledWith(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      expect.any(Object)
    );
  });

  it('should throw error when token generation fails', async () => {
    const errorMessage = 'Failed to get token';
    axios.get.mockRejectedValue(new Error(errorMessage));

    await expect(generateAccessToken()).rejects.toThrow('Failed to get access token.');
  });
});
