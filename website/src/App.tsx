import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { FaCircle, FaInfoCircle } from 'react-icons/fa'
import Piano from './Piano/src/Piano';

function App() {
  const [dimensions, setDimensions] = useState<{height: number, width: number}>({height: window.innerHeight, width: window.innerWidth});
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
  const navStyles = useMemo(() => {
    window.scroll({top: 0})
    return (navRect && headerRect) && <style>
        {`
          .navbar {
            // top: ${headerRect.height - navRect.height / 2}px;
            // bottom: -${navRect.height / 2}px
          }

          .right-header {
            // margin-bottom: ${navRect.height}px;
          }
        `}
      </style> 
  }, [navRect, headerRect, dimensions])

  useEffect(() => {
    // console.log(document.activeElement)
  })

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
      {navStyles}
      <div ref={pianoRef} className='App'>
        <header ref={headerCb} className="App-header">
          <div className='left-header'>
            <div>
              <h1 className='title'>Hi! My name is Brandon</h1>
              {"\n"}
              <h4 className='subtitle'>I am a full stack web developer, but I have a personal love for the front end.</h4>
              <h5 className='subtitle piano-text'>If you want to know more about the piano you can click the "<FaInfoCircle />" in the top left corner.</h5>
            </div>
          </div>
          <div className='right-header'>
            <div id='recruit-container'>
              <span className='recruitment-status'><strong>Recruitment Status:</strong></span>
              <span className='recruitment-light'>●</span>
              <span className='recruitment-text'>{/*<FaCircle className='recruitment-light' />*/}{(looking) ? 'Looking for work' : 'Not looking for work'}</span>
              
            </div>
            <div id='piano'>
              <Piano pianoRef={pianoRef}/>
            </div>
          </div>
          <div id='nav-container'>
            <nav ref={navCb} className='navbar'>
              <a className='nav-item' href='#about-me'>About Me</a>
              <a className='nav-item' href='#projects'>Projects</a>
              <a className='nav-item' href='#contact'>Contact</a>
            </nav>
          </div>
        </header>
        <section id='about-me'>
          <div className='about-me-container'>

          </div>
        </section>
        
      </div>
    </>
  );
}

export default App;
