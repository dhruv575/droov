import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMenu } from 'react-icons/hi';
import ChatMessage from '../Components/Chat/ChatMessage';
import Sidebar from '../Components/General/Sidebar';
import { useIsMobile } from '../hooks/useIsMobile';
import updatesData from '../Data/updates.json';
import './UpdatesPage.css';

const UpdatesPage = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const introMessage = `These are Dhruv's quarterly dispatches — personal updates sent to mentors, professors, investors, and people he admires. Each one covers what he's been building, what he needs help with, and where things are headed.`;

  return (
    <div className="updates-page">
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
            <ChatMessage role="user" content="What has Dhruv been up to recently?" />
            <ChatMessage role="assistant" content={introMessage} />

            <div className="updates-list">
              {updatesData.map((update, index) => {
                const slug = update.title.replace(/\s+/g, '-').toLowerCase();
                return (
                  <Link to={`/updates/${slug}`} key={index} className="update-card">
                    <div className="update-card-content">
                      <h3 className="update-title">{update.title}</h3>
                      <p className="update-date">{update.date}</p>
                      <p className="update-description">{update.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdatesPage;
