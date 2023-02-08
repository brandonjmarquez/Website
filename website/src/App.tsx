import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { FaCircle } from 'react-icons/fa'
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
  }, [dimensions]);
  const looking = true;

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  return (
    <>
      {(navRect && headerRect) ? <style>
        {`
          .navbar {
            top: ${headerRect.height - navRect.height / 2}px
          }
        `}
      </style> : null}
      <div className="App">
        <header ref={headerCb} className="App-header">
          <div className='left-header'>

          </div>
          <div className='right-header'>
            <div className='recruitment'>
              <div className='recruit-container'>
                <span className='recruitment-status'><strong>Recruitment Status:</strong></span>
                <FaCircle className='recruitment-light' />
                <span className='header-text'>{(looking) ? 'Looking for work' : 'Not looking for work'}</span>
              </div>
            </div>
            <div id='piano'>
              <Piano />
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
