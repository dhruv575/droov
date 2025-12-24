import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HiOutlineMail, 
  HiOutlineDocumentText, 
  HiOutlineFolder, 
  HiOutlineNewspaper, 
  HiOutlineChartBar,
  HiOutlineX,
  HiOutlineMenu
} from 'react-icons/hi';
import { 
  FaLinkedin, 
  FaGithub,
  FaTiktok,
  FaInstagram
} from 'react-icons/fa';
import logo from './logo-rect.png';
import chatsData from '../../Data/chats.json';
import researchData from '../../Data/research.json';
import projectsData from '../../Data/projects.json';
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
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [articlesOpen, setArticlesOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);

  // Social links
  const socialLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/dhruv-gupta-norcal/', icon: FaLinkedin, color: '#ffffff' },
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
            <Link to="/resume" className="sidebar-link">
              <HiOutlineDocumentText className="sidebar-icon" style={{ color: '#ffffff' }} />
              <span>Resume</span>
            </Link>
          </div>

          {/* Collapsible Sections */}
          <div className="sidebar-section">
            <button
              className="sidebar-dropdown-toggle"
              onClick={() => setProjectsOpen(!projectsOpen)}
            >
              <HiOutlineFolder className="sidebar-icon" style={{ color: '#ffffff' }} />
              <span>Projects</span>
              <span className="dropdown-arrow">{projectsOpen ? '▼' : '▶'}</span>
            </button>
            {projectsOpen && (
              <div className="sidebar-dropdown-content">
                {projectsData.map((project, index) => {
                  const isActive = location.pathname === `/projects/${project.name.replace(/\s+/g, '-').toLowerCase()}`;
                  return (
                    <a
                      key={index}
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`sidebar-dropdown-link ${isActive ? 'active' : ''}`}
                    >
                      {project.name}
                    </a>
                  );
                })}
                <Link to="/projects" className="sidebar-dropdown-link view-all-link">
                  <span className="view-all-text">View All Projects</span>
                  <span className="view-all-arrow">→</span>
                </Link>
              </div>
            )}

            <button
              className="sidebar-dropdown-toggle"
              onClick={() => setArticlesOpen(!articlesOpen)}
            >
              <HiOutlineNewspaper className="sidebar-icon" style={{ color: '#ffffff' }} />
              <span>Chats</span>
              <span className="dropdown-arrow">{articlesOpen ? '▼' : '▶'}</span>
            </button>
            {articlesOpen && (
              <div className="sidebar-dropdown-content">
                {chatsData.map((chat, index) => {
                  const chatTitle = chat.chatTitle || chat.title;
                  const displayTitle = chatTitle.length > 25 
                    ? chatTitle.substring(0, 23) + '..' 
                    : chatTitle;
                  const chatPath = `/chats/${(chat.chatTitle || chat.title).replace(/\s+/g, '-').toLowerCase()}`;
                  const isActive = location.pathname === chatPath;
                  return (
                    <Link 
                      key={index}
                      to={chatPath}
                      className={`sidebar-dropdown-link ${isActive ? 'active' : ''}`}
                    >
                      {displayTitle}
                    </Link>
                  );
                })}
                <Link to="/chats" className="sidebar-dropdown-link view-all-link">
                  <span className="view-all-text">View All Chats</span>
                  <span className="view-all-arrow">→</span>
                </Link>
              </div>
            )}

            <button
              className="sidebar-dropdown-toggle"
              onClick={() => setResearchOpen(!researchOpen)}
            >
              <HiOutlineChartBar className="sidebar-icon" style={{ color: '#ffffff' }} />
              <span>Prediction Market Research</span>
              <span className="dropdown-arrow">{researchOpen ? '▼' : '▶'}</span>
            </button>
            {researchOpen && (
              <div className="sidebar-dropdown-content">
                {researchData.map((research, index) => {
                  const researchTitle = research.chatTitle || research.title;
                  const displayTitle = researchTitle.length > 25 
                    ? researchTitle.substring(0, 23) + '..' 
                    : researchTitle;
                  const researchPath = `/research/${(research.chatTitle || research.title).replace(/\s+/g, '-').toLowerCase()}`;
                  const isActive = location.pathname === researchPath;
                  return (
                    <Link 
                      key={index}
                      to={researchPath}
                      className={`sidebar-dropdown-link ${isActive ? 'active' : ''}`}
                    >
                      {displayTitle}
                    </Link>
                  );
                })}
                <Link to="/research" className="sidebar-dropdown-link view-all-link">
                  <span className="view-all-text">View All Research</span>
                  <span className="view-all-arrow">→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

