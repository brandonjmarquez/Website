import React, { useState, useEffect, createElement, useLayoutEffect, ReactPortal } from 'react';
import { createPortal } from 'react-dom';
import { MidiNotesProps, NoteTrackChilds, Widths } from '../Tools/Interfaces';
import './MidiNotes.css';

function MidiNotes(props: MidiNotesProps) {
  const [widths, setWidths] = useState<Widths>({});
  const [midiNotes, setMidiNotes] = useState<ReactPortal[]>([]);
  const [dimensions, setDimensions] = useState<{height: number, width: number}>({height: window.innerHeight, width: window.innerWidth});

  useEffect(() => {
    window.addEventListener('resize', () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })}
    );
    return () => window.removeEventListener('resize', () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })}
    );
  }, []);

  useLayoutEffect(() => {
    setWidths((widths) => {
      let state: Widths = {}

      props.midiNoteInfo.forEach((midiNote) => {
        let noteStart = Object.keys(midiNote)[0];
        let start = midiNote[noteStart].keyPressed!.start!;
        let end = midiNote[noteStart].keyPressed!.end!;

        if(midiNote[noteStart].keyPressed!.start >= 0) {
          state[noteStart] = {start: start, end: end};
        }
      })
      return state;
    })
  }, [props.pulseNum, props.midiNoteInfo, dimensions])

  useLayoutEffect(() => {
    setMidiNotes([])
    function renderPortals() {
      const noteTrackChilds: NoteTrackChilds = {};
      const midiNotesArr: ReactPortal[] = []

      props.midiNoteInfo.forEach((noteStart) => {
        let key = Object.keys(noteStart)[0];

        if(Object.keys(widths).includes(key)) {
          let left = widths[key].start / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth + 2;
          let width = (widths[key].end - widths[key].start) / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth - 2;

          if(widths[key].end === -1) {
            width = (props.pulseNum - widths[key].start) / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth;
          }

          var elem = createElement('span', {...noteStart[key].props, key: noteStart[key].key, style: {
            height: `${document.getElementById(noteStart[key].noteTrackId)!.offsetHeight - 4}px`,
            left: `${left}px` ,
            width: `${width}px`,
          }});

          if(!noteTrackChilds[noteStart[key].noteTrackId]) {
            noteTrackChilds[noteStart[key].noteTrackId] = [];
          }

          noteTrackChilds[noteStart[key].noteTrackId].push(elem)
        }
      });
      Object.keys(noteTrackChilds).forEach((noteTrackId) => {
        midiNotesArr.push(createPortal(noteTrackChilds[noteTrackId], props.noteTracksRef.current!.children.namedItem(noteTrackId)!))
      })
      return midiNotesArr;
    }

    if(Object.keys(widths).length > 0) {
      setMidiNotes(renderPortals())
    }
  }, [widths, props.pulseNum, props.gridSize])

  return (
    <>
      {midiNotes}
    </>
  )
}

export default MidiNotes