import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import '../styles/PhoneMockup.css';

const PhoneMockup = ({ children, className }) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Create an Apple-style floating perspective effect based on scroll
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <div className={`phone-mockup-wrapper ${className}`} ref={ref}>
      <motion.div 
        className="phone-mockup-frame"
        style={{ y, rotateX, scale, perspective: 1000 }}
      >
        <div className="phone-mockup-bezel">
          <div className="dynamic-island">
            <div className="camera"></div>
            <div className="sensor"></div>
          </div>
          <div className="phone-screen">
            {children}
          </div>
        </div>
        
        {/* Buttons */}
        <div className="btn-volume-up"></div>
        <div className="btn-volume-down"></div>
        <div className="btn-power"></div>
      </motion.div>
    </div>
  );
};

export default PhoneMockup;
