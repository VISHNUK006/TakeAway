const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const sendEmail = require('../utils/sendEmail');
const authMiddleware = require('../middleware/authMiddleware'); 
const requireAdmin = require('../middleware/requireAdmin');     

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, paymentMode = 'COD', paymentStatus = 'Pending', message } = req.body;

    const booking = new Booking({
      user: req.user._id,
      name,
      email,
      phone,
      date,
      time,
      guests,
      paymentMode,
      paymentStatus,
      message,
    });

    await booking.save();

    await sendEmail(
      email,
      'Your Table Booking is Confirmed - TastyBites',
      `<h2>Hello ${name},</h2>
       <p>Your table has been successfully booked for ${date} at ${time}.</p>
       <p>Guests: ${guests}</p>
       <p>Thank you for choosing TastyBites! 🍽️</p>`
    );

    await sendEmail(
      process.env.EMAIL_USER,
      '🔔 New Table Booking Received - TastyBites',
      `<h3>New Booking Details</h3>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Date:</strong> ${date} at ${time}</p>
       <p><strong>Guests:</strong> ${guests}</p>`
    );

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/mybooking', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ date: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving bookings' });
  }
});

router.get('/admin/booking', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').sort({ date: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

router.put('/admin/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    Object.assign(booking, req.body);
    await booking.save();
    res.json({ message: 'Booking updated', booking });
  } catch (err) {
    res.status(500).json({ message: 'Error updating booking' });
  }
});

router.delete('/admin/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting booking' });
  }
});

router.put('/my/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    Object.assign(booking, req.body);
    await booking.save();
    res.json({ message: 'Booking updated', booking });
  } catch (err) {
    res.status(500).json({ message: 'Error updating booking' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting booking' });
  }
});




module.exports = router;
