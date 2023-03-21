import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { KeyProps, NoteLabelsProps, PianoRollProps } from '../../Tools/Interfaces';
import './PianoRoll.css';
const qwertyNote = require('../../Tools/JSON/note-to-qwerty-key-obj');

function Key(props: KeyProps) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const element = ref.current!;
    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointerup', onPointerUp);
    return (() => {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointerup', onPointerUp);
    });
  });
  
  const onPointerDown = () => {
    let input = document;
    let keydown = new KeyboardEvent('keydown', {
      key: props.qwertyKey,
      code: props.octave.toString(),
    });
    
    if(input) input.dispatchEvent(keydown);
  }

  const onPointerUp = () => {
    let input = document;
    let keyup = new KeyboardEvent('keyup', {
      key: props.qwertyKey,
      code: props.octave.toString(),
    });
    
    if(input) input.dispatchEvent(keyup);
  }

  let noteName;

  (props.note.includes('#')) ? noteName = props.note.replace('#', 'sharp') : noteName = props.note.replace('b', 'flat');

  return (
    <button type='button' ref={ref} id={noteName.toLowerCase() + props.octave + '-label'} className={(props.note.length > 1) ? 'note-label accidental' : 'note-label natural'} onMouseLeave={onPointerUp}> {/* onClick={() => handleClick()}> */}
      {props.note + props.octave}
    </button>
  );
}

function NoteLabels(props: NoteLabelsProps) {
  const memoNoteLabels = useMemo<JSX.Element[]>(() => {
    let gridLabelOctaves: JSX.Element[] = [];
    let gridLabels: JSX.Element[] = [];
    let qwertyKeys = Object.keys(qwertyNote);

    for(var x = props.octaveArray.length - 1; x >= 0; x--) {
      for(var y = 11; y >= 0; y--) {
        gridLabels.push(<Key key={qwertyNote[qwertyKeys[y]].note + props.octaveArray[x]} qwertyKey={qwertyKeys[y]} note={qwertyNote[qwertyKeys[y]].note} altNote={qwertyNote[qwertyKeys[y]].altNote} octave={props.octaveArray[x]} />);
      }

      gridLabelOctaves.push(<div key={x} id={`${props.octaveArray[x]}-octave`} className='note-label-octaves'>{gridLabels}</div>);
      gridLabels = [];
    }

    if(gridLabelOctaves.length === props.octaveArray.length) {
      return gridLabelOctaves;
    }
    return [];
  }, [props.octaveArray]);

  return <div ref={props.labelsRef} id='midi-note-labels'>{memoNoteLabels}</div>
}

function PianoRoll(props: PianoRollProps) {
  const gridRef = useRef(null);
  const [labels, setLabels] = useState([]);
  const [octaveArray, setOctaveArray] = useState<number[]>([]);
  const bgSizeTrack = 100 / props.numMeasures;

  useLayoutEffect(() => {
    getOctaveArray();
  }, [props.soundDetails, props.sound])

  useEffect(() => {

  });

  function sendNoteProps(keyPressed: any[]) {
    props.handleNotePlayed(keyPressed);
  }

  function getOctaveArray() {
    Object.keys(props.soundDetails).some((key) => {
      let octaveArray: number[] = []
      if(key === props.sound) {
        Object.keys(props.soundDetails[key as keyof typeof props.soundDetails]).forEach((octave) => {
          octaveArray.push(parseInt(octave))
        })
        setOctaveArray(octaveArray);
        return Object.keys(props.soundDetails[key as keyof typeof props.soundDetails]);
      } else {
        return octaveArray;
      }
    })
  }
  
  function trackPosition() {
    let position = {};
    if(props.noteTracksRef.current) {
      position = {left: `${(.08 + props.pulseNum / (props.midiLength * props.pulseRate)) * props.noteTracksRef.current.offsetWidth}px`};
    } else {
      position = {left: `${(8 + props.pulseNum / (props.midiLength * props.pulseRate) * 92)}%`};
    }
    return <div id='track-position' className='keyboard' style={position}></div>;
  }

  return (
    <>
        <NoteLabels octaveArray={octaveArray} octave={props.octave} labelsRef={props.labelsRef} />
        {/* {trackPosition()} */}
    </>
  );
}

export default PianoRoll;