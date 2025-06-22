
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const { loginUser } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);


  const navigate = useNavigate();
  const location = useLocation(); 
  const from = location.state?.from || '/'; 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;

      if (clearCart) clearCart();
      localStorage.setItem('token', token);
      if (loginUser) loginUser(user, token);

      setMsg('✅ Login successful!');
      if (user.role === 'admin') {
       navigate('/admin/dashboard'); 
       } else {
      navigate(from); 
}
    } catch (err) {
      console.error('❌ Login error:', err);
      setMsg('❌ ' + (err.response?.data?.message || err.message || 'Login failed'));
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {msg && <p>{msg}</p>}
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;