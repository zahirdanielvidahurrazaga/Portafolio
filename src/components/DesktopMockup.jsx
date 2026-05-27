import React, { useState, useEffect } from 'react';
import '../styles/DesktopMockup.css';

const DesktopMockup = ({ slides = [] }) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setIdx(i => (i + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="desktop-mockup">
      <div className="desktop-toolbar">
        <span className="desktop-dot red" />
        <span className="desktop-dot yellow" />
        <span className="desktop-dot green" />
        <div className="desktop-urlbar" />
      </div>
      <div className="desktop-screen">
        {slides.map((src, i) => (
          <img
            key={src}
            src={src}
            className={`desktop-slide ${i === idx ? 'active' : ''}`}
            alt={`desktop screenshot ${i + 1}`}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
};

export default DesktopMockup;
