import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from './logo-rect.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="AIRchemedes" className="logo" />
        </Link>
      </div>
      <div className="navbar-right">
        <a href="/chats" className="navbar-link">
          Chats
        </a>
        <a href="/newsletter" className="navbar-link">
          Newsletter
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
