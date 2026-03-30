import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineMenu } from 'react-icons/hi';
import updatesData from '../Data/updates.json';
import Sidebar from '../Components/General/Sidebar';
import { useIsMobile } from '../hooks/useIsMobile';
import './UpdatePage.css';

const UpdatePage = () => {
  const { title } = useParams();
  const update = updatesData.find((item) => {
    const slug = item.title.replace(/\s+/g, '-').toLowerCase();
    return slug === title;
  });
  const [htmlContent, setHtmlContent] = useState('');
  const iframeRef = useRef(null);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (update && update.file) {
      fetch(update.file)
        .then((response) => response.text())
        .then((text) => setHtmlContent(text))
        .catch((error) => console.error('Error fetching update:', error));
    }
  }, [update]);

  // Write HTML into iframe and auto-resize to fit content
  useEffect(() => {
    if (!iframeRef.current || !htmlContent) return;
    const doc = iframeRef.current.contentDocument;
    doc.open();
    doc.write(htmlContent);
    doc.close();

    const resize = () => {
      if (iframeRef.current && doc.body) {
        iframeRef.current.style.height = doc.body.scrollHeight + 'px';
      }
    };

    // Resize after images load
    doc.addEventListener('load', resize);
    const imgs = doc.querySelectorAll('img');
    imgs.forEach(img => img.addEventListener('load', resize));
    setTimeout(resize, 100);
    setTimeout(resize, 500);
  }, [htmlContent]);

  return (
    <div className="update-page">
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

          {update ? (
            <div className="update-content">
              <Link to="/updates" className="back-link">
                <HiOutlineArrowLeft /> Back to Updates
              </Link>
              <iframe
                ref={iframeRef}
                title={update.title}
                className="update-iframe"
                scrolling="no"
              />
            </div>
          ) : (
            <div className="update-content">
              <h1 className="update-page-title">Update Not Found</h1>
              <p>The requested update could not be found.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UpdatePage;
