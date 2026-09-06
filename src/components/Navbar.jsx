import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImage from '../../images/logo.png';
import './Navbar.css';
import '../App.css';
import {
  getStoredUser,
  removeStoredUser,
  removeDetailsFilled,
  getDetailsFilled,
} from '../utils/storage/storageHelpers';
import { ROUTES } from '../constants/routes';

const NAV_LINKS_UI = [
  { text: 'Home', href: '/' },
  { text: '🤖 AI Detector', href: ROUTES.AI_DETECTOR, isRoute: true },
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser && storedUser.name) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    removeStoredUser();
    removeDetailsFilled();
    setUser(null);
    navigate(ROUTES.HOME);
  };

  const handleEnterDetails = () => {
    const isLoggedIn = !!getStoredUser();
    const detailsFilled = getDetailsFilled();

    if (!isLoggedIn) {
      alert('⚠️ Please log in first.');
      navigate(ROUTES.AUTH);
    } else if (detailsFilled) {
      alert('✅ You have already filled your details.');
    } else {
      navigate(ROUTES.FORM);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left logo-container">
        <span className="logo-text">
          <img src={logoImage} alt="Serenium Logo" />
          Serenium
        </span>
      </div>

      <div className="navbar-center">
        {NAV_LINKS_UI.map((link) => (
          <div key={link.text} className="nav-item">
            {link.isRoute ? (
              <Link to={link.href} className="nav-link">
                {link.text}
              </Link>
            ) : (
              <a href={link.href} className="nav-link">
                {link.text}
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="navbar-right">
        <button onClick={handleEnterDetails} className="btn-enter-details">
          Enter Details
        </button>

        {!user ? (
          <>
            <button
              className="btn-secondary-nav"
              onClick={() => navigate(ROUTES.AUTH)}
            >
              Login
            </button>
            <button
              className="btn-primary-nav"
              onClick={() => navigate(`${ROUTES.AUTH}?signup=true`)}
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            <span className="user-name">
              👤 {user.name}
            </span>
            <button onClick={handleLogout} className="btn-secondary-nav">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;