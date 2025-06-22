const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const auth = require('../middleware/auth');
const razorpay = require('../utils/razorpay');
const Payment = require('../models/Payment');

router.post('/create-order', async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;

  try {
    const options = {
      amount: amount * 100, 
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error('🛑 Razorpay Order Error:', err);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

router.post('/verify', auth, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    receipt,
  } = req.body;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const payment = new Payment({
      userId: req.userId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount,
      receipt,
      paymentDetails: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
      status: 'success',
      method: 'razorpay',
    });

    await payment.save();

    res.json({ success: true, message: '✅ Payment verified and saved' });
  } catch (err) {
    console.error('❌ Payment verification failed:', err.message);
    res.status(500).json({ success: false, message: 'Server error during verification' });
  }
});

module.exports = router;
