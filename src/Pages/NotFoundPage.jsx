import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HiOutlineMenu } from 'react-icons/hi';
import ChatMessage from '../Components/Chat/ChatMessage';
import Sidebar from '../Components/General/Sidebar';
import { useIsMobile } from '../hooks/useIsMobile';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const errorMessage = `This is a 404 error — nothing exists at \`${location.pathname}\`. Dhruv hasn't written about this topic yet, or the URL might be incorrect.

You can navigate back to the [home page](/), check out the [resume](/resume), or explore other sections using the menu.`;

  return (
    <div className="not-found-page">
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
            <ChatMessage role="user" content="Wait has Dhruv written about this??" />
            <ChatMessage role="assistant" content={errorMessage} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotFoundPage;

