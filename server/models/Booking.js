
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
  name: String,
  email: String,
  phone: String,
  date: Date,
  time: String,
  guests: Number,
  paymentMode: {
  type: String,
  enum: ['COD', 'ONLINE'],
  default: 'COD',
},
paymentStatus: {
  type: String,
  enum: ['Pending', 'Paid'],
  default: 'Pending',
},

  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
