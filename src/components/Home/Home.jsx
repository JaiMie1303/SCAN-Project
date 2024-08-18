import React from 'react';
import Search from './Search/Search';
import About from './About/About';
import Tariffs from './Tariffs/Tariffs';

const Home = () => {
  return (
    <div>
      <Search />
      <About />
      <Tariffs />
    </div>
  );
};

export default Home;