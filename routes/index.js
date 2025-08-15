// Combine all routes here
const express = require("express");
const paymentRoutes = require('./payment.routes');

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.use('/payments', paymentRoutes);

module.exports = router;
