import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/General/Navbar';
import Footer from './Components/General/Footer';
import Home from './Pages/Home';
import BlogPage from './Pages/BlogPage';
import BlogList from './Pages/BlogList';
import NewsletterPage from './Pages/NewsletterPage'; // Import the NewsletterPage component

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:title" element={<BlogPage />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/newsletter" element={<NewsletterPage />} /> {/* Add the NewsletterPage route */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
