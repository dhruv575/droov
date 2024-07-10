import React from 'react';
import HomeHeader from '../Components/Home/HomeHeader';
import './Home.css';
import Separator from '../Components/General/Seperator';
import DataProjectsCarousel from '../Components/Home/DataProjectsCarousel';
import ExperimentsGrid from '../Components/Home/ExperimentsGrid';

const Home = () => {
  return (
    <div className="home">
      <HomeHeader />
      <Separator />
      <DataProjectsCarousel id="data" />
      <Separator />
      <ExperimentsGrid id="experiments" />
      <Separator />
    </div>
  );
};

export default Home;
