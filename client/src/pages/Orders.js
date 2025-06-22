import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './OrderHistory.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login'; 
    return;
  }

  fetch('http://localhost:5000/api/orders', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      return res.json();
    })
    .then((data) => setOrders(data))
    .catch((err) => console.error('Order fetch error:', err));
}, []);


  return (
    <>
    <Navbar />
    <div className="container">
      <div className="orders-container">
        <h2 className="section-title">
         <i className="fas fa-receipt"></i> Your Order History
        </h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map((order, index) => (
            <div className="order-card" key={index}>
              <p><strong>Order #{index + 1}</strong></p>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.menuItem?.name || 'Unknown'}</strong> × {item.qty}
                    <br />
                    <span className="category">
                      Category: {item.menuItem?.category || 'N/A'}
                    </span>
                    <br />
                    <span className="price">Price: ₹{item.menuItem?.price || 'N/A'}</span>
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Payment Mode:</strong> {order.paymentMode || 'N/A'}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus || 'Pending'}</p>
              {order.coordinates && (
                <p>
                  <strong>Coordinates:</strong> 
                  Lat: {order.coordinates.lat}, Lng: {order.coordinates.lng}
                </p>
              )}
              <button onClick={() => navigate(`/track-order/${order._id}`)}>
                   Track Order
              </button>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
}

export default Orders;


