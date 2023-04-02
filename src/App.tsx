import { useEffect, useRef, useState } from 'react';
import './App.css';
import Header from './Sections/Header';
import AboutMe from './Sections/AboutMe';
import Projects from './Sections/Projects';
import Resume from './Sections/Resume';

function App() {
  const pianoRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div className='App'>
        <Header />
        <AboutMe />
        <Projects />
        <Resume />
      </div>
    </>
  );
}

export default App;
