import React from 'react';
import { motion } from 'framer-motion';
import '../styles/TechStack.css';

const techItems = [
  "React", "Vite", "Supabase", "Cloudflare", "PWA", "iOS Native", "Android Native", "Python", "Node.js", "C", "SQL", "JavaScript", "HTML", "CSS"
];

const TechStack = () => {
  return (
    <section id="tech" className="tech-section">
      <div className="tech-header text-center">
        <h2>Herramientas de Nivel Empresarial.</h2>
      </div>
      
      <div className="marquee-container">
        <div className="marquee">
          {/* Double the items for seamless loop */}
          {[...techItems, ...techItems].map((tech, index) => (
            <div key={index} className="tech-badge">
              {tech}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
