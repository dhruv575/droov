import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { keywordSearch } from '../../lib/searchCorpus';
import { aiSearch } from '../../lib/aiSearch';
import './SearchBar.css';

const MIN_AI_LENGTH = 3;
const AI_DEBOUNCE_MS = 550;

/** Build a snippet around the first lexical hit, for the instant results. */
function buildSnippet(item, query) {
  const content = item.content || '';
  const lowerQuery = query.toLowerCase().trim();
  const matchIndex = content.toLowerCase().indexOf(lowerQuery);

  if (matchIndex === -1) {
    const snippet = content.length > 150 ? `${content.slice(0, 150)}...` : content;
    return { snippet, matchIndex: -1, matchLength: lowerQuery.length };
  }

  const start = Math.max(0, matchIndex - 60);
  const end = Math.min(content.length, matchIndex + lowerQuery.length + 90);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < content.length ? '...' : '';
  const snippet = `${prefix}${content.slice(start, end)}${suffix}`;

  return {
    snippet,
    matchIndex: snippet.toLowerCase().indexOf(lowerQuery),
    matchLength: lowerQuery.length
  };
}

const SearchBar = ({ placeholder = 'Ask anything' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [ai, setAi] = useState({ status: 'idle', answer: '', results: [], error: '' });

  const searchRef = useRef(null);
  const abortRef = useRef(null);
  const navigate = useNavigate();

  const keywordResults = useMemo(() => keywordSearch(searchQuery), [searchQuery]);

  // AI results when we have them, instant lexical results until then.
  const displayed = useMemo(() => {
    if (ai.status === 'done' && ai.results.length > 0) {
      return ai.results.map(({ item, reason }) => ({ item, reason }));
    }
    return keywordResults.map((item) => ({ item, reason: null }));
  }, [ai, keywordResults]);

  const runAiSearch = useCallback(async (query) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setAi({ status: 'loading', answer: '', results: [], error: '' });
    try {
      const payload = await aiSearch(query, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setAi({
        status: 'done',
        answer: payload.answer,
        results: payload.results,
        error: ''
      });
    } catch (err) {
      if (controller.signal.aborted || err?.name === 'AbortError') return;
      setAi({ status: 'error', answer: '', results: [], error: err.message });
    }
  }, []);

  // Debounced AI pass; the lexical results are already on screen meanwhile.
  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < MIN_AI_LENGTH) {
      abortRef.current?.abort();
      setAi({ status: 'idle', answer: '', results: [], error: '' });
      return undefined;
    }

    const timer = setTimeout(() => runAiSearch(query), AI_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery, runAiSearch]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item) => {
    if (!item.href) return;
    if (item.external) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else {
      navigate(item.href);
    }
    setShowResults(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < displayed.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && displayed[selectedIndex]) {
        handleItemClick(displayed[selectedIndex].item);
      } else if (searchQuery.trim().length >= MIN_AI_LENGTH) {
        // Enter asks immediately rather than waiting out the debounce.
        e.preventDefault();
        runAiSearch(searchQuery.trim());
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  const highlightSnippet = (item) => {
    const { snippet, matchIndex, matchLength } = buildSnippet(item, searchQuery);
    if (matchIndex === -1) return <span className="snippet-text">{snippet}</span>;

    return (
      <span className="snippet-text">
        {snippet.slice(0, matchIndex)}
        <span className="snippet-match">{snippet.slice(matchIndex, matchIndex + matchLength)}</span>
        {snippet.slice(matchIndex + matchLength)}
      </span>
    );
  };

  const hasQuery = searchQuery.trim().length > 0;

  return (
    <div className="search-wrapper" ref={searchRef}>
      <div className="search-bar">
        <svg
          className="search-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          className="search-input"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(true)}
          aria-label="Search this site"
        />
        {ai.status === 'loading' && <span className="search-spinner" aria-hidden="true" />}
      </div>

      {showResults && hasQuery && (
        <div className="search-results">
          {/* AI answer */}
          {ai.status === 'loading' && (
            <div className="search-answer search-answer-loading">
              <div className="search-answer-head">
                <span className="answer-badge">Answer</span>
                <span className="answer-status">thinking…</span>
              </div>
              <div className="shimmer answer-skeleton-line" />
              <div className="shimmer answer-skeleton-line short" />
            </div>
          )}

          {ai.status === 'done' && ai.answer && (
            <div className="search-answer">
              <div className="search-answer-head">
                <span className="answer-badge">Answer</span>
              </div>
              <p className="search-answer-text">{ai.answer}</p>
            </div>
          )}

          {ai.status === 'error' && (
            <div className="search-answer search-answer-error">
              <div className="search-answer-head">
                <span className="answer-badge answer-badge-muted">Answer unavailable</span>
              </div>
              <p className="search-answer-text">{ai.error}</p>
            </div>
          )}

          {/* Results */}
          {displayed.length > 0 ? (
            <>
              <div className="search-results-label">
                {ai.status === 'done' && ai.results.length > 0 ? 'Best matches' : 'Matches'}
              </div>
              {displayed.map(({ item, reason }, index) => (
                <div
                  key={item.id}
                  className={`search-result-item ${selectedIndex === index ? 'selected' : ''}`}
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="result-title">
                    <strong>{item.title}</strong>
                  </div>
                  <div className="result-snippet">
                    {reason ? <span className="result-reason">{reason}</span> : highlightSnippet(item)}
                  </div>
                  <div className="result-type">{item.type}</div>
                </div>
              ))}
            </>
          ) : (
            ai.status !== 'loading' && (
              <div className="search-no-results">No results for &quot;{searchQuery}&quot;</div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
