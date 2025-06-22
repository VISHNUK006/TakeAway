import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './TrackOrder.css';
import { API_BASE_URL } from '../config'; // Assuming you have a config file for API base URL

function TrackOrder() {
  const { id } = useParams(); 
  const { token } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const statusSteps = [
    'Pending',
    'Preparing',
    'Out for Delivery',
    'Delivered'
  ];

  const statusIcons = {
    'Pending': '🕓',
    'Preparing': '👨‍🍳',
    'Out for Delivery': '🛵',
    'Delivered': '✅'
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        setError('❌ Failed to load order');
      }
    };

    fetchOrder();
  }, [id, token]);

  const getCurrentStepIndex = () => {
    return statusSteps.indexOf(order?.status);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>📍 Track Order</h2>
        {error && <p className="error">{error}</p>}

        {!order ? (
          <p>Loading...</p>
        ) : (
          <div className="order-info">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Address:</strong> {order.address}</p>

            <div className="status-progress">
              {statusSteps.map((step, i) => {
                const isActive = i <= getCurrentStepIndex();
                const stepKey = step.toLowerCase().replace(/\s+/g, '-');
                return (
                  <React.Fragment key={i}>
                    <div className={`step ${stepKey} ${isActive ? 'active' : ''}`}>
                      <div className="circle">{i + 1}</div>
                      <div className="label">
                        <span className="icon">{statusIcons[step]}</span> {step}
                      </div>
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`line ${i < getCurrentStepIndex() ? 'active' : ''}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default TrackOrder;

