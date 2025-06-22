
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

router.post('/', auth, async (req, res) => {
  const { items, total, address, location, paymentMode = 'COD', paymentStatus = 'Pending',coordinates } = req.body;

  if (!items || !total || !address) {
    return res.status(400).json({ error: 'Missing fields in request' });
  }

  try {
    console.log("📦 Order Received:", req.body);

    const order = new Order({
      items,
      total,
      address,
      location,
      paymentMode,
      paymentStatus,
      coordinates,
      userId: req.userId,
    });

    await order.save();

    await sendEmail(
          process.env.EMAIL_USER,
          '🔔 New Order Received - TastyBites',
          `<h3>You received a new Order</h3>
           <p><strong>total:</strong> ${total}</p>
           <p><strong>address</strong> ${address} at ${location}</p>
           <p><strong>paymentmode</strong> ${paymentMode}</p>
           <p><strong>paymentStatus</strong> ${paymentStatus}</p>`
        );

    const userEmail = req.user?.email || req.body.email;

    if (userEmail) {
      await sendEmail(
        userEmail,
        '🧾 Order Confirmation - TastyBites',
        `<h2 style="color:#ffcc00;">Hi ${req.user?.name || 'Customer'},</h2>
         <p>Thank you for your order at <strong>TastyBites</strong>!</p>
         <p><strong>Order Total:</strong> ₹${total}</p>
         <p><strong>Delivery Address:</strong> ${address}</p>
         <p><strong>Payment:</strong> ${paymentMode} (${paymentStatus})</p>
         <p>We are preparing your food and will notify you when it's out for delivery. 🍕🍔</p>
         <br><p style="color:#888;">TastyBites Team</p>`
      );
    }
    
    res.status(201).json({ message: 'Order placed successfully and email sent' });
  } catch (error) {
    console.error('❌ Error placing order:', error.message);
    res.status(500).json({ error: 'Order failed to save' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .populate('items.menuItem');

    res.json(orders);
  } catch (err) {
    console.error('❌ Error fetching orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.userId })
      .populate('items.menuItem', 'name price image');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('❌ Error fetching order by ID:', err.message);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
