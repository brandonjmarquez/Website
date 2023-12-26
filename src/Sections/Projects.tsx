const Projects = () => {
  return (
    <section id="projects">
      <div className="container">
        <h3 className="subtitle">Projects</h3>
        <span className="instructions"> Click the images to navigate to where they're hosted.</span>
        <div className="grid-container">
          <div className="project-container">
            <a href="https://piano-roll.vercel.app" target="_blank" className="proj-link">
              <img src="/Website/projects/piano.png" className="project-pic" loading="lazy"></img>
            </a>
            <p className="subtext"><strong><a href="https://piano-roll.vercel.app" target="_blank">Recordable Piano Instrument</a></strong></p>
            <p className="proj-desc">This is an in browser piano instrument that can be played and recorded with a computer keyboard. It is made using TypeScript and React.js. Recordings can be exported and used in any modern DAW.</p>
            <a href="https://github.com/brandonjmarquez/piano-roll" target="_blank">Github Repo</a>
          </div>

          <div className="project-container">
            <a href="https://brandonjmarquez.github.io/Website/">
              <img src="/Website/projects/website.png" className="project-pic" loading="lazy"></img>
            </a>
            <p className="subtext"><strong><a href="https://brandonjmarquez.github.io/Website/">This Website</a></strong></p>
            <p className="proj-desc">My website, made with TypeScript and React.js. </p>
            <a href="https://github.com/brandonjmarquez/Website" target="_blank">Github Repo</a>
          </div>

          <div className="project-container">
            <a href="https://car-dealership-woad.vercel.app" target="_blank" className="proj-link">
              <img src="/Website/projects/car-dealership.png" className="project-pic" loading="lazy"></img>
            </a>
            <p className="subtext"><strong><a href="https://car-dealership-woad.vercel.app" target="_blank">Car Dealership Website</a></strong></p>
            <p className="proj-desc">A mock car dealership website. Made with TypeScript and React.js. Styled with TalwindCSS and Emotion.</p>
            <a href="https://github.com/brandonjmarquez/car-dealership">Github Repo</a>
          </div>

          <div className="project-container">
            <a href="https://blab-times.vercel.app/" target="_blank" className="proj-link">
              <img src="/Website/projects/blab-times.png" className="project-pic" loading="lazy"></img>
            </a>
            <p className="subtext"><strong><a href="https://blab-times.vercel.app/" target="_blank">Blab Times Blog</a></strong></p>
            <p className="proj-desc">A blog I made for my girlfriend! Made with TypeScript, React.js, Astro, Strapi, and TalwindCSS.</p>
            <a href="https://github.com/brandonjmarquez/blab-times">Github Repo</a>
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