// src/components/Assure.jsx
import React from 'react';
import './Assure.css'; // 🚀 Import the dedicated CSS file

// Array of features with meaningful, specific content
const FEATURES = [
  {
    iconClass: 'fas fa-shield-alt', 
    title: 'Data Security',
    description:
      'Your privacy is sacred. Serenium implements multi-layer encryption and HIPAA-compliant standards to safeguard your mental wellness data at every step.',
  },
  {
    iconClass: 'fas fa-hands-helping', 
    title: '24/7 Support',
    description:
      'We’re here whenever you need a hand. Access professional guidance, AI-driven insights, or connect with experts round the clock—because care shouldn’t wait.',
  },
  {
    iconClass: 'fas fa-robot', 
    title: 'Smart AI Chatbot',
    description:
      'Experience conversational healing with our empathetic AI assistant. It listens, guides mindfulness sessions, and checks in on your emotional state with compassion and intelligence.',
  },
  {
    iconClass: 'fas fa-universal-access', 
    title: 'GAD-7 & PHQ-9 Tools + MBTI',
    description:
      'Understand yourself better with validated psychological tools like GAD-7, PHQ-9, and MBTI assessments—offering deep insights into your mood, anxiety, and personality patterns.',
  },
  {
    iconClass: 'fas fa-chart-line', 
    title: 'Personalized Reports',
    description:
      'Track your emotional growth through real-time analytics and visual progress charts. Get actionable feedback and data-backed recommendations tailored to your well-being.',
  },
  {
    iconClass: 'fas fa-certificate', 
    title: 'WHO Certified',
    description:
      'Built on global mental health standards, Serenium follows WHO-recommended frameworks, ensuring credibility, safety, and ethical AI wellness practices.',
  },
];

const AssureSection = () => {
  return (
    <section className="assure-section">
      <div className="assure-header">
        <h2>Our Promise of Safety and Support</h2>
        <p>
          Serenium provides a comprehensive suite of tools designed to support your mental health journey with innovation, empathy, and scientifically-backed assessments.
        </p>
      </div>

      <div className="assure-features-grid">
        {FEATURES.map((feature, index) => (
          <div className="assure-card" key={index}>
            <div className="assure-card-icon">
              <i className={feature.iconClass}></i>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AssureSection;
