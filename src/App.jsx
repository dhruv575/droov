import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import ChatPage from './Pages/ChatPage';
import ChatsPage from './Pages/ChatsPage';
import NewsletterPage from './Pages/NewsletterPage';
import NewHome from './Pages/NewHome';
import ResumePage from './Pages/ResumePage';
import NotFoundPage from './Pages/NotFoundPage';
import ProjectsPage from './Pages/ProjectsPage';
import DemosPage from './Pages/DemosPage';
import DemoPage from './Pages/DemoPage';

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<NewHome />} />
      <Route path="/old" element={<Home />} />
      <Route path="/resume" element={<ResumePage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/demos" element={<DemosPage />} />
      <Route path="/demos/:title" element={<DemoPage />} />
      <Route path="/chats/:title" element={<ChatPage />} />
      <Route path="/chats" element={<ChatsPage />} />
      <Route path="/research/:title" element={<ChatPage />} />
      <Route path="/research" element={<Navigate to="/chats" replace />} />
      <Route path="/newsletter" element={<NewsletterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
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
