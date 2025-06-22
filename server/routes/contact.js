const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const contact = new Contact({ name, email, message });
    await contact.save();

    await sendEmail(
      process.env.EMAIL_USER,
      `📨 New Contact Message from ${name}`,
      `<p><strong>Email:</strong> ${email}</p><p>${message}</p>`
    );

    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('❌ Contact form error:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;
