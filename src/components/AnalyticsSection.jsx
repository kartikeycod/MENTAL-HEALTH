// AnalyticsSection.jsx

import React from 'react';
import AnimatedSection from './AnimatedSection';
import '../App.css';

const AnalyticsSection = () => (
    <section id="analytics" className="analytics-section content-padding">
        <div className="analytics-grid">
            <AnimatedSection delay={0.1}>
                <div className="analytics-text-content">
                    <div className="section-label">User Proctoring & Analytics</div>
                    <h2>Your Digital Health Dashboard: Intuitive and Proactive.</h2>
                    <p>Gain deep insight into your wellness trends, risk factors, and progress. Our analytics platform is designed to turn complex health data into simple, actionable goals.</p>
                    <ul>
                        <li><span className="bullet-icon">✓</span> Predictive Risk Scores</li>
                        <li><span className="bullet-icon">✓</span> Personalized Longevity Trajectories</li>
                        <li><span className="bullet-icon">✓</span> Secure Data Export & Sharing</li>
                    </ul>
                    <button className="btn-primary">
                        Access Live Dashboard Demo
                    </button>
                </div>
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
                <div className="analytics-visual-panel">
                    <div className="chart-placeholder">
                        <p>Wellness Trajectory: +12% YoY</p>
                    </div>
                    <div className="mini-stat-card">
                        <span className="stat-value">85</span>
                        <span className="stat-label">Health Score</span>
                    </div>
                </div>
            </AnimatedSection>
        </div>
    </section>
);

export default AnalyticsSection;