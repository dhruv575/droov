import React from 'react';
import { FaTiktok, FaExternalLinkAlt } from 'react-icons/fa';
import experimentsData from '../../Data/experiments.json';
import './ExperimentsGrid.css';

const ExperimentsGrid = () => {
  return (
    <div className="experiments-grid-wrapper">
      <h2 className="title">Experiments</h2>
      <div className="experiments-grid">
        {experimentsData.map((experiment, index) => (
          <div key={index} className="experiment-container">
            <img src={experiment.image} alt={experiment.name} className="experiment-logo" />
            <h3 className="experiment-name">{experiment.name}</h3>
            <p className="experiment-description">{experiment.desc}</p>
            <div className="experiment-tech">
              {experiment.tech.map((techItem, techIndex) => (
                <span key={techIndex} className="tech-tag">{techItem}</span>
              ))}
            </div>
            <div className="experiment-links">
              {experiment.tiktok && (
                <a href={experiment.tiktok} target="_blank" rel="noopener noreferrer">
                  <FaTiktok className="experiment-icon" />
                </a>
              )}
              <a href={experiment.link} target="_blank" rel="noopener noreferrer">
                <FaExternalLinkAlt className="experiment-icon" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperimentsGrid;
