import React from "react";
import Piano from "../Piano/Piano";
import { FaInfoCircle } from 'react-icons/fa'

const Header = () => {
  const looking = true;

  return (
    <>
      <style>
        {`
          @keyframes light-flash {
            0%{color: var(--light-color-${looking ? 'l' : 'nl'});}
            50%{color: var(--light-color-${looking ? 'l' : 'nl'});}
            100%{color: var(--light-color-dim-${looking ? 'l' : 'nl'});}
          }
          
          @-webkit-keyframes light-flash {
            0%{color: var(--light-color-${looking ? 'l' : 'nl'});}
            50%{color: var(--light-color-${looking ? 'l' : 'nl'});}
            100%{color: var(--light-color-dim-${looking ? 'l' : 'nl'});}
          }
        `}
      </style>
      <header id='' className='App-header section'>
        <div className='left-header'>
          {/* <div> */}
            <h1 className='title'>Welcome!<br></br>My name is Brandon.</h1>
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
            <Piano />
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
    </>
  )
}

export default Header;