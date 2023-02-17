import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { FaCircle, FaInfoCircle } from 'react-icons/fa'
import Piano from './Piano/Piano';

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
    return (navRect && headerRect) && <style>
        {`
          
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
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  return (
    <>
      <div ref={pianoRef} className='App'>
        <header ref={headerCb} className='App-header section'>
          <div className='left-header'>
            {/* <div> */}
              <h1 className='title'>Welcome!<br></br>My name is Brandon</h1>
              {"\n"}
              <h3 className='subtitle'>I am a full stack web developer, but I have a personal love for the front end.</h3>
              <h3 className='subtitle piano-text'>If you want to know more about the piano you can click the "<FaInfoCircle />" in the top left corner.</h3>
            {/* </div> */}
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
              <a className='nav-item' href='#resume'>Resume</a>
              <a className='nav-item' href='#projects'>Projects</a>
            </nav>
          </div>
        </header>
        <section id='about-me' className='section'>
          <div className='container'>
            
          </div>
        </section>
        <section id='resume' className='section'>
          <div className='container'>
            <h3 className='subtitle'>Resume</h3>
            <div className='resume-container'>
              <h4 className='resume-title resume-text'>Education</h4>
              <div className='resume-item'>
                <p className='resume-text'><strong>Texas State University</strong> - August 2019 - July 2021</p>
                <p className='resume-text'><strong>Austin Community College</strong> - Associates of Science in Computer Science, August 2021 - May 2023</p>
              </div>
            </div>
            <div className='resume-container'>
              <h4 className='resume-title resume-text'>Skills</h4>
              <div className='resume-item'>
                <p className='resume-text'>Great Work Ethic, High Attention to Detail in all Tasks, Excellent Computer Literacy, Working with People, Quick Learner, Passionate About Problem Solving, Customer Service, Time Management, Multitasking</p>
              </div>
            </div>
            <div className='resume-container'>
              <h4 className='resume-title resume-text'>Technical Skills</h4>
              <div className='resume-item'>
                <p className='resume-text'>C++, C, C#, Java, Python, HTML5, CSS, JavaScript, React.js, Node.js, MySQL, T-SQL, MongoDB, VS Code, MS Excel, MS Word, Google Analytics, Google Search Console, Wordpress, Docker</p>
              </div>
            </div>
            <div className='resume-container'>
              <h4 className='resume-title resume-text'>Experience</h4>
              <div className='resume-item'>
                <p className='resume-text'><strong>Piano MERN Stack Application</strong> - Myself</p>
                <p className='resume-text'>June 2022 - Present</p>
                <ul>
                  <li className='resume-text'>MERN, in this case, stands for MongoDB, Express.js, React.js, and Node.js.</li>
                  <li className='resume-text'>Currently Runs locally using docker and docker-compose.</li>
                  <li className='resume-text'>Created an Express.js server that is used to serve static sound files, and manage database connections.</li>
                  <li className='resume-text'>Styled with CSS and layout designed with HTML.</li>
                  <li className='resume-text'>Wrote a functional piano that works using a qwerty keyboard.</li>
                  <li className='resume-text'>Input from the piano can be recorded and exported as “.mid” files.</li>
                  <li className='resume-text'>Users can log in and register to save their work to the database.</li>
                  <li className='resume-text'>Designed a UI that shows what note is being played.</li>
                  <li className='resume-text'>Display shows recorded notes on a timeline as they are being played and recorded.</li>
                </ul>
              </div>
              <div className='resume-item'>
                <p className='resume-text'><strong>Marketing & Sales</strong> - Custom Motor Group Co.</p>
                <p className='resume-text'>November 2021 - September 2022</p>
                <ul>
                  <li className='resume-text'>Wrote website content to get the best SEO results.</li>
                  <li className='resume-text'>Slimmed down HTML and CSS of the website's pages to help reduce load times.</li>
                  <li className='resume-text'>Patched malfunctioning CSS/Javascript that was present upon being hired.</li>
                  <li className='resume-text'>Communicated with customers through online chat systems, or by returning calls, to help them learn more about the cars they were interested in.</li>
                  <li className='resume-text'>Answered any questions a walk in customer might have related to financing a car, information about a car, and any other questions.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </>
  );
}

export default App;
