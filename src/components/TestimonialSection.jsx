// TestimonialSection.jsx

import React from 'react';
import AnimatedSection from './AnimatedSection';
import '../App.css';

const TESTIMONIALS_DATA = [
    { quote: "Aetheria's predictive analytics caught an issue my previous doctors missed. Truly the future of health.", author: "Alex R.", condition: "Cardiology" },
    { quote: "The virtual consults are seamless, secure, and incredibly efficient. Best healthcare portal experience I've ever had.", author: "Sara J.", condition: "Telehealth" },
    { quote: "The personalized genomic report gave me actionable steps to improve my longevity. Highly recommend their precision medicine.", author: "Dr. Ben K.", condition: "Genomics" },
    { quote: "Finding a specialist and booking an appointment took less than two minutes. The user experience is phenomenal.", author: "Michael P.", condition: "General Wellness" },
];

const TestimonialSection = () => (
    <section id="testimonials" className="testimonial-section content-padding">
        <AnimatedSection>
            <div className="text-center-header">
                <div className="section-label">What Our Users Say About Us</div>
                <h2>Trusted By Leaders in Digital Health</h2>
                <p className="feature-subtitle">Hear genuine feedback from patients and partners who have experienced the Aetheria difference.</p>
            </div>
        </AnimatedSection>

        <div className="testimonial-grid">
            {TESTIMONIALS_DATA.map((testimonial, index) => (
                <AnimatedSection key={index} delay={0.1 + index * 0.1}>
                    <div className="testimonial-card">
                        <span className="quote-icon">❝</span>
                        <p className="testimonial-quote">{testimonial.quote}</p>
                        <div className="testimonial-author-info">
                            <h4 className="author-name">{testimonial.author}</h4>
                            <p className="author-condition">{testimonial.condition}</p>
                        </div>
                    </div>
                </AnimatedSection>
            ))}
        </div>
    </section>
);

export default TestimonialSection;