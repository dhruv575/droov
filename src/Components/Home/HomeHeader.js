import React, { useEffect, useRef } from 'react';
import Typewriter from '../Typewriter';
import './HomeHeader.css';

const HomeHeader = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    if (particlesRef.current) {
      window.particlesJS.load('particles-js', '/particles-config.json', () => {
        console.log('Particles.js config loaded');
      });
    }
  }, []);

  return (
    <div className="home-header">
      <div id="particles-js" ref={particlesRef}></div>
      <div className="header-content">
        <h1 className="main-title">
          <Typewriter text="I like to build fun things and solve fun problems sometimes." />
        </h1>
        <h2 className="subtitle">
          <Typewriter text="Artificial Intelligence @ Penn, Quant @ Morgan Stanley" />
        </h2>
      </div>
    </div>
  );
};

export default HomeHeader;
