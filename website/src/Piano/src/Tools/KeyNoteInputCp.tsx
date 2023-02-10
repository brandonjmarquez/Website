import {useState, useEffect} from 'react';
import { KeyNoteInputProps, KeyPressed } from './Interfaces';
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
const kbControls = require('../Tools/keyboard-controls');

function KeyNoteInput(props: KeyNoteInputProps) {
  const [keysPressed, setKeysPressed] = useState<Map<string, KeyPressed>>(new Map());
  const [keysUnpressed, setKeysUnpressed] = useState<Map<string, KeyPressed>>(new Map());
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
      if(Object.keys(kbControls).includes(e.key)) {
        e.preventDefault();
        props.onControlsPressed([e.key, control]);
      }
      if(!Object.keys(qwertyNote).includes(e.key.toLocaleLowerCase())) {
        return;
      }
      let octave = props.octave + qwertyNote[e.key.toLocaleLowerCase()].octave;

      if(parseInt(e.code) - parseInt(e.code) === 0) {
        octave = parseInt(e.code);
      }
      if(!control) {
        let note = qwertyNote[e.key.toLowerCase()].note; // toLowerCase() is for caps lock

        setKeysPressed((keysPressed) => {
          let state = new Map(keysPressed);

          state.set(note + octave, {key: e.key.toLowerCase(), pressed: true, start: props.pulseNum, end: -1})
          return state;
        });
        if(keysUnpressed.get(note + octave)) {
          setKeysUnpressed((keysPressed) => {
            let state = new Map(keysPressed);
  
            state.delete(note + octave);
            return state;
          })
        }
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if(!Object.keys(qwertyNote).includes(e.key)) return;

      let octave = props.octave + qwertyNote[e.key.toLocaleLowerCase()].octave;

      if(parseInt(e.code) - parseInt(e.code) === 0) {
        octave = parseInt(e.code);
      }
      
      let note = qwertyNote[e.key.toLocaleLowerCase()].note;
      let noteOct = note + octave

      if(keysPressed.size > 0 && keysPressed.get(noteOct)) {
        setKeysUnpressed((keysUnpressed) => {
          let state = new Map(keysUnpressed)
          // console.log(keysPressed.get(note + octave));
          state.set(noteOct, {start: keysPressed.get(noteOct)!.start, key: e.key.toLowerCase(), pressed: false, end: props.pulseNum})
          return state
        })
        if(keysPressed.get(note + octave)) {
          setKeysPressed((keysPressed) => {
            let state = new Map(keysPressed);

            state.delete(note + octave);
            return state;
          })
        }
      }
    }

    if(document && !props.focus) {
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);
      return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
      };
    } else {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    }
    // eslint-disable-next-line
  }, [props.octave, props.pulseNum, props.focus, keysPressed, keysUnpressed]);

  useEffect(() => {
    props.setKeysPressed(keysPressed);
    // eslint-disable-next-line
  }, [keysPressed]);

  useEffect(() => {
    props.setKeysUnpressed(keysUnpressed);
    // eslint-disable-next-line
  }, [keysUnpressed]);

  return null;
}

export default KeyNoteInput;