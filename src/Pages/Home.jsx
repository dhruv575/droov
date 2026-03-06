import React from 'react';
import './Home.css';
import Separator from '../Components/General/Seperator';
import DataProjectsCarousel from '../Components/Home/DataProjectsCarousel';
import ExperimentsGrid from '../Components/Home/ExperimentsGrid';

const Home = () => {
  return (
    <div className="home">
      <Separator />
      <DataProjectsCarousel id="data" />
      <Separator />
      <ExperimentsGrid id="experiments" />
      <Separator />
    </div>
  );
};

export default Home;
