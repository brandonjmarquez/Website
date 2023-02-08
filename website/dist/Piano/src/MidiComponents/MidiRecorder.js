"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// import MidiNotes from './MidiNotes';
const MidiNotes_1 = require("./MidiNotes");
require("./MidiRecorder.css");
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
function MidiRecorder(props) {
    const [count, setCount] = (0, react_1.useState)(0);
    const [clickCoords, setClickCoords] = (0, react_1.useState)([]);
    const [midiRecorded, setMidiRecorded] = (0, react_1.useState)([]);
    const [midiRecording, setMidiRecording] = (0, react_1.useState)([]);
    const [notesRemoved, setNotesRemoved] = (0, react_1.useState)([]);
    const [notesAdded, setNotesAdded] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        // console.log('midiNoteInfo', midiNoteInfo)
        // setMidiNoteInfo(props.midiNoteInfo)
    }, [props.midiNoteInfo]);
    // Add or remove note upon clicking a note track or a note
    (0, react_1.useEffect)(() => {
        function addRemNote(e) {
            var elem;
            if (e.target) {
                elem = e.target;
                console.log(props.midiState.mode);
                if (elem.tagName == "DIV") {
                    setClickCoords([e.clientX, e.clientY]);
                }
                else if (elem.tagName == "SPAN" && props.midiState.mode === 'keyboard') {
                    console.log('double');
                    let key = elem.id.substring(0, elem.id.indexOf('-'));
                    let remIndex = 0;
                    for (var i = 0; i < props.midiNoteInfo.length; i++) {
                        if (Object.keys(props.midiNoteInfo[i])[0] === key)
                            remIndex = i;
                    }
                    // console.log(remIndex, key, props.midiNoteInfo[remIndex])
                    // let remProp = 
                    setNotesRemoved((notesRemoved) => [...notesRemoved, { [remIndex]: { [key]: props.midiNoteInfo[remIndex][key] } }]);
                    props.setMidiNoteInfo((midiNoteInfo) => {
                        let state = [...midiNoteInfo];
                        state.splice(remIndex, 1);
                        return state;
                    });
                }
            }
        }
        if (props.noteTracksRef.current) {
            props.noteTracksRef.current.addEventListener('dblclick', addRemNote);
        }
        return () => {
            if (props.noteTracksRef.current)
                props.noteTracksRef.current.removeEventListener('dblclick', addRemNote);
        };
    }, [props.noteTracksRef.current, props.midiNoteInfo, props.midiState.mode]);
    (0, react_1.useEffect)(() => {
        if (props.midiNoteInfo.length > 0 && props.midiState.mode === 'keyboard') {
            let mniTemp = [...props.midiNoteInfo];
            props.midiNoteInfo.forEach((noteInfo, i, midiNoteInfo) => {
                let noteStart = Object.keys(noteInfo)[0];
                if (noteInfo[noteStart].keyPressed) {
                    if (noteInfo[noteStart].keyPressed.end === -1) {
                        mniTemp[i] = { [noteStart]: { ...midiNoteInfo[i][noteStart],
                                keyPressed: { ...midiNoteInfo[i][noteStart].keyPressed, end: props.pulseNum }
                            } };
                    }
                }
            });
            // console.log(mniTemp)
            props.setMidiNoteInfo(mniTemp);
        }
    }, [props.midiState.mode]);
    // Add notes from midiNoteInfo to midiRecorded.
    (0, react_1.useEffect)(() => {
        if (props.midiNoteInfo.length > 0) {
            // console.log(midiNoteInfo);
            let midiRecTemp = [];
            props.midiNoteInfo.forEach((noteInfo) => {
                let noteStart = Object.keys(noteInfo)[0];
                if (noteInfo[noteStart].keyPressed) {
                    let noteOct = noteStart.replace(noteInfo[noteStart].keyPressed.start.toString(), '');
                    // console.log(qwertyNote[noteInfo[noteStart].keyPressed!.key!])
                    let qwertyKeys = Object.keys(qwertyNote);
                    for (var i = 0; i < qwertyKeys.length; i++) {
                        if (qwertyNote[qwertyKeys[i]].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwertyKeys[i]].octave === 0) {
                            // console.log(noteOct)
                            let startNote = {
                                key: qwertyKeys[i],
                                octave: parseInt(noteOct.replace(/\D/g, '')),
                                pressed: true,
                                start: noteInfo[noteStart].keyPressed.start,
                                end: -1,
                            };
                            let endNote = {
                                key: qwertyKeys[i],
                                octave: parseInt(noteOct.replace(/\D/g, '')),
                                pressed: false,
                                start: noteInfo[noteStart].keyPressed.start,
                                end: noteInfo[noteStart].keyPressed.end,
                            };
                            let keyPressedStart = (midiRecTemp[noteInfo[noteStart].keyPressed.start]) ? midiRecTemp[noteInfo[noteStart].keyPressed.start] : new Map();
                            let keyPressedEnd = (midiRecTemp[noteInfo[noteStart].keyPressed.end]) ? midiRecTemp[noteInfo[noteStart].keyPressed.end] : new Map();
                            keyPressedStart.set(noteOct, startNote);
                            keyPressedEnd.set(noteOct, endNote);
                            midiRecTemp[noteInfo[noteStart].keyPressed.start] = keyPressedStart;
                            midiRecTemp[noteInfo[noteStart].keyPressed.end] = keyPressedEnd;
                            break;
                        }
                    }
                }
            });
            // console.log(midiRecTemp);
            setMidiRecorded(midiRecTemp);
        }
        else {
            setMidiRecorded([]);
        }
    }, [props.midiNoteInfo]);
    // Add notes from clicking grid to midiNoteInfo.
    (0, react_1.useEffect)(() => {
        if (props.noteTracksRef.current) {
            let noteTrackElem;
            let noteTrackId = '';
            let subdivElem;
            let subdivId = '';
            let countTemp = count;
            if (document.elementsFromPoint(clickCoords[0], clickCoords[1]).length > 0) {
                document.elementsFromPoint(clickCoords[0], clickCoords[1]).forEach((elem) => {
                    if (elem.getAttribute('class') === 'note-track') {
                        noteTrackElem = elem;
                        noteTrackId = elem.id;
                    }
                    if (elem.getAttribute('class') === 'subdivision') {
                        subdivElem = elem;
                        subdivId = elem.id;
                    }
                });
            }
            if (noteTrackId.length > 0 && subdivId.length > 0) {
                let noteOct = noteTrackId.replace('-track', '');
                let key = (() => {
                    Object.keys(qwertyNote).forEach((qwerty) => {
                        // console.log(qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, ''))
                        if (qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, ''))
                            return qwerty;
                    });
                    return '';
                })();
                // console.error(key)
                let subdiv = parseInt(subdivId.replace(/\D/g, ''));
                let rect = subdivElem.getBoundingClientRect();
                let left = rect.left;
                let width = rect.right - rect.left;
                let height = props.noteTracksRef.current.offsetHeight / props.noteTracksRef.current.children.length - 2;
                if ((subdiv - 1) % props.midiState.subdiv === 0) {
                    width -= 2;
                }
                let start = Math.trunc((subdiv - 1) / (props.midiState.numMeasures * props.midiState.subdiv) * props.midiLength * props.pulseRate);
                let end = Math.trunc(start + 1 / (props.midiState.subdiv * props.midiState.numMeasures) * props.midiLength * props.pulseRate) - 1;
                setNotesAdded((notesAdded) => [...notesAdded, { [noteTrackId]: { pulse: start } }]);
                props.setMidiNoteInfo((midiNoteInfo) => [...midiNoteInfo, ...[{ [start + noteOct]: {
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
                            } }]]);
                countTemp++;
                setCount(countTemp);
            }
        }
    }, [clickCoords]);
    // Add notes from recording to midiNoteInfo
    (0, react_1.useEffect)(() => {
        function findSameNote(noteOct, start) {
            // var start = parseInt(start.substring(0, noteStart.indexOf(noteOct)));
            props.midiNoteInfo.forEach((midiNote, i) => {
                var noteStart2 = Object.keys(midiNote)[0];
                var noteOct2 = midiNote[noteStart2].noteTrackId.substring(0, midiNote[noteStart2].noteTrackId.indexOf('-'));
                if (noteOct === noteOct2) {
                    var start2 = parseInt(noteStart2.substring(0, noteStart2.indexOf(noteOct2)));
                    var end2 = midiNote[noteStart2].keyPressed.end;
                    if (start < end2 && start > start2) {
                        props.setMidiNoteInfo((midiNoteInfo) => {
                            let state = [...midiNoteInfo];
                            state[i][noteStart2].keyPressed = { ...state[i][noteStart2].keyPressed, end: start - 1 };
                            return state;
                        });
                    }
                }
            });
        }
        if (props.noteTracksRef && props.midiState.mode === 'recording') {
            let octave;
            let countTemp = count;
            if (props.noteTracksRef.current) {
                props.keysPressed.forEach((keyPressed, noteOct) => {
                    octave = parseInt(noteOct.replace(/\D/g, ''));
                    let noteStart = keyPressed.start + noteOct;
                    if (!props.midiNoteInfo.find((exists) => Object.keys(exists)[0] == noteStart)) {
                        let noteTrackId = `${noteOct}-track`;
                        findSameNote(noteOct, keyPressed.start);
                        props.setMidiNoteInfo((midiNoteInfo) => [...midiNoteInfo, { [noteStart]: {
                                    key: `${noteTrackId}-${countTemp}`,
                                    props: {
                                        id: keyPressed.start + noteTrackId + '-' + countTemp,
                                        className: 'midi-note',
                                    },
                                    keyPressed: keyPressed,
                                    noteTrackId: noteTrackId,
                                } }]);
                        countTemp++;
                        setCount(countTemp);
                    }
                });
                props.keysUnpressed.forEach((keyUnpressed, noteOct) => {
                    octave = parseInt(noteOct.replace(/\D/g, ''));
                    let noteStart = keyUnpressed.start + noteOct;
                    let found = false;
                    // console.log(!midiNoteInfo.find((exists) => Object.keys(exists)[0] == noteStart));
                    if (!found) {
                        for (let i = props.midiNoteInfo.length - 1; i > -1; i--) {
                            if (Object.keys(props.midiNoteInfo[i])[0] === noteStart && props.midiNoteInfo[i][Object.keys(props.midiNoteInfo[i])[0]].keyPressed.end === -1) {
                                let newMidiNote = { [noteStart]: { ...props.midiNoteInfo[i][noteStart], keyPressed: keyUnpressed } };
                                setMidiRecording((midiRecording) => [...midiRecording, newMidiNote]);
                                props.setMidiNoteInfo((midiNoteInfo) => {
                                    let state = [...midiNoteInfo];
                                    let newMidiNote = { [noteStart]: { ...state[i][noteStart], keyPressed: keyUnpressed } };
                                    // setMidiRecording((midiRecording) => [...midiRecording, newMidiNote])
                                    state.splice(i, 1, newMidiNote);
                                    return state;
                                });
                                break;
                            }
                        }
                    }
                });
                props.setKeysUnpressed(new Map());
            }
        }
    }, [props.pulseNum, props.midiState.mode, props.keysPressed]);
    // Correct notes that go beyond midiLength
    (0, react_1.useEffect)(() => {
        if (props.midiNoteInfo.length > 0 && props.midiState.mode === 'stop') {
            let state = [...props.midiNoteInfo];
            for (let i = props.midiNoteInfo.length - 1; i > -1; i--) {
                let noteOct = Object.keys(state[i])[0];
                if (state[i][noteOct].keyPressed.end <= 0) {
                    state[i][noteOct] = { ...state[i][noteOct], keyPressed: { ...state[i][noteOct].keyPressed, end: props.midiLength * props.pulseRate } };
                }
                else {
                    break;
                }
            }
            props.setMidiNoteInfo(state);
        }
    }, [props.midiNoteInfo, props.midiState.mode]);
    // Add notes from current recording 
    (0, react_1.useEffect)(() => {
        if (props.midiState.mode === 'keyboard' && midiRecording.length > 0) {
            let mniTemp = [...props.midiNoteInfo];
            let count = 0;
            // console.log(midiRecording);
            // console.log(mniTemp);
            midiRecording.forEach((midiNote, i) => {
                var noteStart = Object.keys(midiNote)[0];
                var start = midiNote[noteStart].keyPressed.start;
                var end = midiNote[noteStart].keyPressed.end;
                var noteOct = noteStart.replace(`${start}`, '');
                for (var j = 0; j < props.midiNoteInfo.length; j++) {
                    var midiNote2 = props.midiNoteInfo[j];
                    var noteStart2 = Object.keys(midiNote2)[0];
                    var start2 = midiNote2[noteStart2].keyPressed.start;
                    var end2 = midiNote2[noteStart2].keyPressed.end;
                    var noteOct2 = noteStart2.replace(`${start2}`, '');
                    if (start > start2)
                        break;
                    // console.log((noteOct === noteOct2) ? noteOct + ' ' + noteOct2 + ' ' + start + ' < ' + start2 + ' ' + end +' > '+ start : '');
                    // console.log(noteStart === noteStart2 && start2 > start && start2 < end);
                    if (noteOct === noteOct2 && start < start2 && end > start2) {
                        console.log(props.midiNoteInfo[j], midiRecording[i]);
                        Object.entries(mniTemp).some((entry) => {
                            if (entry[1][noteStart2]) {
                                console.log(entry[1][noteStart2], entry[0]);
                                mniTemp.splice(parseInt(entry[0]), 1);
                            }
                        });
                        break;
                        // mniTemp.splice(j, 1);
                    }
                }
            });
            // console.log(mniTemp);
            props.setMidiNoteInfo(mniTemp);
            setMidiRecording([]);
        }
    }, [midiRecording, props.midiState.mode]);
    (0, react_1.useEffect)(() => {
        if (props.midiState.mode === 'keyboard') {
            // console.log(midiRecorded)
            props.setPlayback(midiRecorded);
        }
    }, [props.midiState.mode, midiRecorded]);
    return ((0, jsx_runtime_1.jsx)(MidiNotes_1.default, { gridSize: props.gridSize, midiNoteInfo: props.midiNoteInfo, notesRemoved: notesRemoved, controlsState: props.controlsState, midiLength: props.midiLength, midiState: props.midiState, pulseNum: props.pulseNum, pulseRate: props.pulseRate, noteTracksRef: props.noteTracksRef, subdiv: props.midiState.subdiv, controlsDispatch: props.controlsDispatch }));
}
// 1000 / (120 / 60) * 4 * 4
exports.default = MidiRecorder;
