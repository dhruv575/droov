import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faTiktok, faInstagram, faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import logo from './logo-rect.png';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-logo">
        <img src={logo} alt="AIrchemedes" />
      </div>
      <div className="footer-right">
        <a href="https://www.linkedin.com/in/dhruv-gupta-norcal/" target="_blank" rel="noopener noreferrer" className="footer-icon">
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
        <a href="https://www.tiktok.com/@droov-gupta" target="_blank" rel="noopener noreferrer" className="footer-icon">
          <FontAwesomeIcon icon={faTiktok} />
        </a>
        <a href="https://www.instagram.com/droov-gupta" target="_blank" rel="noopener noreferrer" className="footer-icon">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a href="https://open.spotify.com/user/9nzecfz1trhrhlj2i3bvi5ayp?si=yKfRCCOBQFCi5s6RdGD3Zg" target="_blank" rel="noopener noreferrer" className="footer-icon">
          <FontAwesomeIcon icon={faSpotify} />
        </a>
        <a href="mailto:dhruvgup@seas.upenn.edu" className="footer-icon">
          <FontAwesomeIcon icon={faEnvelope} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
