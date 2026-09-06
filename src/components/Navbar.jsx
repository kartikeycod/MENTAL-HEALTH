import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logoImage from '../../images/logo.png';
import './Navbar.css';
import '../App.css';
import { useAuth } from '../hooks/useAuth';
import {
  getStoredUser,
  getDetailsFilled,
} from '../utils/storage/storageHelpers';
import { ROUTES } from '../constants/routes';

const NAV_LINKS = [
  { text: 'Home', path: ROUTES.HOME },
  { text: 'AI Detector', path: ROUTES.AI_DETECTOR },
  { text: 'Find Therapists', path: ROUTES.THERAPISTS },
  { text: 'AI Proctor', path: ROUTES.AI_PROCTOR },
  { text: 'Assessment', path: ROUTES.ASSESSMENT },
  { text: 'Plans', path: ROUTES.PLAN }
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user: authUser, profile, logout, isAdmin, isDoctor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = getStoredUser();
  const activeUser = authUser || storedUser;
  const displayName = profile?.displayName || authUser?.displayName || storedUser?.name || authUser?.email?.split('@')[0];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  const handleEnterDetails = () => {
    const isLoggedIn = !!activeUser;
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

  const getDashboardPath = () => {
    if (isAdmin) return ROUTES.ADMIN;
    if (isDoctor && profile?.roles?.doctor) return ROUTES.DOCTOR_DASHBOARD;
    return ROUTES.PATIENT_DASHBOARD;
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left logo-container" onClick={() => navigate(ROUTES.HOME)} style={{ cursor: 'pointer' }}>
        <span className="logo-text">
          <img src={logoImage} alt="Serenium Logo" />
          Serenium
        </span>
      </div>

      <div className="navbar-center">
        {NAV_LINKS.map((link) => (
          <div key={link.text} className="nav-item">
            {link.path ? (
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
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

        {!activeUser ? (
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
            <button
              className="btn-secondary-nav"
              onClick={() => navigate(getDashboardPath())}
              style={{ fontWeight: 600 }}
            >
              Dashboard
            </button>
            <span className="user-name" title={activeUser.email}>
              👤 {displayName || 'User'}
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