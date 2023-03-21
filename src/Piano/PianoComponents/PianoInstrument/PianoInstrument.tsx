import React, { useState, useEffect, useRef } from 'react';
import { FetchedSounds, PrevNotes, KeysPressed, OctavesInViewProps, PianoProps } from '../../Tools/Interfaces'
import {Howl, Howler} from 'howler';
import './PianoInstrument.css';
import { playNote, setView } from './PianoInstrumentFunctions'
const qwertyNote = require('../../Tools/JSON/note-to-qwerty-key-obj');

function PianoInstrument(props: PianoProps) {
  const [fetchedSounds, setFetchedSounds] = useState<FetchedSounds>({});
  const prevNotes = useRef<PrevNotes>({});
  const [playbackOff, setPlaybackOff] = useState<KeysPressed>({})

  // Handle window losing focus while piano is being played.
  // useEffect(() => {
  //   const focusOut = (e: Event) => {
  //     console.log(e.target);
  //     playNote(playbackOff, prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume);
  //     setPlaybackOff({})
  //   }

  //   window.addEventListener('blur', focusOut)
  //   return(() => {
  //     window.removeEventListener('blur', focusOut)
  //   })
  // }, []);

  useEffect(() => {
    if(Object.keys(fetchedSounds).length === 0) setFetchedSounds((fetchedSounds) => setView([3, 4], fetchedSounds, props.octaveMinMax, props.sound, props.volume));
  });

  // Sets playback to all notes currently playing from playback, with their end
  // times set to the current time. playbackOff is used when props.mode = ''.
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

  // Uses the mute, pause, and play methods from Howler to make sounds respond to 
  // stop, pause, and play accordingly.
  useEffect(() => {
    if(Object.keys(prevNotes.current).length > 0) {
      if(props.mode === 'stop') {
        Object.keys(prevNotes.current).forEach((noteOct) => {
          if(prevNotes.current[noteOct] > 0) {
            let octave = noteOct.replace(/\D/g, '');

            Howler.stop(); 
            fetchedSounds[octave][props.volume].mute(true, prevNotes.current[noteOct]); 
          }
        })
      } else if(props.mode === 'keyboard') {
        Object.keys(prevNotes.current).forEach((noteOct) => {
          if(prevNotes.current[noteOct] > 0) {
            let octave = noteOct.replace(/\D/g, '');
            fetchedSounds[octave][props.volume].pause(); 
          }
        })
      } else if(props.mode === 'playing') {
        Object.keys(prevNotes.current).forEach((noteOct) => {
          if(prevNotes.current[noteOct] > 0) {
            let octave = noteOct.replace(/\D/g, '');
            fetchedSounds[octave][props.volume].play(prevNotes.current[noteOct]); 
          }
        })
      }
    }
  }, [props.mode])

  useEffect(() => {
    // console.log(props.keysUnpressed);
  }, [props.keysUnpressed]);

  // Plays notes from keystrokes while recording, playing back, and doing neither
  // of those. Also plays notes from the playback variable. Uses playNote function 
  // from 'PianoFunctions.ts" to play notes.
  useEffect(() => {
    if(props.mode === 'playing' || props.mode === 'recording') {
      let pb: KeysPressed = {};

      if(props.playback[props.pulseNum]) {
        pb = Object.fromEntries(props.playback[props.pulseNum]);
      }
      if(props.playback.length > 0 && props.playback[props.pulseNum]) {
          playNote(pb, prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume);
      }
      if(props.keysPressed.size > 0 && pb) {
        playNote({...pb, ...Object.fromEntries(props.keysPressed)}, prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume)
        playNote({...pb, ...Object.fromEntries(props.keysUnpressed)}, prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume)
      }
      else {
        playNote(Object.fromEntries(props.keysPressed), prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume);
        playNote(Object.fromEntries(props.keysUnpressed), prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume);
      }
    }
    if(props.mode === 'keyboard') {
      playNote(Object.fromEntries(props.keysPressed), prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume);
      playNote(Object.fromEntries(props.keysUnpressed), prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume);
    } else if(props.mode === 'stop') {
      playNote(playbackOff, prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume);
      setPlaybackOff({})
    }
  }, [props.mode, props.pulseNum, props.keysPressed, props.keysUnpressed, props.playback])

  
  return null
}

export default PianoInstrument;