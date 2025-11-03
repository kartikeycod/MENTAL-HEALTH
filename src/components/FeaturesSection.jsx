// FeaturesSection.jsx

import React from 'react';
import AnimatedSection from './AnimatedSection';
import '../App.css';

const CORE_SERVICES = [
    { icon: '🧠', title: 'AI Diagnostics Engine', description: 'Real-time analysis of medical images and lab results with 98% accuracy.' },
    { icon: '🌐', title: 'Telehealth Consults', description: 'Schedule video appointments instantly with specialists across the globe.' },
    { icon: '🧬', title: 'Genomic Profiling', description: 'Personalized treatment plans based on your unique genetic blueprint.' },
    { icon: '🤖', title: 'Robotic Surgery', description: 'Minimally invasive procedures for faster recovery and reduced risk.' },
    { icon: '🔒', title: 'Secure Health Records', description: 'Encrypted, blockchain-backed patient data accessible only by you.' },
    { icon: '📈', title: 'Predictive Wellness', description: 'Wearable data integration to predict and prevent future health issues.' },
];

const FeaturesSection = () => (
    <section id="services" className="features-section content-padding">
        <AnimatedSection>
            <div className="text-center-header">
                <div className="section-label">Core Services & Technology</div>
                <h2>6 Pillars of Aetheria's Futuristic Care</h2>
                <p className="feature-subtitle">Our services merge cutting-edge research with compassionate human insight.</p>
            </div>
        </AnimatedSection>
        
        <div className="features-grid">
            {CORE_SERVICES.map((service, index) => (
                <AnimatedSection key={index} delay={0.1 + index * 0.08}>
                    <div className="feature-card">
                        <div className="card-icon">{service.icon}</div>
                        <h3 className="card-title">{service.title}</h3>
                        <p className="card-description">{service.description}</p>
                    </div>
                </AnimatedSection>
            ))}
        </div>
    </section>
);

export default FeaturesSection;