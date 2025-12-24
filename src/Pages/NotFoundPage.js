import React, { useRef, useEffect, useState } from 'react';
import { HiOutlineArrowDown, HiOutlineMenu } from 'react-icons/hi';
import ChatMessage from '../Components/Chat/ChatMessage';
import Sidebar from '../Components/General/Sidebar';
import './NotFoundPage.css';

const NotFoundPage = () => {
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

  const errorMessage = `This is a 404 error - the page you're looking for doesn't exist. It seems like Dhruv hasn't written about this topic yet, or the URL might be incorrect.

You can navigate back to the [home page](/), check out the [resume](/resume), or explore other sections using the menu.`;

  return (
    <div className="not-found-page">
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
            <ChatMessage role="user" content="Wait has Dhruv written about this??" />
            <ChatMessage role="assistant" content={errorMessage} />

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

export default NotFoundPage;

