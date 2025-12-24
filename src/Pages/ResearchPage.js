import React, { useRef, useEffect, useState } from 'react';
import { HiOutlineArrowDown, HiOutlineMenu } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import ChatMessage from '../Components/Chat/ChatMessage';
import Sidebar from '../Components/General/Sidebar';
import researchData from '../Data/research.json';
import './ResearchPage.css';

const ResearchPage = () => {
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

  // Sort research by date in descending order
  const sortedResearch = [...researchData].sort((a, b) => new Date(b.date) - new Date(a.date));

  const introMessage = `This is a collection of prediction markets research that Dhruv has conducted. Each piece explores different aspects of forecasting, market dynamics, and data analysis in prediction markets.`;

  return (
    <div className="research-page">
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
            <ChatMessage role="user" content="What prediction markets research has Dhruv done?" />
            <ChatMessage role="assistant" content={introMessage} />

            <div className="research-grid">
              {sortedResearch.map((research, index) => (
                <Link 
                  key={index} 
                  to={`/research/${research.title.replace(/\s+/g, '-').toLowerCase()}`}
                  className="research-card"
                >
                  <div className="research-card-content">
                    <div className="research-image-container">
                      <img src={research.image} alt={research.title} className="research-image" />
                    </div>
                    <div className="research-info">
                      <h3 className="research-title">{research.title}</h3>
                      <p className="research-date">{research.date}</p>
                      <p className="research-description">{research.description}</p>
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

export default ResearchPage;

