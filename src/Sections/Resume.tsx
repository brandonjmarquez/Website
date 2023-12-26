import React, { useEffect, useRef, useState } from "react";

const Resume = () => {
  const resumeUrl = "https://docs.google.com/document/d/1op-vHQPsjwo0lSocbo-WvGVJJ6acpt-A-xvTxt-7ZZA/edit?usp=sharing";

  return (
    <section id='resume'>
      <div className='container'>
        <h3 className='subtitle'>Resume</h3>
        <span className="instructions"> Click to enlarge.</span>
        <div id="resume-pdf">
          <iframe src={resumeUrl} className="resume-iframe" />
          <a href={resumeUrl} className="resume-link">Link to my resume.</a>
        </div>
      </div>
    </section>
  )
}

export default Resume;