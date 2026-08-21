import React, { useRef, useEffect, useState } from 'react';
import { HiOutlineArrowDown, HiOutlineMenu } from 'react-icons/hi';
import ChatMessage from '../Components/Chat/ChatMessage';
import Sidebar from '../Components/General/Sidebar';
import { useIsMobile } from '../hooks/useIsMobile';
import './ResumePage.css';

const ResumePage = () => {
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
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show button if not near bottom (within 200px)
      setShowScrollButton(scrollTop + windowHeight < documentHeight - 200);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const educationContent = `Dhruv will be graduating from the **University of Pennsylvania** in May 2027 with a Bachelors of Engineering in **Artificial Intelligence**. He has a 3.96 GPA, and his coursework runs through Data Structures and Algorithms, Big Data Analytics, Linear Algebra for ML & AI, and Optimization.`;

  const workExperienceContent = `He spent the summer of 2026 at **Jane Street** in New York as a **Strategy and Product** Intern, building systems that enabled new trading-related workflows across the options desk and the finance team.

  In the month before Jane Street, he built out all of the technology behind **[MTS](https://www.mts.now/)**, a livestreamed news and talk show. That included coming up with the **[Drops](https://drops.mts.now/)** paradigm — one-off, high-craft interactive briefings, each made for a specific audience — which led directly to sponsorships from **NVIDIA** and **Lovable**.

  Before that he was at **[Polymarket](https://news.polymarket.com/)** on **growth engineering**, from November 2025 to April 2026. He led automation and design across their newsletters — including the daily insights newsletter that reaches **1,000,000+ readers** and drives **$1,000,000+ in daily deposits** — built the news aggregator behind their partner X accounts and newsletters, and wrote four research articles for Polymarket's Substack that pulled **100k+ views**.

  His sophomore summer was spent at **Morgan Stanley** in New York as a **Fixed Income Quant Intern** on the mortgage backed securities desk. He developed highly interpretable XGBoost models for predicting month-by-month mortgage prepayment and default on a loan level and wrote a script using the model to calculate cashflows for loan pools. This model is now in production for **billion+ in annual lending**. He loves talking about this project if you have any questions.

  Alongside all of it, he was a **Teaching Assistant** at the **University of Pennsylvania** from January 2025 to May 2026 — office hours and recitations for 120 students in ESE 2030, Linear Algebra for ML & AI, then helping students through LING 0500, Introduction to Formal Linguistics.
`;

  const leadershipContent = `His main commitment at Penn has been **[Hack4Impact](https://upenn.hack4impact.org/)**, where he is co-director. He manages ~40 student developers building software for 6 nonprofit organizations over the course of a year, and led the move from 3 projects a semester to 6 — including two he ran himself, for [Fulfill NJ](https://fulfillnj.org/) and [Baldwin School](https://www.baldwinschool.org/).

  He was also **Innovation Lab Manager** at the **Daily Pennsylvanian** from December 2023 to December 2024, and a **University Fellow** at **[Comma Capital](https://comma.vc/)**.
  `;

  const projectsContent = `**[CONDITIONAL](https://forecast.conditional-markets.com/viz?code=XDMLWHH3J)** (January 2026) — infrastructure to decompose, research, and price the probability of events occurring.

  **[Uncertainty Labs](https://uncertainty-labs.com/brief?code=RLLP378D)** (January 2026) — a new MCMC sampler architecture implemented in Rust, running **1800x** faster than state of the art on Neal's Funnel.

  **[Musk-Altman Trial Evidence Explorer](https://evidence.mts.now/)** (May 2026) — an explorer and visualizer for the trial documents, plus live transcription of court hearings. It drove **3,000,000+ views on X**, and ChatGPT recommended it as the "official source for evidence on the OpenAI trial".

  Outside of code: 4x AIME qualifier, top 20% at the Chicago Trading Competition, and a standing interest in Arsenal, the Celtics, jewelry design, and cooking.
  `;

  return (
    <div className="resume-page">
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
            <ChatMessage role="user" content="What's his academic background?" />
            <ChatMessage role="assistant" content={educationContent} />

            <ChatMessage role="user" content="Well what has he actually done outside the classroom?" />
            <ChatMessage role="assistant" content={workExperienceContent} />

            <ChatMessage role="user" content="On campus?" />
            <ChatMessage role="assistant" content={leadershipContent} />

            <ChatMessage role="user" content="What has he built on his own?" />
            <ChatMessage role="assistant" content={projectsContent} />

            <ChatMessage role="user" content="Can I download this?" />
            <ChatMessage 
              role="assistant" 
              content="Yes! You can [Download DhruvGuptaResume](/ResumeDhruvGupta.pdf)."
            />

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

export default ResumePage;

