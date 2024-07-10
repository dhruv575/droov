import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FaTiktok, FaExternalLinkAlt } from 'react-icons/fa';
import dataProjects from '../../Data/dataProjects.json';
import './DataProjectsCarousel.css';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const DataProjectsCarousel = () => {
  return (
    <div className="data-projects-wrapper">
      <h2 className="title">Data Projects</h2>
      <Carousel
        responsive={responsive}
        ssr
        infinite
        autoPlay
        autoPlaySpeed={3000}
        keyBoardControl
        customTransition="transform 500ms ease-out"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={['tablet', 'mobile']}
        dotListClass="custom-dot-list-style"
        showDots={true}
      >
        {dataProjects.map((project, index) => (
          <div key={index} className="project-container">
            <img src={project.image} alt={project.name} className="project-logo" />
            <h3 className="project-name">{project.name}</h3>
            <p className="project-description">{project.desc}</p>
            <div className="project-tech">
              {project.tech.map((techItem, techIndex) => (
                <span key={techIndex} className="tech-tag">{techItem}</span>
              ))}
            </div>
            <div className="project-links">
              <a href={project.tiktok} target="_blank" rel="noopener noreferrer">
                <FaTiktok className="project-icon" />
              </a>
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <FaExternalLinkAlt className="project-icon" />
              </a>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default DataProjectsCarousel;
