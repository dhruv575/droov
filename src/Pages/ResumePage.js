import React, { useRef, useEffect, useState } from 'react';
import { HiOutlineArrowDown, HiOutlineMenu } from 'react-icons/hi';
import ChatMessage from '../Components/Chat/ChatMessage';
import Sidebar from '../Components/General/Sidebar';
import './ResumePage.css';

const ResumePage = () => {
  const chatEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const educationContent = `Dhruv will be graduating from the **University of Pennsylvania** in May 2027 with a Bachelors of Engineering in **Artificial Intelligence**. He has a 3.97 GPA and has topped several courses at Penn like Big Data Analytics and Linear Algebra for ML & AI.`;

  const workExperienceContent = `He will be interning at **Jane Street** in New York from May 2026 to August 2026 as a **Strategy and Product** Intern. 

  Currently, he commits a lot of his time to **[Polymarket](https://news.polymarket.com/)**, working on engineering products for their **data-driven journalism** team. He built a market-fetching + html email-generation tool powering Polymarket's daily market insights newsletter to **200,000+ users** and has led to **$1million+ in deposits**. He's also working on a lot of other cool half-finished projects he can't wait to talk more about.

  His sophomore summer was spent at **Morgan Stanley** in New York as a **Fixed Income Quant Intern** on the mortgage backed securities desk. He developed highly interpretable XGBoost models for predicting month-by-month mortgage prepayment and default on a loan level and wrote a script using the model to calculate cashflows for loan pools. This model is now in production for **billion+ in annual lending**. He loves talking about this project if you have any questions.

  Before that, he was at **[Ryval](https://www.ryval.com/)** as a Founding Applied Mathematician. He formulated a [dynamically shifting odds-pricing algorithm](https://drive.google.com/file/d/1vZ1aFQofTKehoAzn-X1J8bep44aSd1fG/view?usp=sharing) for spot betting on Twitch streams to ensure 10% profit and implemented and deployed a web socket based server to handle live bet limit and odd updates. He also worked at the **University of Pennsylvania** as a **Teaching Assistant for Linear Algebra for ML & AI**, and as a SWE Intern at **[Venture Camp](https://www.venturecamp.org/)** building a mini version of Clay.
`;
  const leadershipContent = `His main commitment at Penn was as co-director of **[Hack4Impact](https://upenn.hack4impact.org/)**, leading ~40 of Penn's brightest engineers to build software for nonprofit organizations. He led the move from 3 projects a semester to 6, led 2 projects himself for [Fulfill NJ](https://fulfillnj.org/) and [Baldwin School](https://www.baldwinschool.org/), and biult out a lot of social efforts like lins and alumni relations. 

  He also built out the **[Signal Society](https://www.thesign.al/)**'s website + a bunch of smaller projects for it, was the VP of Finance for [WhartonGRC](https://www.whartongrc.org/) (who's website he also built), and was head of entrepreneurship at the Daily Pennsylvanian.

  Outside of that, he was also a fellow for **[Comma Capital](https://comma.vc/)**
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

