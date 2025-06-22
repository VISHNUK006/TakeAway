import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, token } = useContext(AuthContext);

  if (!token || !user || user.role !== 'admin') {
    return <Navigate to="/" replace />; 
  }

  return children;
};

export default AdminRoute;
