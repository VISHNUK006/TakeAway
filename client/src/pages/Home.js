
import React from 'react';
import Navbar from '../components/Navbar';
import './Home.css';

function Home() {
  return (
    <div className="Container">
      
      <section className="home-hero">
        <Navbar />
        <div className="home-text">
          <h1 className="hero-title">Fast Food Restaurant</h1>
          <p className="hero-subtitle">
            Welcome to <strong>TastyBites</strong> – where flavor meets passion. We are a fast-food brand dedicated to delivering mouthwatering meals made from the freshest ingredients.Founded with the mission to serve quick, delicious, and affordable food, our chefs craft each dish with love and creativity. Whether you're craving burgers, fries, or something new, Feane has something special for every taste bud.
          </p>
          <a href="/menu" className="menu-button">Order Now</a>
        </div>
      </section>
      <footer className="footer">
  <div className="footer-container">
    <div className="footer-brand">
      <h2>TastyBites 🍔</h2>
      <p>Fast, fresh & delicious. Order your favorites now!</p>
    </div>

    <div className="footer-links">
      <a href="/">Home</a>
      <a href="/menu">Menu</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </div>

    <div className="footer-social">
      <a href="https://facebook.com"><i className="fab fa-facebook-f"></i></a>
      <a href="https://instagram.com"><i className="fab fa-instagram"></i></a>
      <a href="https://twitter.com"><i className="fab fa-twitter"></i></a>
    </div>
  </div>

  <div className="footer-bottom">
    <p>&copy; {new Date().getFullYear()} TastyBites. All rights reserved.</p>
  </div>
</footer>

    </div>
  );
}

export default Home;

