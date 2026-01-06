import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import demosData from '../Data/demos.json';
import Sidebar from '../Components/General/Sidebar';
import { useIsMobile } from '../hooks/useIsMobile';
import { HiOutlineMenu } from 'react-icons/hi';
import './DemoPage.css';

const DemoPage = () => {
  const { title } = useParams();
  const demo = demosData.find((item) => {
    const slugTitle = item.name.replace(/\s+/g, '-').toLowerCase();
    return slugTitle === title;
  });
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="demo-page">
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

          {demo ? (
            <div className="demo-content">
              <div className="demo-video-wrapper">
                <video 
                  controls 
                  className="demo-main-video"
                  preload="metadata"
                >
                  <source src={demo.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="demo-description-section">
                <h2>{demo.name}</h2>
                <p className="demo-main-description">{demo.description}</p>
              </div>
            </div>
          ) : (
            <div className="demo-content">
              <h1 className="demo-title">Demo Not Found</h1>
              <p>The requested demo could not be found.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DemoPage;