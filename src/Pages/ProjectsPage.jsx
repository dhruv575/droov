import React, { useRef, useEffect, useState } from 'react';
import { HiOutlineArrowDown, HiOutlineMenu } from 'react-icons/hi';
import { FaTiktok, FaExternalLinkAlt, FaVideo, FaFileAlt } from 'react-icons/fa';
import ChatMessage from '../Components/Chat/ChatMessage';
import Sidebar from '../Components/General/Sidebar';
import { useIsMobile } from '../hooks/useIsMobile';
import projectsData from '../Data/projects.json';
import './ProjectsPage.css';

const FEATURED_COUNT = 3;

const ProjectLink = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="project-link"
  >
    <Icon className="project-icon" />
    <span>{label}</span>
  </a>
);

const ProjectCard = ({ project, featured }) => (
  <div className={`project-card ${featured ? 'project-card-featured' : ''}`}>
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
        <div className="project-links">
          {project.tiktok && <ProjectLink href={project.tiktok} icon={FaTiktok} label="TikTok" />}
          {project.video && <ProjectLink href={project.video} icon={FaVideo} label="Demo" />}
          {project.prd && <ProjectLink href={project.prd} icon={FaFileAlt} label="PRD" />}
          {project.link && <ProjectLink href={project.link} icon={FaExternalLinkAlt} label="Visit" />}
        </div>
      </div>
    </div>
  </div>
);

const ProjectsPage = () => {
  const chatEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

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

  const featured = projectsData.slice(0, FEATURED_COUNT);
  const rest = projectsData.slice(FEATURED_COUNT);

  return (
    <div className="projects-page">
      {sidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="layout-container">
        <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />

        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <button
            className="mobile-hamburger-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <HiOutlineMenu />
          </button>

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
            <ChatMessage role="user" content="What has Dhruv built?" />
            <ChatMessage role="assistant" content="Prediction market tools, AI products, data analysis, and web apps — here's everything, starting with the highlights." />

            {/* Featured projects — full width hero cards */}
            <div className="projects-featured">
              {featured.map((project, index) => (
                <ProjectCard key={index} project={project} featured />
              ))}
            </div>

            <div className="projects-section-divider">
              <span>More Projects</span>
            </div>

            {/* Rest of the projects — 2-column grid */}
            <div className="projects-grid">
              {rest.map((project, index) => (
                <ProjectCard key={index} project={project} />
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
