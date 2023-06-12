import * as React from 'react';
import { useState, useReducer, useEffect, useRef, useMemo, ReactPortal} from 'react'
import { Reducer, SoundState, SoundAction, MidiState, MidiAction, ControlsState, ControlsAction, KeyPressed, MidiNoteInfo } from './Tools/Interfaces';
import SoundSettings from './SettingsComponents/SoundSettings'
import MidiSettings from './SettingsComponents/MidiSettings'
import TimerButtons from './SettingsComponents/TimerButtons'
import KbFunctions from './Tools/KbFunctions'
import KeyNoteInput from './Tools/KeyNoteInput';
import Timer from './Tools/Timer';
import MidiRecorder from './MidiComponents/MidiRecorder/MidiRecorder';
import PianoInstrument from './PianoComponents/PianoInstrument/PianoInstrument';
import PianoRoll from './PianoComponents/PianoRoll/PianoRoll';
import Grid from './MidiComponents/Grid/Grid';
import './Piano.css';
import { FaCircle, FaInfoCircle, FaPlay, FaRegCircle, FaStop } from 'react-icons/fa';
import { createPortal } from 'react-dom';

function soundReducer(state: SoundState, action: any) {
  switch(action.type) {
    case 'sound':
      return {...state, sound: action.sound};
    case 'octave':
      return {...state, octave: action.octave};
    case 'volume':
      return {...state, volume: action.volume};
    default:
      return state;
  }
}

function midiReducer(state: MidiState, action: any) {
  switch(action.type) {
    case 'numMeasures':
      return {...state, numMeasures: action.numMeasures};
    case 'subdiv':
      return {...state, subdiv: action.subdiv};
    case 'bpm':
      return {...state, bpm: action.bpm};
    case 'metronome':
      return {...state, metronome: action.metronome};
    case 'mode':
      return {...state, mode: action.mode};
    default:
      return state;
  }
}

function controlsReducer(state: ControlsState, action: any) {
  switch(action.type) {
    case 'export':
      return {...state, export: action.export};
    case 'undo':
      return {...state, undo: action.undo};
    default:
      return state;
  }
}

