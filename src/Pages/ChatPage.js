import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import chatsData from '../Data/chats.json';
import researchData from '../Data/research.json';
import Sidebar from '../Components/General/Sidebar';
import { useIsMobile } from '../hooks/useIsMobile';
import { HiOutlineMenu } from 'react-icons/hi';
import './ChatPage.css';

const ChatPage = () => {
  const { title } = useParams();
  const location = useLocation();
  const isResearch = location.pathname.startsWith('/research/');
  const dataSource = isResearch ? researchData : chatsData;
  const chat = dataSource.find((item) => {
    const slugTitle = (item.chatTitle || item.title).replace(/\s+/g, '-').toLowerCase();
    return slugTitle === title;
  });
  const [markdownContent, setMarkdownContent] = useState('');
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (chat && chat.file) {
      fetch(chat.file)
        .then((response) => response.text())
        .then((text) => setMarkdownContent(text))
        .catch((error) => console.error('Error fetching markdown file:', error));
    }
  }, [chat]);

  return (
    <div className="chat-page">
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

          {chat ? (
            <div className="chat-content">
              <h1 
                className="chat-title" 
                dangerouslySetInnerHTML={{ __html: chat.title.replace(/\n/g, '<br />').replace(/<br>/gi, '<br />') }}
              />
              <img src={chat.image} alt={chat.title.split(/<br\s*\/?>/i)[0]} className="chat-image" />
              <p className="chat-date">{chat.date}</p>
              <p className="chat-description">{chat.description}</p>
              <div className="chat-markdown">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                  }}
                >
                  {markdownContent}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="chat-content">
              <h1 className="chat-title">Not Found</h1>
              <p>The requested item could not be found.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
