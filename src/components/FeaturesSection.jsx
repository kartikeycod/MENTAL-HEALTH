// src/components/FeaturesSection.jsx
import React from 'react';
import './FeaturesSection.css'; // 🚀 Import the dedicated CSS file

// Array of the 8 pillars, including emojis and background color hints
const PILLARS = [
  {
    icon: '🧠',
    title: 'Mental Health Assessment',
    description: 'Understand your mental state with comprehensive, AI-powered evaluations.',
    colorClass: 'feature-blue',
  },
  {
    icon: '🧘‍♀️',
    title: 'Therapy Sessions',
    description: 'Connect with licensed therapists for personalized one-on-one support.',
    colorClass: 'feature-purple',
  },
  {
    icon: '🌿',
    title: 'Yoga Monitoring',
    description: 'Track your progress in yoga and meditation for enhanced mindfulness.',
    colorClass: 'feature-green',
  },
  {
    icon: '💬',
    title: 'Doctor Chatbot',
    description: 'Instant access to a smart AI chatbot for quick advice and guidance.',
    colorClass: 'feature-pink',
  },
  {
    icon: '📈',
    title: 'Progress Dashboard',
    description: 'Visualize your mental wellness journey with interactive dashboards.',
    colorClass: 'feature-yellow',
  },
  {
    icon: '📝',
    title: 'Personalized Prescription',
    description: 'Receive tailored recommendations for self-care and growth.',
    colorClass: 'feature-lightgreen',
  },
  {
    icon: '💖',
    title: 'Self-Care Tips',
    description: 'Access a library of practical tips and exercises for daily well-being.',
    colorClass: 'feature-softpink',
  },
  {
    icon: '😊',
    title: 'Mood Tracking',
    description: 'Log and analyze your moods over time to identify patterns and triggers.',
    colorClass: 'feature-lightblue',
  },
];

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <div className="features-header">
        {/* 🌟 Added an emoji for visual appeal in the title */}
        <h2>8 Pillars of Serenium's Futuristic Care 🌟</h2>
        <p>Serenium offers a diverse range of services designed to support every aspect of your mental well-being.</p>
      </div>

      <div className="features-pillars-grid">
        {PILLARS.map((pillar, index) => (
          <div className={`feature-card ${pillar.colorClass}`} key={index}>
            <div className="feature-card-icon">
              {/* Using emojis as the icon */}
              <span role="img" aria-label={pillar.title}>{pillar.icon}</span>
            </div>
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;