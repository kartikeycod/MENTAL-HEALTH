// src/components/Assure.jsx
import React from 'react';
import './Assure.css'; // 🚀 Import the dedicated CSS file

// Array of features with manually updated, specific Font Awesome icon classes
const FEATURES = [
  {
    // 🔒 Updated to fa-shield-alt for security emphasis
    iconClass: 'fas fa-shield-alt', 
    title: 'Data Security',
    description: 'Your privacy is our priority. We ensure top-notch encryption and data protection for all your information.',
  },
  {
    // 🤝 Updated to fa-hands-helping for a more personal support feel
    iconClass: 'fas fa-hands-helping', 
    title: '24/7 Support',
    description: 'Get assistance whenever you need it. Our support team is available around the clock to help you.',
  },
  {
    // 🤖 Keeping fa-robot, which is excellent for AI Chatbot
    iconClass: 'fas fa-robot', 
    title: 'Smart AI Chatbot',
    description: 'Engage with our intelligent AI chatbot for instant support, guided exercises, and emotional check-ins.',
  },
  {
    // ♿ Keeping fa-universal-access, perfect for accessibility
    iconClass: 'fas fa-universal-access', 
    title: 'WCAG AA Accessible',
    description: 'Enim laboris minim consectetur proident minim commodo ipsum pariatur. Magna pariatur exercitation officia qui laborum duis velit sint culp', // Placeholder text from image
  },
  {
    // 📈 Updated to fa-chart-line for report/data visualization
    iconClass: 'fas fa-chart-line', 
    title: 'Personalized Reports',
    description: 'Incididunt excepteur Lorem ea aute et elit consectetur. Qui non ipsum dolor esse duis ea dolor consectetur duis officia irure ut.Elit enim ad', // Placeholder text from image
  },
  {
    //  Updated to fa-certificate for certification/official recognition
    iconClass: 'fas fa-certificate', 
    title: 'ISO 27001 CERTIFIED',
    description: 'Ex ipsum enim et ad amet aliqua in officia irure. Duis proident eu magna aute occaecat cillum cillu', // Placeholder text from image
  },
];

const AssureSection = () => {
  return (
    <section className="assure-section">
      <div className="assure-header">
        <h2>Our Promise of Safety and Support</h2>
        <p>Serenium provides a comprehensive suite of tools designed to support your mental health journey with innovation and care.</p>
      </div>

      <div className="assure-features-grid">
        {FEATURES.map((feature, index) => (
          <div className="assure-card" key={index}>
            <div className="assure-card-icon">
              {/* The <i> tag uses the manually entered iconClass */}
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