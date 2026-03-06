import React, { useRef, useEffect, useState } from 'react';
import { HiOutlineArrowDown, HiOutlineMenu } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import ChatMessage from '../Components/Chat/ChatMessage';
import Sidebar from '../Components/General/Sidebar';
import { useIsMobile } from '../hooks/useIsMobile';
import chatsData from '../Data/chats.json';
import researchData from '../Data/research.json';
import './ChatsPage.css';

const ChatsPage = () => {
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

  const sortedChats = [...chatsData].sort((a, b) => new Date(b.date) - new Date(a.date));
  const sortedResearch = [...researchData].sort((a, b) => new Date(b.date) - new Date(a.date));

  const introMessage = `This is a collection of everything Dhruv has written — from Substack posts and personal chats to prediction market research.`;

  return (
    <div className="chats-page">
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
            <ChatMessage role="user" content="What has Dhruv written about?" />
            <ChatMessage role="assistant" content={introMessage} />

            {/* Personal Substack */}
            <h2 className="section-header">
              Personal Substack
              <a href="https://substack.com/@droovg" target="_blank" rel="noopener noreferrer" className="section-header-link">View all posts →</a>
            </h2>
            <a
              href="https://droovg.substack.com/p/competition-and-the-venture-fueled"
              target="_blank"
              rel="noopener noreferrer"
              className="substack-card"
            >
              <div className="substack-card-content">
                <div className="substack-image-container">
                  <img src="https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F33b7f6df-6b63-41c5-ad54-a152c23a5635_1999x1545.png" alt="Competition and the Venture-fueled Race to the Bottom" className="substack-image" />
                </div>
                <div className="substack-info">
                  <h3 className="substack-title">Competition and the Venture-fueled Race to the Bottom</h3>
                  <p className="substack-subtitle">Kalshi & Polymarket's, OpenAI & Anthropic; OpenClaw, Conway, and other scams</p>
                </div>
              </div>
            </a>

            {/* Polymarket Substack */}
            <h2 className="section-header">
              Polymarket Substack
              <a href="https://news.polymarket.com/" target="_blank" rel="noopener noreferrer" className="section-header-link">View all posts →</a>
            </h2>
            <a
              href="https://news.polymarket.com/p/play-by-play"
              target="_blank"
              rel="noopener noreferrer"
              className="substack-card"
            >
              <div className="substack-card-content">
                <div className="substack-image-container">
                  <img src="https://substackcdn.com/image/fetch/$s_!sBMp!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff4cffaa8-5226-4859-a78f-b4cbe41219cc_940x650.jpeg" alt="Play by Play" className="substack-image" />
                </div>
                <div className="substack-info">
                  <h3 className="substack-title">Play by Play</h3>
                  <p className="substack-subtitle">Here are the EXACT moments Polymarket traders called the Supreme Court tariff ruling</p>
                </div>
              </div>
            </a>
            <a
              href="https://news.polymarket.com/p/red-tilt"
              target="_blank"
              rel="noopener noreferrer"
              className="substack-card"
            >
              <div className="substack-card-content">
                <div className="substack-image-container">
                  <img src="https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5371dbb1-4482-4f4b-b7a0-1ab7af4e880f_940x650.jpeg" alt="RED TILT?" className="substack-image" />
                </div>
                <div className="substack-info">
                  <h3 className="substack-title">RED TILT?</h3>
                  <p className="substack-subtitle">Polymarket Bros Overweight Republicans, Right?</p>
                </div>
              </div>
            </a>

            {/* Chats */}
            <h2 className="section-header">Chats</h2>
            <div className="chats-grid">
              {sortedChats.map((chat, index) => (
                <Link
                  key={index}
                  to={`/chats/${(chat.chatTitle || chat.title).replace(/\s+/g, '-').toLowerCase()}`}
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

            {/* Prediction Market Research */}
            <h2 className="section-header">Prediction Market Research</h2>
            <div className="chats-grid">
              {sortedResearch.map((research, index) => (
                <Link
                  key={index}
                  to={`/research/${(research.chatTitle || research.title).replace(/\s+/g, '-').toLowerCase()}`}
                  className="chat-card"
                >
                  <div className="chat-card-content">
                    <div className="chat-image-container">
                      <img src={research.image} alt={research.title} className="chat-image" />
                    </div>
                    <div className="chat-info">
                      <h3 className="chat-title">{research.title}</h3>
                      <p className="chat-date">{research.date}</p>
                      <p className="chat-description">{research.description}</p>
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
