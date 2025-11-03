// Footer.jsx

import React from 'react';
import AnimatedSection from './AnimatedSection';
import '../App.css';

const NAV_LINKS = [
    { text: 'Services', href: '#services' },
    { text: 'Analytics', href: '#analytics' },
    { text: 'Providers', href: '#providers' },
    { text: 'Testimonials', href: '#testimonials' },
    { text: 'Patient Portal', href: '#portal' },
];

const Footer = () => (
    <footer className="footer">
        <div className="footer-content-grid content-padding">
            <div className="footer-brand">
                <span className="logo-text">Aetheria Health</span>
                <p>The future of proactive health management starts here.</p>
            </div>

            <div className="footer-links-group">
                <h4>Core Navigation</h4>
                <ul>
                    {NAV_LINKS.map(link => (
                        <li key={link.text}><a href={link.href}>{link.text}</a></li>
                    ))}
                </ul>
            </div>

            <div className="footer-links-group">
                <h4>Quick Access</h4>
                <ul>
                    <li><a href="#">Urgent Care</a></li>
                    <li><a href="#">Online Billing</a></li>
                    <li><a href="#">Telemedicine Support</a></li>
                    <li><a href="#">Careers</a></li>
                </ul>
            </div>
            
            <div className="footer-bottom-info">
                <h4>Global Support Center</h4>
                <p className="contact-info">
                    24/7 Hotline: +1 (800) 555-AETH<br/>
                    Email: support@aetheria.com
                </p>
                <div className="social-icons">
                    <a href="#" className="social-icon">F</a>
                    <a href="#" className="social-icon">X</a>
                    <a href="#" className="social-icon">I</a>
                </div>
            </div>
        </div>
        <div className="footer-copyright">
            <p>&copy; 2025 Aetheria Health. All rights reserved. | <a href="#">Privacy</a> | <a href="#">Accessibility</a></p>
        </div>
    </footer>
);

export default Footer;