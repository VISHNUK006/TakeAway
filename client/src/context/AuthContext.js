
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const loginUser = (user, token) => {
  setUser(user);
  setToken(token);
  setIsLoggedIn(true);
  localStorage.setItem('token', token);
};

  const logoutUser = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axios
        .get(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((res) => {
          loginUser(res.data, storedToken);
        })
        .catch(() => {
          logoutUser(); 
        });
    }
  }, []); 

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
