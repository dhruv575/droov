import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HiOutlineMail,
  HiOutlineDocumentText,
  HiOutlineFolder,
  HiOutlineNewspaper,
  HiOutlineX,
  HiOutlinePlay
} from 'react-icons/hi';
import {
  FaLinkedin,
  FaGithub,
  FaTiktok,
  FaInstagram
} from 'react-icons/fa';
import logo from './logo-rect.png';
import './Sidebar.css';

// Simple X (Twitter) icon component
const XIcon = ({ className, style }) => (
  <svg 
    className={className} 
    style={style}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    width="20" 
    height="20"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();

  // Social links
  const socialLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/dhruv-gupta-norcal/', icon: FaLinkedin, color: '#ffffff' },
    { name: 'Substack', url: 'https://substack.com/@droovg', icon: HiOutlineNewspaper, color: '#ffffff' },
    { name: 'X', url: 'https://x.com/droovg', icon: XIcon, color: '#ffffff' },
    { name: 'GitHub', url: 'https://github.com/dhruv575', icon: FaGithub, color: '#ffffff' },
    { name: 'TikTok', url: 'https://tiktok.com/@droov.gupta', icon: FaTiktok, color: '#ffffff' },
    { name: 'Instagram', url: 'https://www.instagram.com/droov.gupta/', icon: FaInstagram, color: '#ffffff' },
    { name: 'Email', url: 'mailto:dhruv575@gmail.com', icon: HiOutlineMail, color: '#ffffff' },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="mobile-sidebar-overlay"
          onClick={() => onToggle(false)}
          aria-hidden="true"
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/">
            <img src={logo} alt="Logo" className="sidebar-logo" />
          </Link>
          <button 
            className="sidebar-close-btn"
            onClick={() => onToggle(false)}
            aria-label="Toggle sidebar"
          >
            <HiOutlineX />
          </button>
        </div>
        <div className="sidebar-content">
          {/* Social Links Section */}
          <div className="sidebar-section">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-link"
                >
                  <IconComponent className="sidebar-icon" style={{ color: social.color }} />
                  <span>{social.name}</span>
                </a>
              );
            })}
            <Link to="/resume" className={`sidebar-link ${location.pathname === '/resume' ? 'active' : ''}`}>
              <HiOutlineDocumentText className="sidebar-icon" style={{ color: '#ffffff' }} />
              <span>Resume</span>
            </Link>
          </div>

          {/* Page Links */}
          <div className="sidebar-section">
            <Link to="/projects" className={`sidebar-link ${location.pathname === '/projects' ? 'active' : ''}`}>
              <HiOutlineFolder className="sidebar-icon" style={{ color: '#ffffff' }} />
              <span>Projects</span>
            </Link>
            <Link to="/chats" className={`sidebar-link ${location.pathname === '/chats' || location.pathname.startsWith('/chats/') || location.pathname.startsWith('/research/') ? 'active' : ''}`}>
              <HiOutlineNewspaper className="sidebar-icon" style={{ color: '#ffffff' }} />
              <span>Chats</span>
            </Link>
            <Link to="/demos" className={`sidebar-link ${location.pathname === '/demos' || location.pathname.startsWith('/demos/') ? 'active' : ''}`}>
              <HiOutlinePlay className="sidebar-icon" style={{ color: '#ffffff' }} />
              <span>Demos</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

