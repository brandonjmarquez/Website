import React, { useState, useReducer, useEffect, useLayoutEffect, useRef } from 'react';
import { QwertyNote, FetchedSounds, PrevNotes, KeysPressed, OctavesInViewProps, PianoProps } from '../Tools/Interfaces'
import {Howl, Howler} from 'howler';
import axios from 'axios';
import './PianoInstrument.css';
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');

function PianoInstrument(props: PianoProps) {
  const [fetchedSounds, setFetchedSounds] = useState<FetchedSounds>({});
  const [prevNotes, setPrevNotes] = useState<PrevNotes>({});
  const [keysRecorded, setKeysRecorded] = useState<string[]>([])
  const [playbackOff, setPlaybackOff] = useState<KeysPressed>({})
  const [playbackOn, setPlaybackOn] = useState<KeysPressed>({})
  const [startPulse, setStartPulse] = useState(0)

  useEffect(() => {
    setPlaybackOff((playbackOff) => {
      let state = {...playbackOff};
      if(props.playback[props.pulseNum]) {
        props.playback[props.pulseNum].forEach((value, noteOct) => {
          state = {...state, [noteOct]: {...props.playback[props.pulseNum].get(noteOct)!, pressed: false, end: props.pulseNum}}
        });
      }
      return state;
    })
  }, [props.pulseNum])

  useEffect(() => {
    if(Object.keys(prevNotes).length > 0) {
      if(props.mode === 'stop') {
        Object.keys(prevNotes).forEach((noteOct) => {
          if(prevNotes[noteOct] > 0) {
            let octave = noteOct.replace(/\D/g, '');

            Howler.stop(); 
            fetchedSounds[octave][props.volume].mute(true, prevNotes[noteOct]); 
          }
        })
      } else if(props.mode === 'keyboard') {
        Object.keys(prevNotes).forEach((noteOct) => {
          if(prevNotes[noteOct] > 0) {
            let octave = noteOct.replace(/\D/g, '');
            fetchedSounds[octave][props.volume].pause(); 
          }
        })
      } else if(props.mode === 'playing') {
        Object.keys(prevNotes).forEach((noteOct) => {
          if(prevNotes[noteOct] > 0) {
            let octave = noteOct.replace(/\D/g, '');
            fetchedSounds[octave][props.volume].play(prevNotes[noteOct]); 
          }
        })
      }
    }
  }, [props.mode])

  useEffect(() => {
    console.log(fetchedSounds);
  }, [fetchedSounds]);

  useEffect(() => {
    if(props.playback[props.pulseNum]) {
      props.setKeysUnpressed((keysUnpressed: typeof props.keysUnpressed) => {
        let state = new Map(keysUnpressed)
        Object.keys(Object.fromEntries(props.playback[props.pulseNum])).forEach((noteOct) => {
          if(props.keysUnpressed.get(noteOct)) {
            keysUnpressed.delete(noteOct);
          }
        });
        return state;
      })
    }
  }, [props.pulseNum]);

  useEffect(() => {
    function playNote(output: KeysPressed) {
      let qwertyOctave: number;
      let noteName: string;
      let prevNotesTemp: PrevNotes = prevNotes;

      Object.keys(output).forEach((noteOct) => {
        let key = output[noteOct].key;
        let note = noteOct.replace(/[0-9]/g, '');
        let octave = parseInt(noteOct.replace(/\D/g,''));

        if(Object.keys(qwertyNote).includes(key!)) {
          if(octave < props.octaveMinMax[1]) {
            if(fetchedSounds[octave][props.volume]) {
              (note.includes('#')) ? noteName = note.replace('#', 'sharp') + (octave) : noteName = note.replace('b', 'flat') + (octave);
              let labelElem = document.getElementById(noteName.toLowerCase() + '-label')!;

              if(output[noteOct].pressed && (!prevNotes[noteName] || prevNotes[noteName] === 0)) {
                let sound = fetchedSounds[octave][props.volume];
                let soundId = sound.play(note);

                prevNotesTemp[noteName] = soundId;
                labelElem.classList.toggle('active');
              } else if(!output[noteOct].pressed && prevNotes[noteName as keyof typeof prevNotes] > 0) {
                labelElem.classList.toggle('active');
                Object.keys(prevNotes).some((playedNote) => {
                  if(playedNote === noteName) {
                    fetchedSounds[octave][props.volume].fade(1, 0, 500, prevNotes[noteName]);
                  }
                });
                prevNotesTemp[noteName] = 0;
              }
            }
          }
        }
      })
      setPrevNotes(prevNotesTemp);
    }
    if(props.mode === 'playing' || props.mode === 'recording') {
      let pb: KeysPressed = {};

      if(props.playback[props.pulseNum]) {
        pb = Object.fromEntries(props.playback[props.pulseNum]);        
      }
      if(props.playback.length > 0 && props.playback[props.pulseNum]) {
          playNote(pb);
        // }
      }
      if(props.keysPressed.size > 0 && pb) {
        playNote({...pb, ...Object.fromEntries(props.keysPressed)})
        playNote({...pb, ...Object.fromEntries(props.keysUnpressed)})
      }
      else {
        playNote(Object.fromEntries(props.keysPressed));
        playNote(Object.fromEntries(props.keysUnpressed));
      }
    }
    if(props.mode === 'keyboard') {
      setStartPulse(props.pulseNum)
      playNote(Object.fromEntries(props.keysPressed));
      playNote(Object.fromEntries(props.keysUnpressed));
    }
    if(props.mode === 'keyboard') {
      setStartPulse(props.pulseNum)
    } else if(props.mode === 'stop') {
      setStartPulse(0);
      playNote(playbackOff);
      setPlaybackOff({})
    }
  }, [props.mode, props.pulseNum, props.keysPressed, props.keysUnpressed, props.playback])

  function loadSound(url: string) {
    let octaveSound: any;
      octaveSound = new Howl({
        src: [url + '.webm'],
        sprite: {
          C: [0, 4999],
          'C#': [5000, 4999],
          D: [10000, 4999],
          Eb: [15000, 4999],
          E: [20000, 4999],
          F: [25000, 4999],
          'F#': [30000, 4999],
          G: [35000, 4999],
          'G#': [40000, 4999],
          A: [45000, 4999],
          Bb: [50000, 4999],
          B: [55000, 5000],
        },
        volume: .5,
        html5: true
      });
      return octaveSound;
  }
  useEffect(() => {
    if(Object.keys(props.soundDetails).length > 0) {
      setView(Object.keys(props.soundDetails[props.sound as keyof typeof props.soundDetails]))
    }
  }, [props.soundDetails, props.octaveMinMax]);

  function setView(toFetch: string[]) {
    let notFetched: string[] = [];
    console.log(toFetch);
    if(props.octaveMinMax[0] !== props.octaveMinMax[1])
    for(let i = 0; i < toFetch.length; i++) {
      let url = `${process.env.REACT_APP_SERVER}/sounds/Instruments/${props.sound}/${toFetch[i]}/${props.volume}`;
      if(!(toFetch[i] in fetchedSounds)) {
        notFetched.push(toFetch[i]);
      } else if(!(props.volume in fetchedSounds[toFetch[i]])) {
        notFetched.push(toFetch[i]);
      }
      console.log(notFetched);
      if(notFetched.length > 0) {
        setFetchedSounds((fetchedSounds) => ({...fetchedSounds, [toFetch[i]]: {[props.volume]: loadSound(url)}}));
      }
    }
  }

  return null;
}

export default PianoInstrument;