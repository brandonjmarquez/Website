import {useState, useEffect} from 'react';
import { KeyNoteInputProps, KeyPressed } from './Interfaces';
const qwertyNote = require('../Tools/JSON/note-to-qwerty-key-obj');
const kbControls = require('../Tools/JSON/keyboard-controls');

function KeyNoteInput(props: KeyNoteInputProps) {
  // const [keysPressed, setKeysPressed] = useState<Map<string, KeyPressed>>(new Map());
  // const [keysUnpressed, setKeysUnpressed] = useState<Map<string, KeyPressed>>(new Map());
  // const [loginExists, setLoginExists] = useState<boolean>(props.loginRef.current !== undefined)

  // useEffect(() => { 
  //   console.log(props.loginRef.current)
  // }, [props.loginRef.current])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if(e.repeat) {
        // setController((controller) => ({...controller, [note + octave]: {...controller[note + octave], ...{end: props.pulseNum}}}));
        return;
      };
      const control = e.metaKey || e.ctrlKey;
      // if(Object.keys(kbControls).includes(e.key)) {
      //   props.onControlsPressed([e.key, control]);
      // }
      if(!Object.keys(qwertyNote).includes(e.key.toLowerCase())) {
        return;
      }
      let octave = props.octave + qwertyNote[e.key.toLowerCase()].octave;

      if(parseInt(e.code) - parseInt(e.code) === 0) {
        octave = parseInt(e.code);
      }
      if(!control) {
        let note = qwertyNote[e.key.toLowerCase()].note; // toLowerCase() is for caps lock

        props.setKeysPressed((keysPressed: Map<string, KeyPressed>) => {
          let state = new Map(keysPressed);

          state.set(note + octave, {key: e.key.toLowerCase(), pressed: true, start: props.pulseNum, end: -1})
          return state;
        });
        if(props.keysUnpressed.get(note + octave)) {
          props.setKeysUnpressed((keysPressed: Map<string, KeyPressed>) => {
            let state = new Map(keysPressed);
  
            state.delete(note + octave);
            return state;
          })
        }
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if(!Object.keys(qwertyNote).includes(e.key.toLowerCase())) return;

      let octave = props.octave + qwertyNote[e.key.toLowerCase()].octave;

      if(parseInt(e.code) - parseInt(e.code) === 0) {
        octave = parseInt(e.code);
      }
      
      let note = qwertyNote[e.key.toLowerCase()].note;
      let noteOct = note + octave

      if(props.keysPressed.size > 0 && props.keysPressed.get(noteOct)) {
        props.setKeysUnpressed((keysUnpressed: Map<string, KeyPressed>) => {
          let state = new Map(keysUnpressed)
          // console.log(keysPressed.get(note + octave));
          state.set(noteOct, {start: props.keysPressed.get(noteOct)!.start, key: e.key.toLowerCase(), pressed: false, end: props.pulseNum})
          return state
        })
        if(props.keysPressed.get(note + octave)) {
          props.setKeysPressed((keysPressed: Map<string, KeyPressed>) => {
            let state = new Map(keysPressed);

            state.delete(note + octave);
            return state;
          })
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
    // eslint-disable-next-line
  }, [props.octave, props.pulseNum, props.keysPressed, props.keysUnpressed]);

  // useEffect(() => {
  //   props.setKeysPressed(keysPressed);
  //   // eslint-disable-next-line
  // }, [keysPressed]);

  // useEffect(() => {
  //   props.setKeysUnpressed(keysUnpressed);
  //   // eslint-disable-next-line
  // }, [keysUnpressed]);

  return null;
}

export default KeyNoteInput;