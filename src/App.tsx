import { useEffect, useRef, useState } from 'react';
import './App.css';
import { FaInfoCircle } from 'react-icons/fa'
import Piano from './Piano/Piano';

function App() {
  const [dimensions, setDimensions] = useState<{height: number, width: number}>({height: window.innerHeight, width: window.innerWidth});
  const pianoRef = useRef<HTMLDivElement>(null)
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
      <div ref={pianoRef} className='App'>
        <header className='App-header section'>
          <div className='left-header'>
            {/* <div> */}
              <h1 className='title'>Welcome!<br></br>My name is Brandon</h1>
              {"\n"}
              <p className='subtext'>I am a full stack web developer, but I have a personal love for the front end.</p>
              <p className='subtext piano-text'>If you want to know more about the thing to the right you can click the "<FaInfoCircle />" in its top left corner.</p>
              <p className='subtext no-piano-text'>Visit this site on desktop to try out a demo of my piano app!</p>
            {/* </div> */}
          </div>
          <div className='right-header'>
            <div id='recruit-container'>
              <span className='recruitment-status'><strong>Recruitment Status:</strong></span>
              <span className='recruitment-light'>●</span>
              <span className='recruitment-text'>{/*<FaCircle className='recruitment-light' />*/}{(looking) ? 'Looking for work' : 'Not looking for work'}</span>
              
            </div>
            <div id='piano'>
              <Piano pianoRef={pianoRef} dimensions={dimensions} />
            </div>
          </div>
          <div id='nav-container'>
            <nav className='navbar'>
              <a className='nav-item' href='#about-me'>About Me</a>
              <a className='nav-item' href='#projects'>Projects</a>
              <a className='nav-item' href='#resume'>Resume</a>
            </nav>
          </div>
        </header>
        <section id='about-me' className='section'>
          <div className='container'>
            <div className='left-about'>
              <h3 className='subtitle'>About Me</h3>
              <img src='/Website/suzie.jpeg' height="300" loading='lazy'></img>
            </div>
            <div className='right-about'>
              <p className='main-text about-subtitle'>Some facts about me:</p>
              <ul>
                <li className='main-text'>I am a recent graduate from ACC with an Associates Degree in Computer Science.</li>
                <li className='main-text'>I have a <strong>strong</strong> passion for coding, music production, and my cat(her name is Suzie).</li>
                <li className='main-text'>I make music!(Here's my <a href='https://soundcloud.com/user-550415450'>soundcloud</a> if you want to check it out)</li>
                
              </ul>
            </div>
          </div>
        </section>
        <section id='resume' className='section'>
          <div className='container'>
            <h3 className='subtitle'>Resume</h3>
            <div className='resume-container'>
              <h4 className='resume-title main-text'>Education</h4>
              <div className='resume-item'>
                <p className='main-text'><strong>Texas State University</strong> - August 2019 - July 2021</p>
                <p className='main-text'><strong>Austin Community College</strong> - Associates of Science in Computer Science, August 2021 - May 2023</p>
              </div>
            </div>
            <div className='resume-container'>
              <h4 className='resume-title main-text'>Skills</h4>
              <div className='resume-item'>
                <p className='main-text'>Great Work Ethic, High Attention to Detail in all Tasks, Excellent Computer Literacy, Working with People, Quick Learner, Passionate About Problem Solving, Customer Service, Time Management, Multitasking</p>
              </div>
            </div>
            <div className='resume-container'>
              <h4 className='resume-title main-text'>Technical Skills</h4>
              <div className='resume-item'>
                <p className='main-text'>C++, C, C#, Java, Python, HTML5, CSS, JavaScript, React.js, Node.js, MySQL, T-SQL, MongoDB, VS Code, MS Excel, MS Word, Google Analytics, Google Search Console, Wordpress, Docker</p>
              </div>
            </div>
            <div className='resume-container'>
              <h4 className='resume-title main-text'>Experience</h4>
              <div className='resume-item'>
                <p className='main-text'><strong>Piano MERN Stack Application</strong> - Myself</p>
                <p className='main-text'>June 2022 - Present</p>
                <ul>
                  <li className='main-text'>MERN, in this case, stands for MongoDB, Express.js, React.js, and Node.js.</li>
                  <li className='main-text'>Currently Runs locally using docker and docker-compose.</li>
                  <li className='main-text'>Created an Express.js server that is used to serve static sound files, and manage database connections.</li>
                  <li className='main-text'>Styled with CSS and layout designed with HTML.</li>
                  <li className='main-text'>Wrote a functional piano that works using a qwerty keyboard.</li>
                  <li className='main-text'>Input from the piano can be recorded and exported as “.mid” files.</li>
                  <li className='main-text'>Users can log in and register to save their work to the database.</li>
                  <li className='main-text'>Designed a UI that shows what note is being played.</li>
                  <li className='main-text'>Display shows recorded notes on a timeline as they are being played and recorded.</li>
                </ul>
              </div>
              <div className='resume-item'>
                <p className='main-text'><strong>Marketing & Sales</strong> - Custom Motor Group Co.</p>
                <p className='main-text'>November 2021 - September 2022</p>
                <ul>
                  <li className='main-text'>Wrote website content to get the best SEO results.</li>
                  <li className='main-text'>Slimmed down HTML and CSS of the website's pages to help reduce load times.</li>
                  <li className='main-text'>Patched malfunctioning CSS/Javascript that was present upon being hired.</li>
                  <li className='main-text'>Communicated with customers through online chat systems, or by returning calls, to help them learn more about the cars they were interested in.</li>
                  <li className='main-text'>Answered any questions a walk in customer might have related to financing a car, information about a car, and any other questions.</li>
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
