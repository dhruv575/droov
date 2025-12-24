import React, { useRef, useEffect, useState } from 'react';
import { HiOutlineArrowDown, HiOutlineMenu } from 'react-icons/hi';
import { FaTiktok, FaExternalLinkAlt } from 'react-icons/fa';
import ChatMessage from '../Components/Chat/ChatMessage';
import Sidebar from '../Components/General/Sidebar';
import dataProjects from '../Data/dataProjects.json';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const chatEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      setShowScrollButton(scrollTop + windowHeight < documentHeight - 200);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const introMessage = `This is a collection of web development and machine learning projects that Dhruv has built. Each project combines technical skills with real-world applications, from data analysis to interactive web applications.`;

  return (
    <div className="projects-page">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="layout-container">
        {/* Left Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />

        {/* Main Content */}
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          {/* Mobile Hamburger Menu Button */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <HiOutlineMenu />
          </button>

          {/* Sidebar toggle button when closed (desktop only) */}
          {!sidebarOpen && (
            <button 
              className="sidebar-toggle-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <HiOutlineMenu />
            </button>
          )}

          <div className="chat-container">
            <ChatMessage role="user" content="What projects has Dhruv built?" />
            <ChatMessage role="assistant" content={introMessage} />

            <div className="projects-grid">
              {dataProjects.map((project, index) => (
                <div key={index} className="project-card">
                  <div className="project-card-content">
                    <div className="project-image-container">
                      <img src={project.image} alt={project.name} className="project-image" />
                    </div>
                    <div className="project-info">
                      <h3 className="project-name">{project.name}</h3>
                      <p className="project-description">{project.desc}</p>
                      <div className="project-tech">
                        {project.tech.map((techItem, techIndex) => (
                          <span key={techIndex} className="tech-tag">{techItem}</span>
                        ))}
                      </div>
                    </div>
                    <div className="project-links">
                      <a 
                        href={project.tiktok} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="project-link"
                        aria-label="View on TikTok"
                      >
                        <FaTiktok className="project-icon" />
                      </a>
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="project-link"
                        aria-label="View project"
                      >
                        <FaExternalLinkAlt className="project-icon" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div ref={chatEndRef} />

            {showScrollButton && (
              <button className="scroll-to-bottom-btn" onClick={scrollToBottom} aria-label="Scroll to bottom">
                <HiOutlineArrowDown />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectsPage;

