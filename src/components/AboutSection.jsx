// src/components/About.jsx
import React from 'react';
import './About.css'; // 🚀 Import the dedicated CSS file

// Data for the team members
const TEAM_MEMBERS = [
  {
    name: 'Dr. Evelyn Reed',
    title: 'Clinical Psychologist',
    // 💡 Placeholder URL for a random person image (replace with actual photo)
    imageUrl: 'https://i.ibb.co/L95m42G/female-doctor-1.jpg',
  },
  {
    name: 'Dr. Marcus Thorne',
    title: 'Psychiatrist, CBT Specialist',
    imageUrl: 'https://i.ibb.co/3WqP4X0/male-doctor-1.jpg',
  },
  {
    name: 'Dr. Lena Khan',
    title: 'Therapist, Mindfulness Expert',
    imageUrl: 'https://i.ibb.co/hK8bB9q/female-doctor-2.jpg',
  },
  {
    name: 'Dr. Samuel Lee',
    title: 'Counseling Psychologist',
    imageUrl: 'https://i.ibb.co/f2P9bSg/male-doctor-2.jpg',
  },
  {
    name: 'Dr. Chloe Adams',
    title: 'Child & Adolescent Therapist',
    imageUrl: 'https://i.ibb.co/8Yj0c0K/female-doctor-3.jpg',
  },
  {
    name: 'Dr. Benjamin Carter',
    title: 'Trauma Specialist',
    imageUrl: 'https://i.ibb.co/r71r6S7/male-doctor-3.jpg',
  },
];

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-header">
        <h2>Meet Our Dedicated Team</h2>
        <p>
          Our diverse team of experienced doctors and therapists is here to guide you on your 
          journey to mental wellness. Each professional brings unique expertise and a 
          compassionate approach to care.
        </p>
      </div>

      <div className="team-grid">
        {TEAM_MEMBERS.map((member, index) => (
          <div className="team-card" key={index}>
            <div className="member-photo-container">
              <img 
                src={member.imageUrl} 
                alt={`Photo of ${member.name}`} 
                className="member-photo"
              />
            </div>
            <h3 className="member-name">{member.name}</h3>
            <p className="member-title">{member.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;