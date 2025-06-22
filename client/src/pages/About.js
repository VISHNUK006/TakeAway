import React from 'react';
import Navbar from '../components/Navbar';
import './About.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faEnvelope, faMapMarkerAlt, faGlobe} from '@fortawesome/free-solid-svg-icons';

function About() {
  return (
    <>
    <Navbar />
    <div className="page-wrapper">
    <div className="container about-page">
      <h2>About TastyBites</h2>
      <p>
        At <strong>TastyBites</strong>, we believe that great food doesn’t have to be complicated. We are a modern fast-food restaurant committed to serving delicious, freshly prepared meals that satisfy both hunger and taste. Whether you're on a quick lunch break or enjoying a casual dinner with friends, we deliver the perfect combination of speed, flavor, and value.
      </p>
      <p>
        From juicy burgers and crispy fries to sizzling wraps, zesty wings, and refreshing beverages, our diverse menu is crafted to please every palate. Every dish is made with high-quality ingredients, cooked to perfection, and served with a smile.
      </p>
      <h3>Why Choose Us</h3>
      <p>
        ✅ Quick Service without compromising on taste or freshness
      </p>
      <p>
        👨‍🍳 Experienced chefs who understand the art of comfort food
      </p>
      <p>
        🍟 A menu full of classic favorites and modern twists
      </p>
      <p>
        🏆 Clean, vibrant atmosphere designed for comfort and convenience
      </p>
      <p>
        🚚 Fast delivery & takeaway options for your busy lifestyle
      </p>
      <h3>
        At TastyBites, fast food is more than a meal — it's a moment of joy. Come hungry, leave happy.
      </h3>
      <div className="contact-details">
        <h3>📞 Contact Us</h3>
        <p><FontAwesomeIcon icon={faPhone} /> +91 1234567890</p>
        <p><FontAwesomeIcon icon={faEnvelope} /> support@tastybites.com</p>
        <p><FontAwesomeIcon icon={faMapMarkerAlt} /> 123 Food Street, Chennai, India</p>
      </div>
      <div className="social-icons">
        <div className="social-label">
          <FontAwesomeIcon icon={faGlobe} /> <span>Follow Us</span>
        </div>
        <div className="icons">
        <a href="https://facebook.com" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faFacebook} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
      </div>
    </div>
    </div>
    </div>

    </>
  );
}

export default About;

