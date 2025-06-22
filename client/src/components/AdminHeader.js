import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import './AdminHeader.css';

function AdminHeader() {
  const navigate = useNavigate();
  const { logoutUser } = useContext(AuthContext); 

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    if (logoutUser) logoutUser(); 
    navigate('/login');
  };

  return (
    <header className="admin-header">
      <div className="logo">
        <h2>🍽️ Admin Dashboard</h2>
      </div>
      <nav className="admin-nav">
        <Link to="/">Home</Link>
        <Link to="/admin/dashboard">Dashboard</Link>
        <button type="button" onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}

export default AdminHeader;

