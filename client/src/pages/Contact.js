import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Contact.css';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/contact', form);
      setMsg('✅ ' + res.data.message);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setMsg('❌ Failed to send message');
    }
  };

  return (
    <>
      <Navbar />
      <div className="contact-container">
        <h2>
         <span role="img" aria-label="mail">📨</span> 
         <span>Contact Us</span>
        </h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <input name="name" type="text" placeholder="Your Name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
          <textarea name="message" placeholder="Your Message" value={form.message} onChange={handleChange} required />
          <button type="submit">Send Message</button>
        </form>
        {msg && <p className="message">{msg}</p>}
      </div>
    </>
  );
}

export default Contact;
