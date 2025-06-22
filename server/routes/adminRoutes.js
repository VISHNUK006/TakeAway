const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const orderController = require('../controllers/orderController');
const Menu = require('../models/menu');
const User = require('../models/User');
const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');
const upload = require('../middleware/upload');

router.get('/dashboard', requireAuth, requireAdmin, (req, res) => {
  res.json({ message: '✅ Welcome to the Admin Dashboard!' });
});

router.get('/summary', requireAuth, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalMenuItems = await Menu.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });

    res.json({
      totalUsers,
      totalOrders,
      totalMenuItems,
      pendingOrders,
      deliveredOrders
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/menu', requireAuth, requireAdmin, async (req, res) => {
  try {
    const search = req.query.search || '';
    const filter = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};
    const items = await Menu.find(filter);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post(
  '/menu',
  requireAuth,
  requireAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      const { name, price, description, category } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : '';

      const item = new Menu({
        name,
        price,
        description,
        category,
        image,
      });

      await item.save();
      res.json({ message: '✅ Menu item added', item });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

router.put('/menu/:id', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const updatedFields = {
      name,
      price,
      description,
      category,
    };

    if (req.file) {
      updatedFields.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Menu.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
    });

    res.json({ message: '✅ Menu item updated', item: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/menu/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑️ Menu item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/orders', requireAuth, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/orders/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status || 'Pending';
    await order.save();

     if (order.userId?.email) {
      const subject = `Your order is updated - TastyBites`;
      const html = `
        <p>Hello ${order.userId.name},</p>
        <p>Your order <strong>${order._id}</strong> is <strong>${order.status}</strong></p>
        <p>Thank you for ordering with us!</p>
      `;

      sendEmail(order.userId.email, subject, html);
    }

    res.json({ message: '✅ Order status updated and user notified', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/orders/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑️ Order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;


