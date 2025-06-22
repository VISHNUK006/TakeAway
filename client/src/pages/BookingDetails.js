
import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import './BookingDetails.css';

function BookingDetails() {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [msg, setMsg] = useState('');

    const fetchBookings = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/booking/mybooking', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]); 

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleEditClick = (booking) => {
    setEditingId(booking._id);
    setEditForm({
      date: booking.date?.substring(0, 10),
      time: booking.time,
      guests: booking.guests,
      message: booking.message || ''
    });
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/booking/my/${editingId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingId(null);
      fetchBookings();
      setMsg('✅ Booking updated');
    } catch (err) {
      setMsg('❌ Failed to update booking');
    }
  };

    const handleCancel = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/booking/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg('✅ Booking cancelled');
      fetchBookings();
    } catch (err) {
      setMsg('❌ Failed to cancel booking');
      console.error(err);
    }
  };

  return (
    <>
    <Navbar />
    <div className="book-container">
      <h2>📅 My Bookings</h2>
      {msg && <p className="message">{msg}</p>}
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="booking-list">
          {bookings.map((booking) => (
            <li key={booking._id} className="booking-item">
              {editingId === booking._id ? (
                <>
                  <input type="date" name="date" value={editForm.date} onChange={handleChange} />
                  <input type="time" name="time" value={editForm.time} onChange={handleChange} />
                  <input type="number" name="guests" value={editForm.guests} onChange={handleChange} />
                  <textarea name="message" value={editForm.message} onChange={handleChange}></textarea>
                  <button onClick={handleSave}>💾 Save</button>
                </>
              ) : (
                <>
                  <p><strong>Date:</strong> {booking.date?.substring(0, 10)}</p>
                  <p><strong>Time:</strong> {booking.time}</p>
                  <p><strong>Guests:</strong> {booking.guests}</p>
                  <p><strong>Note:</strong> {booking.message}</p>
                  <p><strong>Payment Mode:</strong> {booking.paymentMode}</p>
                  <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
                  <div className="button-group">
                  <button onClick={() => handleEditClick(booking)}>✏️ Edit</button>
                  <button className="cancel-btn" onClick={() => handleCancel(booking._id)}>❌ Cancel</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );
}

export default BookingDetails;
