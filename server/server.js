// server.js
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


// Route files
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bookingRoutes = require('./routes/booking');
const contactRoutes = require('./routes/contact');
const paymentRoutes = require('./routes/payment');

// dotenv.config();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

//  Middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static('public/images'));

//  Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payment', paymentRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(' MongoDB Connected');
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error(' MongoDB Connection Failed:', err.message);
});

//  404 Handler - unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

//  Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(' Unhandled Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});



