import React from "react";
import { FaLinkedin } from 'react-icons/fa'
import RandProjButton from "../RandProjButton/RandProjButton";

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
          <h1 className='title'>Welcome!<br></br>My name is Brandon.</h1>
          {"\n"}
          <p className='subtext'>I am a student at Texas State University pursuing a degree in computer science with a minor in applied mathematics.</p>
          <a href="https://www.linkedin.com/in/brandmarque/" target="_blank"><FaLinkedin /></a>
        </div>
        <div className='right-header'>
          <RandProjButton />
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