import React, { useState, useEffect, createElement, useLayoutEffect, ReactPortal, ReactElement, DetailedReactHTMLElement, HTMLAttributes} from 'react';
import { createPortal } from 'react-dom';
import { MidiRecorded, KeysPressed, MidiRecorderProps, MidiNoteInfo, NotesRemoved, KeyPressed } from '../Tools/Interfaces';
// import MidiNotes from './MidiNotes';
import MidiNotes from './MidiNotes';
import './MidiRecorder.css';
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
// replace midistate prop with mode prop

interface NotesAdded {
  [noteTrackId: string]: {pulse: number};

}

function MidiRecorder(props: MidiRecorderProps) {
  const [count, setCount] = useState<number>(0);
  const [clickCoords, setClickCoords] = useState<number[]>([]);
  const [midiRecorded, setMidiRecorded] = useState<Map<string, KeyPressed>[]>([]);
  const [midiRecording, setMidiRecording] = useState<MidiNoteInfo[]>([]);
  const [notesRemoved, setNotesRemoved] = useState<NotesRemoved[]>([]);
  const [notesAdded, setNotesAdded] = useState<NotesAdded[]>([]);
  
  useEffect(() => {
    // console.log('midiNoteInfo', midiNoteInfo)
    // setMidiNoteInfo(props.midiNoteInfo)
  }, [props.midiNoteInfo])
  

  // Add or remove note upon clicking a note track or a note
  useEffect(() => {
    function addRemNote(e: MouseEvent) {
      var elem: HTMLElement;
      if(e.target){
        elem = e.target as HTMLElement;
        console.log(props.midiState.mode)
        if(elem.tagName == "DIV") {
          setClickCoords([e.clientX, e.clientY]);
        } else if(elem.tagName == "SPAN" && props.midiState.mode === 'keyboard') {
          console.log('double')
          let key = elem.id.substring(0, elem.id.indexOf('-'));
          let remIndex = 0;
          for(var i = 0; i < props.midiNoteInfo.length; i++) {
            if(Object.keys(props.midiNoteInfo[i])[0] === key) remIndex = i;
          }
          // console.log(remIndex, key, props.midiNoteInfo[remIndex])
          // let remProp = 
          setNotesRemoved((notesRemoved) => [ ...notesRemoved, {[remIndex]: {[key]: props.midiNoteInfo[remIndex][key]}}]);
          props.setMidiNoteInfo((midiNoteInfo: MidiNoteInfo[]) => {
            let state = [...midiNoteInfo];
            state.splice(remIndex, 1)
            return state;
          });
        }
      }
    }

    if(props.noteTracksRef.current) {
      props.noteTracksRef.current.addEventListener('dblclick', addRemNote)
    }

    return () => {
      if(props.noteTracksRef.current) props.noteTracksRef.current.removeEventListener('dblclick', addRemNote);
    }
  }, [props.noteTracksRef.current, props.midiNoteInfo, props.midiState.mode])

  // Add or remove note upon clicking a note track or a note for touch screen
  useEffect(() => {
    function addRemNote(e: TouchEvent) {
      // e.preventDefault();
      var elem: HTMLElement;
      if(e.target){
        elem = e.target as HTMLElement;
        console.log(props.midiState.mode)
        if(elem.tagName == "DIV") {
          setClickCoords([e.touches[0].clientX, e.touches[0].clientY]);
        } else if(elem.tagName == "SPAN" && props.midiState.mode === 'keyboard') {
          console.log('double')
          let key = elem.id.substring(0, elem.id.indexOf('-'));
          let remIndex = 0;
          for(var i = 0; i < props.midiNoteInfo.length; i++) {
            if(Object.keys(props.midiNoteInfo[i])[0] === key) remIndex = i;
          }
          // console.log(remIndex, key, props.midiNoteInfo[remIndex])
          // let remProp = 
          setNotesRemoved((notesRemoved) => [ ...notesRemoved, {[remIndex]: {[key]: props.midiNoteInfo[remIndex][key]}}]);
          props.setMidiNoteInfo((midiNoteInfo: MidiNoteInfo[]) => {
            let state = [...midiNoteInfo];
            state.splice(remIndex, 1)
            return state;
          });
        }
      }
    }

    if(props.noteTracksRef.current) {
      props.noteTracksRef.current.addEventListener('touchstart', addRemNote)
    }

    return () => {
      if(props.noteTracksRef.current) props.noteTracksRef.current.removeEventListener('touchstart', addRemNote);
    }
  }, [props.noteTracksRef.current, props.midiNoteInfo, props.midiState.mode])

  useEffect(() => {
    if(props.midiNoteInfo.length > 0 && props.midiState.mode === 'keyboard') {
      let mniTemp: MidiNoteInfo[] = [...props.midiNoteInfo];
      props.midiNoteInfo.forEach((noteInfo, i, midiNoteInfo) => {
        let noteStart = Object.keys(noteInfo)[0];
        if(noteInfo[noteStart].keyPressed) {
          if(noteInfo[noteStart].keyPressed!.end === -1) {
            mniTemp[i] = {[noteStart]: {...midiNoteInfo[i][noteStart], 
              keyPressed: {...midiNoteInfo[i][noteStart].keyPressed, end: props.pulseNum}
            }}
          }
        }
      });
      props.setMidiNoteInfo(mniTemp);
    }
  }, [props.midiState.mode]);

  // Add notes from midiNoteInfo to midiRecorded.
  useEffect(() => {
    if(props.midiNoteInfo.length > 0) {
      // console.log(midiNoteInfo);
      let midiRecTemp: Map<string, KeyPressed>[] = [];
      props.midiNoteInfo.forEach((noteInfo) => {
        let noteStart = Object.keys(noteInfo)[0]
        if(noteInfo[noteStart].keyPressed) {
          let noteOct = noteStart.replace(noteInfo[noteStart].keyPressed!.start.toString(), '')
          // console.log(qwertyNote[noteInfo[noteStart].keyPressed!.key!])
          let qwertyKeys = Object.keys(qwertyNote)
          for(var i = 0; i < qwertyKeys.length; i++) {
            if(qwertyNote[qwertyKeys[i]].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwertyKeys[i]].octave === 0) {
              // console.log(noteOct)
              let startNote = {
                key: qwertyKeys[i],
                octave: parseInt(noteOct.replace(/\D/g,'')),
                pressed: true,
                start: noteInfo[noteStart].keyPressed!.start,
                end: -1,
              };
              let endNote = {
                key: qwertyKeys[i],
                octave: parseInt(noteOct.replace(/\D/g,'')),
                pressed: false,
                start: noteInfo[noteStart].keyPressed!.start,
                end: noteInfo[noteStart].keyPressed!.end,
              };
              let keyPressedStart = (midiRecTemp[noteInfo[noteStart].keyPressed!.start]) ? midiRecTemp[noteInfo[noteStart].keyPressed!.start] : new Map()
              let keyPressedEnd = (midiRecTemp[noteInfo[noteStart].keyPressed!.end]) ? midiRecTemp[noteInfo[noteStart].keyPressed!.end] : new Map()
              keyPressedStart.set(noteOct, startNote);
              keyPressedEnd.set(noteOct, endNote);
              midiRecTemp[noteInfo[noteStart].keyPressed!.start] = keyPressedStart;
              midiRecTemp[noteInfo[noteStart].keyPressed!.end] =  keyPressedEnd;
              break;
            }
          }
        }
        
      });
      // console.log(midiRecTemp);
      setMidiRecorded(midiRecTemp)
    } else {
      setMidiRecorded([])
    }
  }, [props.midiNoteInfo])

  // Add notes from clicking grid to midiNoteInfo.
  useEffect(() => {
    if(props.noteTracksRef.current) {
      let noteTrackElem: Element ;
      let noteTrackId = '';
      let subdivElem: Element ;
      let subdivId = '';
      let countTemp = count;
      if(document.elementsFromPoint(clickCoords[0], clickCoords[1]).length > 0) {
        document.elementsFromPoint(clickCoords[0], clickCoords[1]).forEach((elem) => {
          if(elem.getAttribute('class') === 'note-track') {
            noteTrackElem = elem;
            noteTrackId = elem.id;
          }
          if(elem.getAttribute('class') === 'subdivision') {
            subdivElem = elem;
            subdivId = elem.id;
          }
        })
      }
      if(noteTrackId.length > 0 && subdivId.length > 0) {
        let noteOct = noteTrackId.replace('-track', '');
        let key = (() => {
          Object.keys(qwertyNote).forEach((qwerty) => {
            // console.log(qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, ''))
            if(qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, '')) return qwerty;
          })
          return '';
        })();
        // console.error(key)
        let subdiv = parseInt(subdivId.replace(/\D/g, ''));
        let rect = subdivElem!.getBoundingClientRect();
        let left = rect.left;
        let width = rect.right - rect.left;
        let height = props.noteTracksRef.current!.offsetHeight / props.noteTracksRef.current!.children.length - 2;
        if((subdiv - 1) % props.midiState.subdiv === 0) {
          width -= 2;
        }
        let start = Math.trunc((subdiv - 1) / (props.midiState.numMeasures * props.midiState.subdiv) * props.midiLength * props.pulseRate);
        let end = Math.trunc(start + 1 / (props.midiState.subdiv * props.midiState.numMeasures) * props.midiLength * props.pulseRate) - 1;
        setNotesAdded((notesAdded) => [...notesAdded, {[noteTrackId]: {pulse: start}}])
        props.setMidiNoteInfo((midiNoteInfo: MidiNoteInfo[]) => [...midiNoteInfo, ...[{[start + noteOct]: {
          key: noteTrackId + countTemp,
          keyPressed: {
            key: key,
            // octave: parseInt(noteOct.replace(/\D/g, '')),
            pressed: true,
            start: start,
            end: end,
          },
          noteTrackId: noteTrackId,
          props: {
            id: start + noteTrackId + '-' + countTemp,
            className: 'midi-note',
          },
        }}]])

        countTemp++;
        setCount(countTemp);
      }
    }
  }, [clickCoords])

  // Add notes from recording to midiNoteInfo
  useEffect(() => {
    function findSameNote(noteOct: string, start: number) {
      // var start = parseInt(start.substring(0, noteStart.indexOf(noteOct)));
      props.midiNoteInfo.forEach((midiNote, i) => {
        var noteStart2 = Object.keys(midiNote)[0];
        var noteOct2 = midiNote[noteStart2].noteTrackId.substring(0, midiNote[noteStart2].noteTrackId.indexOf('-'))

        if(noteOct === noteOct2) {
          var start2 = parseInt(noteStart2.substring(0, noteStart2.indexOf(noteOct2)));
          var end2 = midiNote[noteStart2].keyPressed.end;

          if(start < end2 && start > start2) {
            props.setMidiNoteInfo((midiNoteInfo: MidiNoteInfo[]) => {
              let state = [...midiNoteInfo];
              
              state[i][noteStart2].keyPressed = {...state[i][noteStart2].keyPressed, end: start - 1}
              return state
            })
          }
        }
      })
    }

    if(props.noteTracksRef && props.midiState.mode === 'recording') {
      let octave: number;
      let countTemp = count;
      if(props.noteTracksRef.current) {
        props.keysPressed.forEach((keyPressed, noteOct) => {
          octave = parseInt(noteOct.replace(/\D/g,''));
          let noteStart = keyPressed.start + noteOct;
          if(!props.midiNoteInfo.find((exists) => Object.keys(exists)[0] == noteStart)) {
            let noteTrackId = `${noteOct}-track`;
            findSameNote(noteOct, keyPressed.start);

            props.setMidiNoteInfo((midiNoteInfo: MidiNoteInfo[]) => [...midiNoteInfo, {[noteStart]: {
              key: `${noteTrackId}-${countTemp}`,
              props: {
                id: keyPressed.start + noteTrackId + '-' + countTemp,
                className: 'midi-note',
              },
              keyPressed: keyPressed,
              noteTrackId: noteTrackId,
            }}])
            countTemp++;
            setCount(countTemp);
          }
        })
        props.keysUnpressed.forEach((keyUnpressed, noteOct) => {
          octave = parseInt(noteOct.replace(/\D/g,''));
          let noteStart = keyUnpressed.start + noteOct;
          let found = false
          // console.log(!midiNoteInfo.find((exists) => Object.keys(exists)[0] == noteStart));
          if(!found) {
            for(let i = props.midiNoteInfo.length - 1; i > -1; i--) {
              if(Object.keys(props.midiNoteInfo[i])[0] === noteStart && props.midiNoteInfo[i][Object.keys(props.midiNoteInfo[i])[0]].keyPressed.end === -1) {
                let newMidiNote = {[noteStart]: {...props.midiNoteInfo[i][noteStart], keyPressed: keyUnpressed}};
                setMidiRecording((midiRecording) => [...midiRecording, newMidiNote]);
                props.setMidiNoteInfo((midiNoteInfo: MidiNoteInfo[]) => {
                  let state = [...midiNoteInfo];
                  let newMidiNote = {[noteStart]: {...state[i][noteStart], keyPressed: keyUnpressed}}
                  // setMidiRecording((midiRecording) => [...midiRecording, newMidiNote])
                  state.splice(i, 1, newMidiNote);
                  return state;
                })
                break;
              }
            }
          }
        })
        props.setKeysUnpressed(new Map())
      }
    }
  }, [props.pulseNum, props.midiState.mode, props.keysPressed]);

  // Correct notes that go beyond midiLength
  useEffect(() => {
    if(props.midiNoteInfo.length > 0 && props.midiState.mode === 'stop') {
      let state = [...props.midiNoteInfo]

      for(let i = props.midiNoteInfo.length - 1; i > -1; i--) {
        let noteOct = Object.keys(state[i])[0]

        if(state[i][noteOct].keyPressed.end <= 0) {
          state[i][noteOct] = {...state[i][noteOct], keyPressed: {...state[i][noteOct].keyPressed, end: props.midiLength * props.pulseRate}}
        } else {
          break;
        }
      }
      props.setMidiNoteInfo(state);
    }
  }, [props.midiNoteInfo, props.midiState.mode]);

  // Add notes from current recording 
  useEffect(() => {
    if(props.midiState.mode === 'keyboard' && midiRecording.length > 0) {
      let mniTemp = [...props.midiNoteInfo]
      let count = 0;
      // console.log(midiRecording);
      // console.log(mniTemp);
      midiRecording.forEach((midiNote, i) => {
        var noteStart = Object.keys(midiNote)[0];
        var start = midiNote[noteStart].keyPressed.start;
        var end = midiNote[noteStart].keyPressed.end;
        var noteOct = noteStart.replace(`${start}`, '')

        for(var j = 0; j < props.midiNoteInfo.length; j++) {
          var midiNote2 = props.midiNoteInfo[j];
          var noteStart2 = Object.keys(midiNote2)[0]
          var start2 = midiNote2[noteStart2].keyPressed.start;
          var end2 = midiNote2[noteStart2].keyPressed.end;
          var noteOct2 = noteStart2.replace(`${start2}`, '')

          if(start > start2) break;
          // console.log((noteOct === noteOct2) ? noteOct + ' ' + noteOct2 + ' ' + start + ' < ' + start2 + ' ' + end +' > '+ start : '');
          // console.log(noteStart === noteStart2 && start2 > start && start2 < end);
          if(noteOct === noteOct2 && start < start2 && end > start2) {
            console.log(props.midiNoteInfo[j], midiRecording[i])
            Object.entries(mniTemp).some((entry) => {
              if(entry[1][noteStart2]) {
                console.log(entry[1][noteStart2], entry[0])
                mniTemp.splice(parseInt(entry[0]), 1);
              }
            })
            break;
            // mniTemp.splice(j, 1);
          }
        }
      })
      // console.log(mniTemp);
      props.setMidiNoteInfo(mniTemp)
      setMidiRecording([]);
    }
  }, [midiRecording, props.midiState.mode])

  useEffect(() => {
    if(props.midiState.mode === 'keyboard' ) {
      // console.log(midiRecorded)
      props.setPlayback(midiRecorded);
    }
  }, [props.midiState.mode, midiRecorded]);
  
  return (
      <MidiNotes gridSize={props.gridSize} midiNoteInfo={props.midiNoteInfo} notesRemoved={notesRemoved} controlsState={props.controlsState} midiLength={props.midiLength} midiState={props.midiState} pulseNum={props.pulseNum} pulseRate={props.pulseRate} noteTracksRef={props.noteTracksRef} subdiv={props.midiState.subdiv} controlsDispatch={props.controlsDispatch}/>
  )
}
// 1000 / (120 / 60) * 4 * 4
export default MidiRecorder;
//THIS ONE