function Piano() {
  const soundDetails = {GrandPiano: { '3': [ '2mf' ], '4': [ '2mf' ]}};
  const [soundState, soundDispatch] = useReducer<Reducer<SoundState, SoundAction>>(soundReducer, {octave: 4, sound: 'GrandPiano', volume: '2mf'});
  const [midiState, midiDispatch] = useReducer<Reducer<MidiState, MidiAction>>(midiReducer, {bpm: 120, metronome: 'off', mode: 'keyboard', numMeasures: 4, ppq: 96,  subdiv: 4});
  const [controlsState, controlsDispatch] = useReducer<Reducer<ControlsState, ControlsAction>>(controlsReducer, {export: false, undo: false});
  const [octaveMinMax, setOctaveMinMax] = useState<number[]>([0, 0]);
  const [controlsPressed, setControlsPressed] = useState<(string | boolean)[]>(['', false]);
  const midiLength = useMemo<number>(() => {
    if(midiState.bpm === 0) {
      return 1;
    } else {
      return midiState.numMeasures * 4 / (midiState.bpm / 60 / 1000)
    }
  }, [midiState.bpm, midiState.numMeasures]); // number of beats / bpm in ms
  const pulseRate = useMemo<number>(() => midiState.ppq * (midiState.bpm / 60 / 1000), [midiState.bpm, midiState.ppq]); // ppq * bpm in ms
  const [time, setTime] = useState(0); // 24 * 120 /60/1000 * 16 /(120/60/1000)
  const [pulseNum, setPulseNum] = useState(0);
  const [keysPressed, setKeysPressed] = useState<Map<string, KeyPressed>>(new Map());
  const [keysUnpressed, setKeysUnpressed] = useState<Map<string, KeyPressed>>(new Map());
  const [playback, setPlayback] = useState<Map<string, KeyPressed>[]>([]);
  const [metPlay, setMetPlay] = useState(false);
  const [midiNoteInfo, setMidiNoteInfo] = useState<MidiNoteInfo[]>([]);
  const [menuShown, setMenuShown] = useState('')
  const [infoModal, setInfoModal] = useState<ReactPortal | null>()
  const selectorsRef = useRef<HTMLDivElement>(null);
  const noteTracksRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const timeSliderRef = useRef<HTMLInputElement>(null);
  const pianoRollKeyRef = useRef<any[] | null>(null)
  const labelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(Object.keys(soundDetails).length > 0) {
      let octavesArray = Object.keys(soundDetails[soundState.sound as keyof typeof soundDetails]);
      let octaveNums: number[] = [];
      octavesArray.forEach((octave) => {
        octaveNums.push(parseInt(octave));
      });
      let result: number[] = [Math.min(...octaveNums) + 1, Math.max(...octaveNums) + 1]; 
      setOctaveMinMax(result);
    }
    if(window.localStorage.getItem('midiNoteInfo')) {
      setMidiNoteInfo(JSON.parse(window.localStorage.getItem('midiNoteInfo')!));
    }
  }, []);

  useEffect(() => {
    if(pulseNum >= midiLength * pulseRate) {
      midiDispatch({type: 'mode', mode: 'keyboard'});
      
    }
  }, [pulseNum])

  useEffect(() => {
    if(time >= midiLength && (midiState.mode === 'playing' || midiState.mode === 'recording')) {
      let mode = midiState.mode;
      
      midiDispatch({type: 'mode', mode: 'stop'}); 
      setTimeout(() => midiDispatch({type: 'mode', mode: mode}));
    }
  }, [midiState.mode]);

  useEffect(() => {
    if(midiState.mode === 'stop') {
      setPulseNum(0);
      setTime(0);
      window.localStorage.setItem('midiNoteInfo', JSON.stringify(midiNoteInfo));
    }
  }, [midiState.mode])

  useEffect(() => {
    if(midiState.mode === 'keyboard') {
      setKeysUnpressed(new Map());
    }
  }, [midiState.mode])

  function getOctaveArray() {
    let octaveArray: number[] = []
    Object.keys(soundDetails).some((key) => {
      if(key === soundState.sound) {
        Object.keys(soundDetails[key as keyof typeof soundDetails]).forEach((octave) => {
          octaveArray.push(parseInt(octave))
        })
      }
    })
    return octaveArray;
  }

  function pianoRollKeysPressed(keyPressed: any[]) {
    pianoRollKeyRef.current = keyPressed;
  }

  function metPlayed(dut: boolean) {
    setMetPlay(dut);
  }

  function clearControls() {
    setControlsPressed(['', false]);
  }

  function info() {
    var picked = 'none';

    closeInfo()
    function closeInfo() {
      if(picked === 'none') {
        setInfoModal(createPortal(
          <>
          <div id='popup-bg'>
            <div id='popup-info' className='info'>
              {/* <div id='popup-info' className='' style={{zIndex: 11}}> */}
                <button type='button' className='popup-button info close'
                  onClick={() => {
                    picked = 'new';
                    document.getElementById('popup-bg')!.classList.toggle('lift-out');
                    document.getElementById('popup-info')!.classList.toggle('lift-out');
                    setTimeout(() => setInfoModal(null), 500);
                  }}
                >X</button>
                <div className='keyboard'>
                  <div className='top-row'>
                    <span className='key'>Key:w<br></br><br></br>Note:C#</span>
                    <span className='key'>Key:e<br></br><br></br>Note:Eb</span>
                    <span className='key hidden'></span>
                    <span className='key'>Key:t<br></br><br></br>Note:F#</span>
                    <span className='key'>Key:y<br></br><br></br>Note:G#</span>
                    <span className='key'>Key:u<br></br><br></br>Note:Bb</span>
                    <span className='key hidden'></span>
                    <span className='key'>Key:o<br></br><br></br>Note:C#</span>
                  </div>
                  <div className='bottom-row'>
                    <span className='key'>Key:a<br></br><br></br>Note:C</span>
                    <span className='key'>Key:s<br></br><br></br>Note:D</span>
                    <span className='key'>Key:d<br></br><br></br>Note:E</span>
                    <span className='key'>Key:f<br></br><br></br>Note:F</span>
                    <span className='key'>Key:g<br></br><br></br>Note:G</span>
                    <span className='key'>Key:h<br></br><br></br>Note:A</span>
                    <span className='key'>Key:j<br></br><br></br>Note:B</span>
                    <span className='key'>Key:k<br></br><br></br>Note:C</span>
                    <span className='key'>Key:l<br></br><br></br>Note:D</span>
                  </div>
                </div>
                <br />
                <div className='info-text-container'>
                  <span className='info-text'>Click <FaCircle style={{verticalAlign: 'middle'}} /> to record what you play using the keys above.</span>
                  <br />
                  <span className='info-text'>Click <FaPlay style={{verticalAlign: 'middle'}} /> to play what you've recorded.</span>
                  <br />
                  <span className='info-text'>Click <FaStop style={{verticalAlign: 'middle'}} /> to return the timer to 0.00s and to save your track to localStorage.</span>
                  <br />
                  <span className='info-text'>Click <FaRegCircle style={{verticalAlign: 'middle'}} /><FaCircle style={{verticalAlign: 'middle'}} /> to turn on the metronome.</span>
                  <br />
                  <span className='info-text'>Click any box in the grid to add a note.</span>
                  <br />
                  <span className='info-text'>Click the horizontal black line at the top of the grid to scrub through the time.</span>
                  <br />
                </div>
              {/* </div> */}
            </div>
          </div></>, document.body))
      }
    }
  }
  
  const bgSizeTrack = 100 / midiState.numMeasures;
  return (
      <>
        <style>
          {`
            #midi-note-labels {
              grid-template-rows: repeat(${getOctaveArray().length}, ${(100) / getOctaveArray().length}%);
            }

            @media only screen and (min-width: 1000px) {
              #midi-note-labels {
                grid-template-rows: repeat(${getOctaveArray().length}, ${(100) / getOctaveArray().length}%);
              }
            }
          `}
        </style>
        {infoModal}
        <div ref={selectorsRef} id='selectors'>
          <button className='info' onClick={() => info()}><FaInfoCircle style={{color: 'white', margin: '2px 2px'}} /></button>
          <br></br>
          <div className='settings-buttons'>
            {(menuShown === 'PianoSettings') ? <><button className='settings-button left' onClick={() => setMenuShown('')}>X</button><SoundSettings soundDetails={soundDetails} sound={soundState.sound} octave={soundState.octave} volume={soundState.volume} pianoDispatch={soundDispatch} /></> : <button className='settings-button left' onClick={() => setMenuShown('PianoSettings')}>Piano Settings</button>}
            {(menuShown === 'MidiSettings') ? <><MidiSettings bpm={midiState.bpm} midiNoteInfoLength={midiNoteInfo.length} mode={midiState.mode} numMeasures={midiState.numMeasures} selectorsRef={selectorsRef} soundDetails={soundDetails} subdiv={midiState.subdiv} controlsDispatch={controlsDispatch} midiDispatch={midiDispatch} setMidiNoteInfo={setMidiNoteInfo} /><button className='settings-button right' onClick={() => setMenuShown('')}>X</button></> : <button className='settings-button right' onClick={() => setMenuShown('MidiSettings')}>Midi Settings</button>}
          </div>
            <div ref={timerRef} id='timer-buttons'>
              <TimerButtons metPlay={metPlay} metronome={midiState.metronome} mode={midiState.mode} pulseNum={pulseNum} midiDispatch={midiDispatch} />
              <input readOnly={true} id='time' className='settings input' value={(pulseRate !== 0) ? (pulseNum / pulseRate/1000).toFixed(2) : (0).toFixed(2)}></input>
              {/* <KbFunctions controlsPressed={controlsPressed} metronome={midiState.metronome} mode={midiState.mode} octave={soundState.octave} octaveMinMax={octaveMinMax} selectorsRef={selectorsRef} clearControls={clearControls} controlsDispatch={controlsDispatch} midiDispatch={midiDispatch} soundDispatch={soundDispatch} /> */}
            </div>
        </div>
        <div className='midi-piano'>
          <div id='midi'>
            <PianoRoll labelsRef={labelsRef} midiLength={midiLength} noteTracksRef={noteTracksRef} numMeasures={midiState.numMeasures} octave={soundState.octave} pulseNum={pulseNum} pulseRate={pulseRate} sound={soundState.sound} soundDetails={soundDetails} subdiv={midiState.subdiv} time={pulseNum} handleNotePlayed={pianoRollKeysPressed} />
            <div id='midi-track' style={{backgroundSize: `${bgSizeTrack}%`}}>
              {(noteTracksRef.current && selectorsRef.current) ? <input ref={timeSliderRef} type='range' id='time-slider' min='0' max={`${midiLength * pulseRate}`} value={pulseNum} style={{position: 'sticky', height: 'max-content', top: `${selectorsRef.current.offsetHeight}px`}} onChange={(e) => {setTime(parseInt(e.target.value) / pulseRate); setPulseNum(parseInt(e.target.value))}}></input> : null}
              <Grid gridSize={[]} midiLength={midiLength} noteTracksRef={noteTracksRef} numMeasures={midiState.numMeasures} pulseNum={pulseNum} pulseRate={pulseRate} selectorsRef={selectorsRef} subdiv={midiState.subdiv} time={time} octaveArray={getOctaveArray()} setPulseNum={setPulseNum} setTime={setTime} />
            </div>
          </div>
        </div>
          <KeyNoteInput keysPressed={keysPressed} keysUnpressed={keysUnpressed} octave={soundState.octave} pianoRollKey={pianoRollKeyRef.current} pulseNum={pulseNum} onControlsPressed={setControlsPressed} onNotePlayed={setKeysPressed} setKeysPressed={setKeysPressed} setKeysUnpressed={setKeysUnpressed} />
          <MidiRecorder controlsState={controlsState} gridSize={[]} keysPressed={keysPressed} keysUnpressed={keysUnpressed} midiLength={midiLength} midiNoteInfo={midiNoteInfo} midiState={midiState} noteTracksRef={noteTracksRef} pulseNum={pulseNum} pulseRate={pulseRate} controlsDispatch={controlsDispatch} setKeysUnpressed={setKeysUnpressed} setMidiNoteInfo={setMidiNoteInfo} setPlayback={setPlayback} />
          <Timer metronome={midiState.metronome} midiLength={midiLength} time={time} timerRef={timerRef} mode={midiState.mode} ppq={midiState.ppq} pulseNum={pulseNum} pulseRate={pulseRate} handleMetPlay={metPlayed} handleSetTime={setTime} handleSetPulseNum={setPulseNum} />
          <PianoInstrument pulseNum={pulseNum} soundDetails={soundDetails} sound={soundState.sound} octave={soundState.octave} octaveMinMax={octaveMinMax} volume={soundState.volume} mode={midiState.mode} keysPressed={keysPressed} keysUnpressed={keysUnpressed} playback={playback} labelsRef={labelsRef} />
      </>
  );
}

export default Piano;
