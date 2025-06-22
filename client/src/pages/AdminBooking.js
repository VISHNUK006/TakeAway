
import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AdminHeader from '../components/AdminHeader';
import './AdminBooking.css';
import { API_BASE_URL } from '../config';

function AdminBookings() {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  const fetchBookings = useCallback(() => {
    axios
      .get(`${API_BASE_URL}/api/booking/admin/booking`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setBookings(res.data));
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE_URL}/api/booking/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchBookings();
  };

  return (
    <>
      <AdminHeader />
      <div className="admin-containers">
        <h2>📋 Manage Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <ul className="booking-list">
            {bookings.map((b) => (
              <li className="book" key={b._id}>
                <div><strong>Name:</strong> {b.name}</div>
                <div><strong>Email:</strong> {b.email}</div>
                <div><strong>Phone:</strong> {b.phone}</div>
                <div><strong>Date & Time:</strong> {b.date} at {b.time}</div>
                <div><strong>Guests:</strong> {b.guests}</div>
                <div><strong>Payment Mode:</strong> {b.paymentMode || 'N/A'}</div>
                <div><strong>Payment Status:</strong> {b.paymentStatus || 'Pending'}</div>
                {b.message && <div><strong>Message:</strong> {b.message}</div>}
                <button onClick={() => handleDelete(b._id)}>🗑️ Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default AdminBookings;
