import React from 'react';

const AboutMe = () => {
  return (
    <section id='about-me' className='section'>
      <div className='container'>
        <div className='left-about'>
          <h3 className='subtitle'>About Me</h3>
          <img src='/Website/me/me.png' width="10em" className='me' loading='lazy'
            srcSet='/Website/me/me-150.png 150w,
                    /Website/me/me-275.png 275w,
                    /Website/me/me-400.png 400w,
                    /Website/me/me.png 536w'
          ></img>
        </div>
        <div className='right-about'>
          <p className='main-text about-subtitle'>Some facts about me:</p>
          <ul>
            <li className='main-text'>I will be graduating in December 2025 from Texas State University with an Bachelors Degree in Computer Science.</li>
            <li className='main-text'>I have a <strong>strong</strong> passion for coding, music production, and my <a href="/Website/suzie.jpg" target="_blank" className="suzie">cat<span><img id="cutest-cat-ever" src="/Website/suzie.jpg" alt="cutest cat ever" height="300" /></span></a>.</li>
            <li className='main-text'>I make music!(Here's my <a href='https://soundcloud.com/user-550415450'>soundcloud</a> if you want to check it out)</li>
            <li className='main-text'>I've been coding for about 7 years now, and I'm not stopping any time soon.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default AboutMe;