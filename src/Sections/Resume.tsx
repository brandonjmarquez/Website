import React, { useEffect, useRef, useState } from "react";
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
        <span className="instructions"> Click to enlarge.</span>
        <div id="resume-pdf">
          <a href="/Website/Resume.pdf" target="_blank">
            <canvas ref={canvasRef} id="responsive-canvas" />
            {Boolean(pdfDocument && pdfDocument.numPages)}
          </a>
        </div>
      </div>
    </section>
  )
}

export default Resume;