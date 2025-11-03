// InteractiveCTA.jsx

import React from 'react';
import AnimatedSection from './AnimatedSection';
import '../App.css';

const InteractiveCTA = () => (
    <section className="interactive-cta-section">
        <div className="cta-overlay content-padding">
            <AnimatedSection>
                <div className="cta-content">
                    <h2>Symptom Checker: Ask Our AI Health Assistant.</h2>
                    <p>Get instant, triage-level guidance based on millions of clinical data points. Always secure. Always confidential.</p>
                    <div className="cta-form">
                        <input type="text" placeholder="e.g., 'Sudden chest pain and shortness of breath'" />
                        <button className="btn-primary">
                            Check Symptoms
                        </button>
                    </div>
                </div>
            </AnimatedSection>
        </div>
    </section>
);

export default InteractiveCTA;