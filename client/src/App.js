
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Login from './pages/Login';
import Register from './pages/register';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/Orders';
import AdminRoute from './routes/AdminRoute'; 
import AdminDashboard from './pages/AdminDashboard';
import AdminMenu from './pages/AdminMenu';
import AdminOrders from './pages/admin/AdminOrders';
import TrackOrder from './pages/TrackOrder';
import About from './pages/About';
import BookTable from './pages/BookTable';
import BookingDetails from './pages/BookingDetails';
import AdminBookings from './pages/AdminBooking';
import Contact from './pages/Contact';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; // 

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/menu" element={<AdminMenu />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/track-order/:id" element={<TrackOrder />} />
        <Route path="/about" element={<About />} />
        <Route path="/book" element={<BookTable />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="/admin/booking" element={<AdminBookings />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
       <ToastContainer position="top-center" />
    </AuthProvider>
  );
}

