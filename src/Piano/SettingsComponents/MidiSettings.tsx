import React, { useState, useEffect, useRef, ReactPortal } from 'react';
import { MidiSettingsProps } from '../Tools/Interfaces';
import DragLabel from '../Tools/DragLabel'
import './Settings.css';
import { FaArrowsAltV } from 'react-icons/fa';
import { createPortal } from 'react-dom';

interface BpmInputProps {
  bpm: number;
  midiDispatch: Function;
}

function BpmInput(props: BpmInputProps) {
  const ref = useRef(null);

  useEffect(() => {
    if(props.bpm > 160) {
      alert('BPM cannot exceed 160.')
      props.midiDispatch({type: 'bpm', bpm: 120})
    }
  }, [props.bpm]);

  return <>
    <DragLabel plane='y' range={[0, 161]} style={{cursor: 'ns-resize', userSelect: 'none'}} text={<><FaArrowsAltV style={{verticalAlign: 'middle'}} />BPM</>} value={props.bpm} setValue={(bpm: number) => { props.midiDispatch({type: 'bpm', bpm: bpm})}} />
    <input ref={ref} className='bpm-input settings input' value={props.bpm.toString()} onChange={(e) => (e.target.value === '' || /[A-Za-z]/g.test(e.target.value)) ? props.midiDispatch({type: 'bpm', bpm: 0}) : props.midiDispatch({type: 'bpm', bpm: parseInt(e.target.value)})} />
  </>
}

function MidiSettings(props: MidiSettingsProps) {
  const [modal, setModal] = useState<ReactPortal | null>();

  function renderNumMeasures() {
    var measureOpts = [];
    for(var i = 1; i < 9; i++) {
      measureOpts.push(<option key={i} value={i}>{i}</option>);
    }
    return measureOpts;
  }

  function newTrack() {
    var picked = 'none';

    pickNew();
    function pickNew() {
      if(picked === 'none' && props.selectorsRef.current) {
        setModal(createPortal(<div id='popup'>
          <div id='popup-bg'></div>
          <div id='popup-select' className='popup select' style={{
            marginTop: `${props.selectorsRef.current.offsetHeight / 4}px`,
            zIndex: 6
          }}>
            <button type='button' className='popup-button settings button' 
              onClick={() => {
                picked = 'new'; 
                document.getElementById('popup-bg')!.classList.toggle('lift-out');
                document.getElementById('popup-select')!.classList.toggle('lift-out');
                setTimeout(() => setModal(null), 500)
              }}
            >Start New Track</button>
            <button type='button' className='popup-button settings button' 
              onClick={() => {
                picked = 'dont'; 
                document.getElementById('popup-bg')!.classList.toggle('lift-out');
                document.getElementById('popup-select')!.classList.toggle('lift-out');
                setTimeout(() => setModal(null), 500)
              }}
            >Keep Track</button>
          </div></div>, props.selectorsRef.current)
        );
        setTimeout(pickNew, 0);
      } else {
        if(picked === 'new') {
          props.setMidiNoteInfo([]);
        } else if(picked === 'dont') {
          return;
        }
      }
    }
  }

  return (
    <>
      {modal}
      <BpmInput bpm={props.bpm} midiDispatch={props.midiDispatch} />
      <button type='button' className='settings button' 
      onClick={() => {
        if(props.midiNoteInfoLength > 0) newTrack()
        else props.setMidiNoteInfo([]);
      }}>New</button>
    </>
    )
}

export default MidiSettings;