import React, { useState, useReducer, useEffect, useLayoutEffect, useRef } from 'react';
import { QwertyNote, FetchedSounds, PrevNotes, KeysPressed, OctavesInViewProps, PianoProps } from '../Tools/Interfaces'
import {Howl, Howler} from 'howler';
import axios from 'axios';
import './PianoInstrument.css';
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');

function PianoInstrument(props: PianoProps) {
  const [fetchedSounds, setFetchedSounds] = useState<FetchedSounds>({});
  const [prevNotes, setPrevNotes] = useState<PrevNotes>({});
  const [playbackOff, setPlaybackOff] = useState<KeysPressed>({})

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
                    fetchedSounds[octave][props.volume].fade(.5, 0, 300, prevNotes[noteName]);
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
      playNote(Object.fromEntries(props.keysPressed));
      playNote(Object.fromEntries(props.keysUnpressed));
    }
    if(props.mode === 'keyboard') {
    } else if(props.mode === 'stop') {
      playNote(playbackOff);
      setPlaybackOff({})
    }
  }, [props.mode, props.pulseNum, props.keysPressed, props.keysUnpressed, props.playback])

  function loadSound(octave: string) {
    let octaveSound: any;
      octaveSound = new Howl({
        src: [`piano-assets/${octave}.webm`],
        sprite: {
          C: [0, 4999],
          'C#': [5000, 4900],
          D: [10000, 4900],
          Eb: [15000, 4900],
          E: [20000, 4900],
          F: [25000, 4900],
          'F#': [30000, 4900],
          G: [35000, 4900],
          'G#': [40000, 4900],
          A: [45000, 4900],
          Bb: [50000, 4900],
          B: [55000, 4900],
        },
        volume: .5,
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

    if(props.octaveMinMax[0] !== props.octaveMinMax[1])
    for(let i = 0; i < toFetch.length; i++) {
      let octave = toFetch[i];
      if(!(toFetch[i] in fetchedSounds)) {
        notFetched.push(toFetch[i]);
      } else if(!(props.volume in fetchedSounds[toFetch[i]])) {
        notFetched.push(toFetch[i]);
      }
      if(notFetched.length > 0) {
        setFetchedSounds((fetchedSounds) => ({...fetchedSounds, [toFetch[i]]: {[props.volume]: loadSound(octave)}}));
      }
    }
  }

  return null;
}

export default PianoInstrument;