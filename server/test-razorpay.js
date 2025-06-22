
require('dotenv').config();
const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

instance.orders.create({ amount: 50000, currency: "INR" }, function(err, order) {
  if (err) return console.error("❌ Failed:", err);
  console.log("✅ Order created:", order);
});
