import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HiOutlineMenu, HiOutlineArrowNarrowRight, HiOutlineExternalLink } from 'react-icons/hi';
import ChatMessage from '../Components/Chat/ChatMessage';
import Sidebar from '../Components/General/Sidebar';
import ProjectVisual from '../Components/Projects/ProjectVisual';
import { useIsMobile } from '../hooks/useIsMobile';
import projectsData from '../Data/projects.json';
import './ProjectsPage.css';

/**
 * Projects.
 *
 * Five pinned projects cycle through a sticky stage on a timer. Clicking a row
 * holds that project and stops the cycle; clicking it again releases it.
 * Hovering deliberately does nothing — the rotation stays predictable.
 * Everything else sits in a grid below the divider.
 */

const PINNED = ['MTS', 'CONDITIONAL', 'Uncertainty Labs', 'The Spread', '877UNMPLYD'];
const ROTATE_MS = 6000;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const Stack = ({ tech }) => (
  <ul className="pj-stack">
    {tech.map((item) => (
      <li key={item} className="pj-stack-item">
        {item}
      </li>
    ))}
  </ul>
);

const ProjectCard = ({ project }) => (
  <a
    className="pj-card"
    href={project.link}
    target="_blank"
    rel="noopener noreferrer"
    style={{ '--pj-card-live': project.visual.accent }}
  >
    <div className="pj-card-screen">
      <ProjectVisual visual={project.visual} label={project.name} />
    </div>
    <div className="pj-card-body">
      <span className="pj-card-domain">{project.domain}</span>
      <h3 className="pj-card-name">{project.name}</h3>
      <p className="pj-card-desc">{project.desc}</p>
      <Stack tech={project.tech} />
      {/* A span, not a link: the whole card is already the link. */}
      <span className="pj-visit pj-visit-card">
        Visit
        <HiOutlineArrowNarrowRight />
      </span>
    </div>
  </a>
);

const ProjectsPage = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [autoIndex, setAutoIndex] = useState(0);
  const [heldIndex, setHeldIndex] = useState(null);

  const pinned = useMemo(
    () => PINNED.map((name) => projectsData.find((p) => p.name === name)).filter(Boolean),
    []
  );
  const rest = useMemo(() => projectsData.filter((p) => !PINNED.includes(p.name)), []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const rotating = heldIndex === null && !isMobile && !prefersReducedMotion();

  // The cycle. Held selections and reduced-motion both stop it.
  useEffect(() => {
    if (!rotating) return undefined;
    const id = setInterval(() => {
      setAutoIndex((i) => (i + 1) % pinned.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [rotating, pinned.length]);

  const shown = heldIndex ?? autoIndex;
  const active = pinned[shown] || pinned[0];

  // Click holds a project; clicking the held one again resumes the cycle.
  const toggleHold = useCallback((index) => {
    setHeldIndex((current) => {
      if (current === index) return null;
      setAutoIndex(index);
      return index;
    });
  }, []);

  const accentStyle = useMemo(() => ({ '--pj-live': active.visual.accent }), [active]);

  return (
    <div className="projects-page" style={accentStyle}>
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

          <div className="pj-page">
            <div className="pj-chat">
              <ChatMessage role="user" content="What has Dhruv built?" />
              <ChatMessage
                role="assistant"
                content="Prediction market tools, AI products, data analysis, and web apps. These five cycle on their own — click one to hold it — and everything else is below."
              />
            </div>

            {/* Pinned five. */}
            <div className="pj-rack">
              <aside className="pj-stage">
                <div className="pj-stage-frame">
                  <div className="pj-stage-bar">
                    <span className="pj-stage-domain">{active.domain}</span>
                    <span className="pj-stage-state">
                      {heldIndex === null ? 'cycling' : 'held'}
                    </span>
                  </div>
                  <div className="pj-stage-screen" key={active.name}>
                    <ProjectVisual visual={active.visual} label={active.name} />
                    <span className="pj-stage-sweep" />
                    {rotating && (
                      <span
                        className="pj-stage-progress"
                        key={`progress-${shown}`}
                        style={{ animationDuration: `${ROTATE_MS}ms` }}
                      />
                    )}
                  </div>
                </div>

                {/* Fixed height so the panel never jumps between projects. */}
                <div className="pj-stage-readout">
                  <div className="pj-stage-text" key={`${active.name}-meta`}>
                    <h2 className="pj-stage-name">{active.name}</h2>
                    <p className="pj-desc pj-desc-clamp">{active.desc}</p>
                    <Stack tech={active.tech} />
                  </div>
                  <a
                    className="pj-visit pj-visit-stage"
                    href={active.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit {active.name}
                    <HiOutlineExternalLink />
                  </a>
                </div>
              </aside>

              <ol className="pj-register">
                {pinned.map((project, index) => (
                  <li
                    key={project.name}
                    className={`pj-row ${shown === index ? 'is-active' : ''}`}
                    style={{ '--pj-row-live': project.visual.accent }}
                  >
                    <button
                      type="button"
                      className="pj-row-select"
                      onClick={() => toggleHold(index)}
                      aria-pressed={heldIndex === index}
                    >
                      <span className="pj-row-domain">{project.domain}</span>
                      <span className="pj-row-name">{project.name}</span>
                    </button>

                    {/* The stacked layout's version of the stage. */}
                    <div className="pj-row-inline">
                      <div className="pj-row-screen">
                        <ProjectVisual visual={project.visual} label={project.name} />
                      </div>
                      <p className="pj-desc">{project.desc}</p>
                      <Stack tech={project.tech} />
                    </div>

                    <a
                      className="pj-visit pj-visit-row"
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit
                      <HiOutlineExternalLink />
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pj-divider">
              <span>More projects</span>
            </div>

            <div className="pj-grid">
              {rest.map((project) => (
                <ProjectCard key={project.name} project={project} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectsPage;
