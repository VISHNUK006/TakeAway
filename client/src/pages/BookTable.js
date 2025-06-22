
import React, { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './BookTable.css';


function BookTable() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    message: ''
  });

  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBooking = async (paymentMode, paymentStatus) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/booking',
        { ...form, paymentMode, paymentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg('✅ Booking confirmed! ' + res.data.message);
      setForm({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '',
        message: ''
      });
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Booking failed.'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleBooking('COD', 'Pending');
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleRazorpayForBooking = async () => {
    const res = await loadRazorpayScript();
    if (!res) return toast.error('Razorpay SDK failed');

    const orderRes = await fetch('http://localhost:5000/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 200, receipt: 'receipt_booking_' + Date.now() }),
    });

    const data = await orderRes.json();

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: 'TastyBites',
      description: 'Table Booking Payment',
      order_id: data.id,
      handler: async function (response) {
        const verifyRes = await fetch('http://localhost:5000/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: data.amount / 100,
            receipt: data.receipt,
          }),
        });

        const result = await verifyRes.json();
        if (result.success) {
          await handleBooking('ONLINE', 'Paid');
          toast.success('✅ Table booked & payment successful!');
          navigate('/booking-details');
        } else {
          toast.error('❌ Payment verification failed');
        }
      },
      prefill: {
        name: form.name,
        email: form.email,
      },
      theme: {
        color: '#ffcc00',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <Navbar />
      <div className="container book-table">
        <h2>Book a Table</h2>
        <form className="book-form" onSubmit={handleSubmit}>
          <input name="name" type="text" placeholder="Your Name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
          <input name="time" type="time" value={form.time} onChange={handleChange} required />
          <input name="guests" type="number" placeholder="Number of Guests" value={form.guests} onChange={handleChange} required />
          <textarea name="message" placeholder="Special Request" value={form.message} onChange={handleChange}></textarea>

          <div className="booking-buttons">
            <button type="submit">Book & Pay at Restaurant (COD)</button>
            <button type="button" onClick={handleRazorpayForBooking}>Pay & Book Online</button>
          </div>

          {msg && <p className="message">{msg}</p>}
        </form>
      </div>
    </>
  );
}

export default BookTable;


