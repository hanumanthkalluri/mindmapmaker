import React, { useEffect, useRef } from 'react';

const BackgroundParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 3 + 1;
      const startX = Math.random() * window.innerWidth;
      const duration = Math.random() * 15 + 10;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${startX}px`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      // Random colors for particles
      const colors = ['rgba(0, 245, 255, 0.3)', 'rgba(0, 102, 255, 0.3)', 'rgba(255, 0, 255, 0.2)'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      container.appendChild(particle);
      
      setTimeout(() => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      }, duration * 1000);
    };

    // Create initial particles
    for (let i = 0; i < 20; i++) {
      setTimeout(() => createParticle(), i * 200);
    }

    // Continue creating particles
    const interval = setInterval(createParticle, 800);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div ref={containerRef} className="particles-container" />;
};

export default BackgroundParticles;