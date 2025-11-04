// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../images/logo.png'; // Your logo import
import './Navbar.css'; // 🚀 NEW: Import the dedicated CSS file
import '../App.css'; 

// Links matching the image UI
const NAV_LINKS_UI = [
  { text: 'Home', href: '/' },
  { text: 'About', href: '#about' },
  { text: 'Services', href: '#services' },
  { text: 'Doctors', href: '#doctors' },
  { text: 'Reviews', href: '#reviews' },
  { text: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // --- LOGIC: SCROLL EFFECT (KEPT INTACT) ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- LOGIC: USER STATE (KEPT INTACT) ---
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.name) {
      setUser(storedUser);
    }
  }, []);

  // --- LOGIC: LOGOUT (KEPT INTACT) ---
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('detailsFilled');
    setUser(null);
    navigate('/');
  };

  // --- LOGIC: ENTER DETAILS (KEPT INTACT) ---
  const handleEnterDetails = () => {
    const isLoggedIn = !!localStorage.getItem('user');
    const detailsFilled = localStorage.getItem('detailsFilled');

    if (!isLoggedIn) {
      alert('⚠️ Please log in first.');
      navigate('/auth');
    } else if (detailsFilled === 'true') {
      alert('✅ You have already filled your details.');
    } else {
      navigate('/form');
    }
  };


  return (
    <nav 
      // Using the class for the main navigation container
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      // Removed ALL inline styles from the nav tag
    >
      <div className="navbar-left logo-container">
        <span className="logo-text">
          <img 
            src={logoImage} 
            alt="Serenium Logo" 
            // Removed inline styles for img and moved them to .logo-text img in Navbar.css
          />
          Serenium 
        </span>
      </div>

      <div className="navbar-center">
        {NAV_LINKS_UI.map((link) => (
          <div key={link.text} className="nav-item">
            <a href={link.href} className="nav-link">
              {link.text}
            </a>
          </div>
        ))}
      </div>

      <div className="navbar-right">
        
        {/* Enter Details Button */}
        <button
          onClick={handleEnterDetails}
          className="btn-enter-details"
          // Removed inline styles
        >
          Enter Details
        </button>

        {!user ? (
          <>
            {/* Login Button (Secondary style) */}
            <button
              className="btn-secondary-nav"
              onClick={() => navigate('/auth')}
            >
              Login
            </button>
            {/* Sign Up Button (Primary style) */}
            <button
              className="btn-primary-nav"
              onClick={() => navigate('/auth?signup=true')}
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            {/* User Name Display */}
            <span className="user-name">
              👤 {user.name}
            </span>
            {/* Logout Button (Secondary style) */}
            <button
              onClick={handleLogout}
              className="btn-secondary-nav"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;