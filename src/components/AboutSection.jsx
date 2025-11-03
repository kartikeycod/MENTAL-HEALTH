// AboutSection.jsx

import React from 'react';
import AnimatedSection from './AnimatedSection';
import '../App.css';

const AboutSection = () => (
    <section id="about" className="about-section content-padding">
        <div className="about-content-grid">
            <AnimatedSection delay={0.1}>
                <div className="about-visual-card">
                    <div className="visual-graphic"></div>
                </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
                <div className="about-text-content">
                    <div className="section-label">About Aetheria</div>
                    <h2>Why We Are The Next Generation of Health System.</h2>
                    <p>We are a global collective of researchers, clinicians, and technologists committed to a singular goal: maximizing human potential. Our proprietary **Aetheria OS** seamlessly integrates your lifestyle data with your clinical profile, delivering truly personalized, predictive health scores.</p>
                    <p>We believe healthcare should be intuitive, accessible, and proactive—not reactive. Our digital-first approach minimizes friction and empowers you to manage your health destiny.</p>
                    <a href="#portal" className="text-link">Learn about the Aetheria OS Platform →</a>
                </div>
            </AnimatedSection>
        </div>
    </section>
);

export default AboutSection;