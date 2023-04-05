import React from "react";

const Projects = () => {
  return (
    <section id="projects">
      <div className="container">
        <h3 className="subtitle">Projects</h3>
        <div className="grid-container">
          <div className="project-container">
            <a href="https://github.com/brandonjmarquez/piano-roll" target="_blank">
              <img src="/Website/projects/piano.png" className="project-pic" loading="lazy"></img>
            </a>
            <p className="subtext"><strong>Recordable Piano Instrument</strong></p>
            <p className="proj-desc">This is an in browser piano instrument that can be played and recorded with a computer keyboard. It is made using TypeScript and React.js. Recordings can be exported and used in any modern DAW.</p>
            <a href="https://github.com/brandonjmarquez/piano-roll">Github Page</a>
          </div>
          <div className="project-container">
            <a href="https://github.com/brandonjmarquez/Website" target="_blank">
              <img src="/Website/projects/website.png" className="project-pic" loading="lazy"></img>
            </a>
            <p className="subtext"><strong>This Website</strong></p>
            <p className="proj-desc">My website, made with TypeScript and React.js. </p>
            <a href="https://github.com/brandonjmarquez/Website">Github Page</a>
          </div>
          <div className="project-container">
            <a href="https://car-dealership-woad.vercel.app" target="_blank">
              <img src="/Website/projects/car-dealership.png" className="project-pic" loading="lazy"></img>
            </a>
            <p className="subtext"><strong>Car Dealership Website</strong></p>
            <p className="proj-desc">A mock car dealership website. Made with TypeScript, React.js, TalwindCSS, and Emotion.</p>
            <a href="https://github.com/brandonjmarquez/car-dealership">Github Page</a>
          </div>
          <div className="project-container">
            <a>
              <img src="/Website/projects/black.png" className="project-pic" loading="lazy"></img>
            </a>
            <p className="subtext"><strong>TBD</strong></p>
            <p className="proj-desc">My next project... Who knows what it may be...</p>
            {/* <a href="">Github Page</a> */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects;