import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Typewriter from '../Components/Typewriter';
import Sidebar from '../Components/General/Sidebar';
import SearchBar from '../Components/Search/SearchBar';
import { useIsMobile } from '../hooks/useIsMobile';
import {
  HiOutlineMenu,
  HiOutlineDocumentText,
  HiOutlineCube,
  HiOutlineChatAlt2,
  HiOutlineSparkles,
  HiOutlineArrowNarrowRight
} from 'react-icons/hi';
import './NewHome.css';

const CARDS = [
  {
    to: '/resume',
    icon: HiOutlineDocumentText,
    title: 'Resume',
    description: 'View my professional experience, education, and skills',
    accent: 'blue'
  },
  {
    to: '/projects',
    icon: HiOutlineCube,
    title: 'Projects',
    description: 'Explore my technical projects and data science work',
    accent: 'teal'
  },
  {
    to: '/chats',
    icon: HiOutlineChatAlt2,
    title: 'Chats',
    description: 'Read my thoughts on technology, data, and more',
    accent: 'violet'
  },
  {
    to: '/updates',
    icon: HiOutlineSparkles,
    title: 'Updates',
    description: "Quarterly dispatches on what I'm building and learning",
    accent: 'orange'
  }
];

const NewHome = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className="new-home">
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
        <div className="content-wrapper">
          {/* Typewriter Header */}
          <div className="typewriter-header">
            <div className="typewriter-line1">
              <Typewriter text="Dhruv Gupta" />
            </div>
            <div className="typewriter-line2">
              <Typewriter text="Penn, Jane Street, Morgan Stanley, Polymarket, MTS" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <SearchBar placeholder="Ask about me" />
          </div>

          {/* 2x2 Grid */}
          <div className="grid-container rise-stagger">
            {CARDS.map(({ to, icon: Icon, title, description, accent }) => (
              <Link to={to} key={to} className={`grid-card card-accent-${accent}`}>
                <span className="card-icon">
                  <Icon />
                </span>
                <h3 className="card-title">
                  {title}
                  <HiOutlineArrowNarrowRight className="card-arrow" />
                </h3>
                <p className="card-description">{description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Bottom Input Bar */}
        <div className="mobile-input-bar">
          <div className="mobile-input-container">
            <SearchBar placeholder="Ask about me" />
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default NewHome;

