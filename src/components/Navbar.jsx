// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const NAV_LINKS = [
  { text: 'Services', href: '#services' },
  { text: 'Analytics', href: '#analytics' },
  { text: 'Providers', href: '#providers' },
  { text: 'Testimonials', href: '#testimonials' },
  { text: 'Patient Portal', href: '#portal' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.name) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('detailsFilled');
    setUser(null);
    navigate('/');
  };

  // ✅ Handle Enter Details Button Click
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
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <span className="logo-text">Aetheria Health</span>
      </div>

      <div className="navbar-center">
        {NAV_LINKS.map((link) => (
          <div key={link.text} className="nav-item">
            <a href={link.href} className="nav-link">
              {link.text}
            </a>
          </div>
        ))}
      </div>

      <div className="navbar-right">
        {/* 🟣 New "Enter Details" Button */}
        <button
          onClick={handleEnterDetails}
          style={{
            backgroundColor: '#b19cd9',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 14px',
            marginRight: '10px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          Enter Details
        </button>

        {!user ? (
          <button
            className="btn-secondary"
            onClick={() => navigate('/auth')}
          >
            Patient Login
          </button>
        ) : (
          <>
            <span
              style={{
                marginRight: '12px',
                color: '#4b0082',
                fontWeight: '600',
                textTransform: 'capitalize',
              }}
            >
              👤 {user.name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #b19cd9',
                borderRadius: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
                color: '#4b0082',
                fontWeight: '500',
              }}
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
