import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import '../styles/PhoneMockup.css';

const PhoneMockup = ({ children, className = '', slides = [] }) => {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setIdx(i => (i + 1) % slides.length), 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

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
            {slides.length > 0
              ? slides.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    className={`phone-slide ${i === idx ? 'active' : ''}`}
                    alt={`screenshot ${i + 1}`}
                    draggable={false}
                  />
                ))
              : children}
          </div>
        </div>

        <div className="btn-volume-up"></div>
        <div className="btn-volume-down"></div>
        <div className="btn-power"></div>
      </motion.div>
    </div>
  );
};

export default PhoneMockup;
