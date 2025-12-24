import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/General/Navbar';
import Footer from './Components/General/Footer';
import Home from './Pages/Home';
import ChatPage from './Pages/ChatPage';
import ChatsPage from './Pages/ChatsPage';
import ResearchPage from './Pages/ResearchPage';
import NewsletterPage from './Pages/NewsletterPage';
import NewHome from './Pages/NewHome';
import ResumePage from './Pages/ResumePage';
import NotFoundPage from './Pages/NotFoundPage';
import ProjectsPage from './Pages/ProjectsPage';

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isResumePage = location.pathname === '/resume';
  const isProjectsPage = location.pathname === '/projects';
  const isChatsPage = location.pathname === '/chats' || location.pathname.startsWith('/chats/');
  const isResearchPage = location.pathname === '/research' || location.pathname.startsWith('/research/');
  const validPaths = ['/', '/old', '/resume', '/projects', '/chats', '/research', '/newsletter'];
  const isValidPath = validPaths.some(path => {
    if (path === '/chats') {
      return location.pathname === '/chats' || location.pathname.startsWith('/chats/');
    }
    if (path === '/research') {
      return location.pathname === '/research' || location.pathname.startsWith('/research/');
    }
    return location.pathname === path;
  });
  const isNotFoundPage = !isValidPath;

  return (
    <>
      {!isHomePage && !isResumePage && !isProjectsPage && !isChatsPage && !isResearchPage && !isNotFoundPage && <Navbar />}
      <Routes>
        <Route path="/" element={<NewHome />} />
        <Route path="/old" element={<Home />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/chats/:title" element={<ChatPage />} />
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/research/:title" element={<ChatPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/newsletter" element={<NewsletterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {!isHomePage && !isResumePage && !isProjectsPage && !isChatsPage && !isResearchPage && !isNotFoundPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
