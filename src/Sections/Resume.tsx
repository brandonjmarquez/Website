import React, { useRef, useState } from "react";
import { usePdf } from 'react-pdf-js';

const Resume = () => {
  const canvasRef = useRef(null);

  const [ pdfDocument, pdfPage ] = usePdf({
    file: '/Website/Resume.pdf',
    page: 1,
    canvasEl: canvasRef,
  });

  return (
    <section id='resume'>
      <div className='container'>
        <h3 className='subtitle'>Resume</h3>
        <div id="resume-pdf">
          <canvas ref={canvasRef} />
          {Boolean(pdfDocument && pdfDocument.numPages)}
        </div>
        
        {/* <div className='resume-container'>
          <h4 className='resume-title main-text'>Education</h4>
          <div className='resume-item'>
            <p className='main-text'><strong>Texas State University</strong> - Bachelors of Science in Computer Science, August 2023 - May 2025</p>
            <p className='main-text'><strong>Austin Community College</strong> - Associates of Science in Computer Science, August 2021 - May 2023</p>
            <p className='main-text'><strong>Tech Talent South</strong> - Full Stack Web Development Course, February 2023 - May 2023</p>
          </div>
        </div>
        <div className='resume-container'>
          <h4 className='resume-title main-text'>Technical Skills</h4>
          <div className='resume-item'>
            <p className='main-text'>C++, Java, HTML5, CSS, JavaScript, React.js, Node.js, Express.js, Strapi, MySQL, T-SQL, MongoDB, VS Code, MS Excel, MS Word, Wordpress, Docker</p>
          </div>
        </div>
        <div className='resume-container'>
          <h4 className='resume-title main-text'>Projects</h4>
          <div className='resume-item'>
            <p className='main-text'><strong>Piano MERN Stack Application</strong></p>
            <p className='main-text'>June 2022 - Present</p>
            <ul>
              <li className='main-text'>Hosted at <a href="https://piano-roll.vercel.app/">https://piano-roll.vercel.app/</a></li>
              <li className='main-text'>Created an Express.js server that is used to serve static sound files, and manage MongoDB connections.</li>
              <li className='main-text'>Wrote a functional piano using React.js that works using a qwerty keyboard.</li>
              <li className='main-text'>Display shows recorded notes on a timeline as they are being played and recorded.</li>
              <li className='main-text'>Input from the piano can be recorded and exported as “.mid” files.</li>
              <li className='main-text'>Users can log in and register to save their work to the MongoDB database.</li>
            </ul>
            <p className='main-text'><strong>This Website</strong></p>
            <p className='main-text'>February 2023 - March 2023</p>
            <ul>
              <li className='main-text'>Created using React.js. Includes a demo of my piano MERN stack application as a reusable component.</li>
            </ul>
          </div>
          <h4 className='resume-title main-text'>Experience</h4>
          <div className='resume-item'>
            <p className='main-text'><strong>Marketing & Sales</strong> - Custom Motor Group Co, Pflugerville, TX</p>
            <p className='main-text'>November 2021 - September 2022</p>
            <ul>
              <li className='main-text'>Wrote website content to get the best SEO results.</li>
              <li className='main-text'>Slimmed down HTML and CSS of the website's pages to help reduce load times.</li>
              <li className='main-text'>Patched malfunctioning CSS/Javascript that was present upon being hired.</li>
              <li className='main-text'>Communicated with customers through online chat systems, or by returning calls, to help them learn more about the cars they were interested in.</li>
              <li className='main-text'>Answered any questions a walk in customer might have related to financing a car, information about a car, and any other questions.</li>
            </ul>
            <p className='main-text'><strong>SI Leader</strong> - Texas State University SLAC, San Marcos, TX</p>
            <p className='main-text'>November 2021 - September 2022</p>
            <ul>
              <li className='main-text'>Hosted weekly study sessions, orally presenting material covered in class, and assisted students in studying that material.</li>
              <li className='main-text'>Developed worksheets and activities for student engagement in alignment with material covered in class.</li>
              <li className='main-text'>Moderated sessions via Zoom during COVID-19 pandemic.</li>
            </ul>
          </div>
        </div> */}
      </div>
    </section>
  )
}

export default Resume;