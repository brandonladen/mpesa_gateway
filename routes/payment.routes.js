// Payment routes
const express = require("express");
const router = express.Router();
const { initiatePayment } = require("../services/stkPush.service");
const logger = require("../utils/logger");

router.post("/stkpush", async (req, res, next) => {
  try {
    const { amount, phoneNumber, accountReference, transactionDesc } = req.body;

    if (!amount || !phoneNumber || !accountReference || !transactionDesc) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: amount, phoneNumber, accountReference, transactionDesc",
      });
    }

    const response = await initiatePayment(
      amount,
      phoneNumber,
      accountReference,
      transactionDesc
    );

    res.status(200).json({
      success: true,
      message: "STK Push initiated successfully",
      data: response,
    });
  } catch (error) {
    logger.error("Error in STK Push initiation", { error: error.message });
    next(error);
  }
});

router.post("/callback", (req, res) => {
  try {
    const callbackData = req.body.Body.stkCallback;

    res.json({ ResultCode: 0, ResultDesc: "Accepted" });

    if (callbackData.ResultCode === 0) {
      // Payment successful
      const transactionDetails = callbackData.CallbackMetadata?.Item || [];
      logger.info("STK Push payment successful", { transactionDetails });
      // Save to DB

      
    } else {
      // Payment failed
      logger.error("STK Push payment failed", {
        resultCode: callbackData.ResultCode,
        description: callbackData.ResultDesc,
      });
    }
  } catch (error) {
    logger.error("Error in callback processing", { error: error.message });
  }
});

module.exports = router;
