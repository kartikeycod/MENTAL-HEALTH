// AnimatedSection.jsx

import React, { useRef, useEffect, useState } from 'react';
import '../App.css'; // This component still relies on the global CSS for the transition classes

const AnimatedSection = ({ children, delay = 0 }) => {
    const domRef = useRef();
    const [isVisible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(domRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div 
            className={`animated-content ${isVisible ? 'is-visible' : ''}`} 
            ref={domRef}
            style={{ transitionDelay: `${delay}s` }}
        >
            {children}
        </div>
    );
};

export default AnimatedSection;