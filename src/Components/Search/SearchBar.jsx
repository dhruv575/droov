import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import projectsData from '../../Data/projects.json';
import chatsData from '../../Data/chats.json';
import researchData from '../../Data/research.json';
import demosData from '../../Data/demos.json';
import './SearchBar.css';

const SearchBar = ({ placeholder = "Ask anything" }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  // Detect mobile and handle viewport changes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Resume content - mirrors the actual ResumePage content
  const resumeContent = {
    type: 'resume',
    title: 'Resume',
    content: `University of Pennsylvania graduating May 2027 Bachelors of Engineering in Artificial Intelligence 3.97 GPA topped courses Big Data Analytics Linear Algebra for ML AI. Jane Street Strategy and Product Intern New York May 2026 to August 2026. Polymarket data-driven journalism team built market-fetching html email-generation tool powering daily market insights newsletter 200000 users led to 1 million in deposits. Morgan Stanley Fixed Income Quant Intern New York developed XGBoost models predicting month-by-month mortgage prepayment default loan level wrote script calculate cashflows loan pools production billion annual lending mortgage backed securities. Ryval Founding Applied Mathematician dynamically shifting odds-pricing algorithm spot betting Twitch streams ensure 10 percent profit web socket server live bet limit odd updates. University of Pennsylvania Teaching Assistant Linear Algebra for ML AI. Venture Camp SWE Intern building mini version of Clay. Hack4Impact co-director leading 40 engineers build software nonprofit organizations led projects Fulfill NJ Baldwin School alumni relations. Signal Society website. WhartonGRC VP of Finance. Daily Pennsylvanian head of entrepreneurship. Comma Capital fellow.`
  };

  // Combine all searchable items
  const allItems = [
    resumeContent,
    ...projectsData.map(item => ({ ...item, type: 'project', title: item.name, content: item.desc })),
    ...chatsData.map(item => ({ ...item, type: 'chat', title: item.title, content: item.description })),
    ...researchData.map(item => ({ ...item, type: 'research', title: item.title, content: item.description })),
    ...demosData.map(item => ({ ...item, type: 'demo', title: item.name, content: item.description }))
  ];

  const searchItems = (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase().trim();
    const matches = [];

    allItems.forEach(item => {
      const titleLower = item.title.toLowerCase();
      const contentLower = item.content.toLowerCase();
      
      // Check if query matches title or content
      const titleMatch = titleLower.includes(lowerQuery);
      const contentMatch = contentLower.includes(lowerQuery);
      
      if (titleMatch || contentMatch) {
        let snippet = '';
        let snippetMatchIndex = -1;
        
        if (contentMatch) {
          // Find the first occurrence of the query in content
          const matchIndex = contentLower.indexOf(lowerQuery);
          
          if (matchIndex !== -1) {
            // Split content into words to get word boundaries
            const words = item.content.split(/(\s+)/);
            let charCount = 0;
            let matchWordStart = -1;
            let matchWordEnd = -1;
            
            // Find which words contain the match
            for (let i = 0; i < words.length; i++) {
              const word = words[i];
              const wordStart = charCount;
              const wordEnd = charCount + word.length;
              
              if (matchIndex >= wordStart && matchIndex < wordEnd) {
                matchWordStart = i;
              }
              if (matchIndex + lowerQuery.length > wordStart && matchIndex + lowerQuery.length <= wordEnd) {
                matchWordEnd = i;
                break;
              }
              
              charCount += word.length;
            }
            
            if (matchWordStart !== -1) {
              // Get up to 5 words before and after
              const startIndex = Math.max(0, matchWordStart - 10); // 10 because words array includes spaces
              const endIndex = Math.min(words.length, matchWordEnd + 10);
              
              snippet = words.slice(startIndex, endIndex).join('');
              const snippetLower = snippet.toLowerCase();
              snippetMatchIndex = snippetLower.indexOf(lowerQuery);
            }
          }
        }
        
        // If no snippet found or only title matches, use first part of description
        if (!snippet || snippetMatchIndex === -1) {
          snippet = item.content.substring(0, 150);
          if (item.content.length > 150) snippet += '...';
          snippetMatchIndex = snippet.toLowerCase().indexOf(lowerQuery);
        }
        
        matches.push({
          ...item,
          snippet: snippet.trim(),
          snippetMatchIndex: snippetMatchIndex >= 0 ? snippetMatchIndex : -1,
          matchLength: lowerQuery.length
        });
      }
    });

    setResults(matches.slice(0, 10)); // Limit to 10 results
  };

  useEffect(() => {
    searchItems(searchQuery);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    setShowResults(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
      handleItemClick(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  const handleItemClick = (item) => {
    if (item.type === 'resume') {
      navigate('/resume');
    } else if (item.type === 'project') {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    } else if (item.type === 'chat') {
      navigate(`/chats/${(item.chatTitle || item.title).replace(/\s+/g, '-').toLowerCase()}`);
    } else if (item.type === 'research') {
      navigate(`/research/${(item.chatTitle || item.title).replace(/\s+/g, '-').toLowerCase()}`);
    } else if (item.type === 'demo') {
      navigate(`/demos/${item.title.replace(/\s+/g, '-').toLowerCase()}`);
    }
    setShowResults(false);
    setSearchQuery('');
  };

  const highlightSnippet = (snippet, matchIndex, matchLength, query) => {
    if (matchIndex === -1) {
      return <span className="snippet-text">{snippet}</span>;
    }

    const before = snippet.substring(0, matchIndex);
    const match = snippet.substring(matchIndex, matchIndex + matchLength);
    const after = snippet.substring(matchIndex + matchLength);

    return (
      <span className="snippet-text">
        {before}
        <span className="snippet-match">{match}</span>
        {after}
      </span>
    );
  };

  return (
    <div className="search-wrapper" ref={searchRef}>
      <div className="search-bar">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          className="search-input"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
        />
      </div>
      {showResults && searchQuery.trim() && (
        <div className="search-results" ref={resultsRef}>
          {results.length > 0 ? (
            results.map((item, index) => (
              <div
                key={`${item.type}-${index}`}
                className={`search-result-item ${selectedIndex === index ? 'selected' : ''}`}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="result-title">
                  <strong>{item.title}</strong>
                </div>
                <div className="result-snippet">
                  {highlightSnippet(item.snippet, item.snippetMatchIndex, item.matchLength, searchQuery)}
                </div>
                <div className="result-type">{item.type}</div>
              </div>
            ))
          ) : (
            <div className="search-no-results">
              No results for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

