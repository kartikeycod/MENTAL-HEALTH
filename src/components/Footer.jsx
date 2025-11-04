// src/components/Footer.jsx
import React from 'react';
import './footer.css'; // 🚀 Import the dedicated CSS file
import logoImage from '../../images/logo.png'; // 💡 Using the same logo as Navbar

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        {/* --- Column 1: Company Info --- */}
        <div className="footer-col company-info">
          <div className="footer-logo">
            <img src={logoImage} alt="Serenium Logo" className="footer-logo-img" />
            <span className="footer-logo-text">Serenium</span>
          </div>
          <p className="company-tagline">
            Your partner in mental wellness, offering compassionate 
            support and innovative tools for a healthier mind.
          </p>
        </div>

        {/* --- Column 2: Quick Links --- */}
        <div className="footer-col quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#doctors">Doctors</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* --- Column 3: Connect With Us --- */}
        <div className="footer-col connect-with-us">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>

      {/* --- Copyright Bar --- */}
      <div className="footer-bottom">
        <p>
          © 2024 Serenium. Designed with <span className="heart-icon">💖</span> by Team Serenium.
        </p>
      </div>
    </footer>
  );
};

export default Footer;