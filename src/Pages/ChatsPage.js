import React, { useRef, useEffect, useState } from 'react';
import { HiOutlineArrowDown, HiOutlineMenu } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import ChatMessage from '../Components/Chat/ChatMessage';
import Sidebar from '../Components/General/Sidebar';
import chatsData from '../Data/chats.json';
import './ChatsPage.css';

const ChatsPage = () => {
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

  // Sort chats by date in descending order
  const sortedChats = [...chatsData].sort((a, b) => new Date(b.date) - new Date(a.date));

  const introMessage = `This is a collection of chats and articles that Dhruv has written. Each chat explores different topics from technology and data science to college applications and music.`;

  return (
    <div className="chats-page">
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
            <ChatMessage role="user" content="What has Dhruv written about?" />
            <ChatMessage role="assistant" content={introMessage} />

            <div className="chats-grid">
              {sortedChats.map((chat, index) => (
                <Link 
                  key={index} 
                  to={`/chats/${chat.title.replace(/\s+/g, '-').toLowerCase()}`}
                  className="chat-card"
                >
                  <div className="chat-card-content">
                    <div className="chat-image-container">
                      <img src={chat.image} alt={chat.title} className="chat-image" />
                    </div>
                    <div className="chat-info">
                      <h3 className="chat-title">{chat.title}</h3>
                      <p className="chat-date">{chat.date}</p>
                      <p className="chat-description">{chat.description}</p>
                    </div>
                  </div>
                </Link>
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

export default ChatsPage;

