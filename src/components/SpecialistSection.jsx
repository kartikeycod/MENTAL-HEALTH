// SpecialistSection.jsx

import React from 'react';
import AnimatedSection from './AnimatedSection';
import '../App.css';

const SPECIALISTS = [
    { name: 'Dr. E. Thorne', title: 'Lead Neuroscientist (AI)', image: 'https://i.ibb.co/k2V405b/doc1.png' },
    { name: 'Dr. J. Nova', title: 'Cardiology Specialist', image: 'https://i.ibb.co/f4N01L5/doc2.png' },
    { name: 'Dr. L. Kael', title: 'Oncology & Precision Med.', image: 'https://i.ibb.co/xH5r8wF/doc3.png' },
    { name: 'Dr. C. Rhodes', title: 'Virtual Care Director', image: 'https://i.ibb.co/q5k2624/avatar2.png' },
];

const SpecialistSection = () => (
    <section id="providers" className="specialist-section content-padding">
        <AnimatedSection>
            <div className="text-center-header">
                <div className="section-label">Our Providers</div>
                <h2>Meet Our Pioneers of Medicine</h2>
                <p className="feature-subtitle">World-class specialists, accessible from anywhere, leading innovation in their respective fields.</p>
            </div>
        </AnimatedSection>
        
        <div className="specialist-grid">
            {SPECIALISTS.map((specialist, index) => (
                <AnimatedSection key={index} delay={0.1 + index * 0.1}>
                    <div className="specialist-card">
                        <div className="specialist-image" style={{backgroundImage: `url(${specialist.image})`}}></div>
                        <h3 className="specialist-name">{specialist.name}</h3>
                        <p className="specialist-title">{specialist.title}</p>
                        <button className="view-profile-btn">View Profile</button>
                    </div>
                </AnimatedSection>
            ))}
        </div>
    </section>
);

export default SpecialistSection;