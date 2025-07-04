import React, { useEffect, useRef } from 'react';

const CursorEffects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const colors = [
      '#00f5ff', '#ff00ff', '#00ff00', '#ffff00', 
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
      '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
    ];

    const createBubble = (x: number, y: number) => {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      
      const size = Math.random() * 8 + 4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${x - size / 2}px`;
      bubble.style.top = `${y - size / 2}px`;
      bubble.style.background = `radial-gradient(circle, ${color}, transparent)`;
      
      container.appendChild(bubble);
      
      setTimeout(() => {
        if (container.contains(bubble)) {
          container.removeChild(bubble);
        }
      }, 2000);
    };

    const createSparkle = (x: number, y: number) => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.background = `linear-gradient(45deg, ${colors[Math.floor(Math.random() * colors.length)]}, #ffffff)`;
      
      container.appendChild(sparkle);
      
      setTimeout(() => {
        if (container.contains(sparkle)) {
          container.removeChild(sparkle);
        }
      }, 1500);
    };

    let lastTime = 0;
    const throttleDelay = 50;

    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now();
      if (currentTime - lastTime < throttleDelay) return;
      lastTime = currentTime;

      const { clientX, clientY } = e;
      
      // Create bubbles
      if (Math.random() > 0.7) {
        createBubble(clientX, clientY);
      }
      
      // Create sparkles
      if (Math.random() > 0.8) {
        createSparkle(
          clientX + (Math.random() - 0.5) * 20,
          clientY + (Math.random() - 0.5) * 20
        );
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div ref={containerRef} className="cursor-container" />;
};

export default CursorEffects;