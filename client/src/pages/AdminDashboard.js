
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './AdminDashboard.css';
import { API_BASE_URL } from '../config';

function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const dashboardRes = await axios.get(`${API_BASE_URL}/api/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage(dashboardRes.data.message);

        const summaryRes = await axios.get(`${API_BASE_URL}/api/admin/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSummary(summaryRes.data);
      } catch (err) {
        setError('Access denied. You are not authorized.');
        console.error(err);
      }
    };

    fetchDashboard();
  }, [user, token, navigate]);

  const chartData = summary
    ? [
        { name: 'Pending', value: summary.pendingOrders },
        { name: 'Delivered', value: summary.deliveredOrders },
      ]
    : [];

  const COLORS = ['#ffcc00', '#00cc99'];

  return (
    <>
      <AdminHeader />
      <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        {summary && (
          <>
            <div className="dashboard-summary">
              <div className="summary-card">👥 Users: {summary.totalUsers}</div>
              <div className="summary-card">📦 Orders: {summary.totalOrders}</div>
              <div className="summary-card">🍽️ Menu Items: {summary.totalMenuItems}</div>
              <div className="summary-card">⏳ Pending Orders: {summary.pendingOrders}</div>
              <div className="summary-card">✅ Delivered Orders: {summary.deliveredOrders}</div>
            </div>

            <div className="chart-container">
              <h3>Order Status Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        <div className="admin-actions">
          <button onClick={() => navigate('/admin/menu')}>Manage Menu</button>
          <button onClick={() => navigate('/admin/booking')}>Manage bookings</button>
          <button onClick={() => navigate('/admin/orders')}>Manage Orders</button>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;

