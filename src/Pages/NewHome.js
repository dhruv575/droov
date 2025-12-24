import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Typewriter from '../Components/Typewriter';
import Sidebar from '../Components/General/Sidebar';
import SearchBar from '../Components/Search/SearchBar';
import { 
  HiOutlineMenu
} from 'react-icons/hi';
import './NewHome.css';

const NewHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
              <Typewriter text="Penn, Jane Street, Morgan Stanley, Polymarket" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <SearchBar placeholder="Search through my pages" />
          </div>

          {/* 2x2 Grid */}
          <div className="grid-container">
            <Link to="/resume" className="grid-card">
              <h3 className="card-title">Resume</h3>
              <p className="card-description">
                View my professional experience, education, and skills
              </p>
            </Link>

            <Link to="/projects" className="grid-card">
              <h3 className="card-title">Projects</h3>
              <p className="card-description">
                Explore my technical projects and data science work
              </p>
            </Link>

            <Link to="/chats" className="grid-card">
              <h3 className="card-title">Chats</h3>
              <p className="card-description">
                Read my thoughts on technology, data, and more
              </p>
            </Link>

            <Link to="/research" className="grid-card">
              <h3 className="card-title">Prediction Market Research</h3>
              <p className="card-description">
                Discover my research on prediction markets and forecasting
              </p>
            </Link>
          </div>
        </div>

        {/* Mobile Bottom Input Bar */}
        <div className="mobile-input-bar">
          <div className="mobile-input-container">
            <SearchBar placeholder="Search through my pages" />
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default NewHome;

