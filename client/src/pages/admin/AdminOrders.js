import React, { useEffect, useState, useContext } from 'react';
import { useCallback } from 'react'; 
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader';
import './AdminOrders.css';

function AdminOrders() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState({}); 

  const fetchOrders = useCallback(async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/admin/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setOrders(res.data.reverse());
    setMsg('');
  } catch (err) {
    console.error('❌ Fetch orders error:', err.response?.data || err.message);
    setMsg('❌ Failed to load orders');
  }
}, [token]);

useEffect(() => {
  if (!user || user.role !== 'admin') {
    console.log('🔒 Access denied or no user');
    navigate('/');
    return;
  }

  fetchOrders();
}, [user, navigate, fetchOrders]);


  const handleStatusChange = (orderId, newStatus) => {
    setUpdatingStatus((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  const updateStatus = async (orderId) => {
    const newStatus = updatingStatus[orderId];
    try {
      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMsg('✅ Order status updated');
      fetchOrders(); 
    } catch (err) {
      console.error('❌ Update error:', err.response?.data || err.message);
      setMsg('❌ Failed to update order status');
    }
  };

  return (
    <>
    < AdminHeader />
    <div className="admin-orders">
      <h2>📦 All Orders</h2>
      {msg && <p className="msg">{msg}</p>}

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-cards">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>User:</strong> {order.userId?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {order.userId?.email || 'N/A'}</p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Payment Mode:</strong> {order.paymentMode || 'N/A'}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus || 'Pending'}</p>
              <p><strong>Status:</strong> {order.status}</p>

              <label>
                <strong>Update Status:</strong>
                <select
                  value={updatingStatus[order._id] || order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </label>
              <button onClick={() => updateStatus(order._id)}>Update</button>

              <h4>Items:</h4>
              <ul>
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.menuItem?.name || 'unknown'} x {item.qty} (₹{item.menuItem?.price || 0})
                  </li>
                ))}
              </ul>
              <p><strong>Placed At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

export default AdminOrders;

