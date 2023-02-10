import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { FaCircle, FaInfoCircle } from 'react-icons/fa'
import Piano from './Piano/src/Piano';

function App() {
  const [dimensions, setDimensions] = useState<{height: number, width: number}>();
  const [navRect, setNavRect] = useState<DOMRect>();
  const navCb = useCallback((node: HTMLElement) => {
    if(node !== null) {
      setNavRect(node.getBoundingClientRect());
    }
  }, [dimensions]);
  const [headerRect, setHeaderRect] = useState<DOMRect>();
  const headerCb = useCallback((node: HTMLElement) => {
    if(node !== null) {
      setHeaderRect(node.getBoundingClientRect())
    }
  }, [dimensions, navRect]);
  const pianoRef = useRef<HTMLDivElement>(null)
  const looking = true;

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  return (
    <>
      {(navRect && headerRect) && <style>
        {`
          .navbar {
            top: ${headerRect.height - navRect.height / 2}px;
          }

          .right-header {
            margin-bottom: ${navRect.height}px;
          }
        `}
      </style>}
      <div ref={pianoRef} className='App'>
        <header ref={headerCb} className="App-header container">
          <div className='left-header'>
            <div>
              <h1 className='title'>Hi! My name is Brandon</h1>
              {"\n"}
              <h4 className='subtitle'>I am a full stack developer, but I have a personal love for the front end.</h4>
              <h5 className='subtitle'>If you want to know more about the piano you can click the "<FaInfoCircle />" in the top left corner.</h5>
            </div>
          </div>
          <div className='right-header'>
            <div className='recruitment'>
              <div className='recruit-container'>
                <span className='recruitment-status'><strong>Recruitment Status:</strong></span>
                <span className='recruitment-light'>●</span>
                <span className='header-text'>{/*<FaCircle className='recruitment-light' />*/}{(looking) ? 'Looking for work' : 'Not looking for work'}</span>
              </div>
            </div>
            <div id='piano'>
              <Piano pianoRef={pianoRef}/>
            </div>
          </div>
        </header>
        <nav ref={navCb} className='navbar'>
          <a className='nav-item' href='#about-me'>About Me</a>
          <a className='nav-item' href='#projects'>Projects</a>
          <a className='nav-item' href='#contact'>Contact</a>
        </nav>
        <section id='about-me'>
          <div className='about-me-containter'>

          </div>
        </section>
        
      </div>
    </>
  );
}

export default App;
