"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SoundSettings_1 = require("./SettingsComponents/SoundSettings");
const MidiSettings_1 = require("./SettingsComponents/MidiSettings");
const TimerButtons_1 = require("./SettingsComponents/TimerButtons");
const KbFunctions_1 = require("./Tools/KbFunctions");
const KeyNoteInputCp_1 = require("./Tools/KeyNoteInputCp");
const Timer_1 = require("./Tools/Timer");
const MidiRecorder_1 = require("./MidiComponents/MidiRecorder");
const PianoInstrument_1 = require("./PianoComponents/PianoInstrument");
const PianoRoll_1 = require("./PianoComponents/PianoRoll");
const Grid_1 = require("./MidiComponents/Grid");
const axios_1 = require("axios");
require("./Piano.css");
function soundReducer(state, action) {
    switch (action.type) {
        case 'sound':
            return { ...state, sound: action.sound };
        case 'octave':
            return { ...state, octave: action.octave };
        case 'volume':
            return { ...state, volume: action.volume };
        default:
            return state;
    }
}
function midiReducer(state, action) {
    switch (action.type) {
        case 'numMeasures':
            return { ...state, numMeasures: action.numMeasures };
        case 'subdiv':
            return { ...state, subdiv: action.subdiv };
        case 'bpm':
            return { ...state, bpm: action.bpm };
        case 'metronome':
            return { ...state, metronome: action.metronome };
        case 'mode':
            return { ...state, mode: action.mode };
        default:
            return state;
    }
}
function controlsReducer(state, action) {
    switch (action.type) {
        case 'export':
            return { ...state, export: action.export };
        case 'undo':
            return { ...state, undo: action.undo };
        default:
            return state;
    }
}
function App() {
    const [soundDetails, setSoundDetails] = (0, react_1.useState)({});
    const [soundState, soundDispatch] = (0, react_1.useReducer)(soundReducer, { octave: 3, sound: 'GrandPiano', volume: '2mf' });
    const [midiState, midiDispatch] = (0, react_1.useReducer)(midiReducer, { bpm: 120, metronome: 'off', mode: 'keyboard', numMeasures: 4, ppq: 96, subdiv: 4 });
    const [controlsState, controlsDispatch] = (0, react_1.useReducer)(controlsReducer, { export: false, undo: false });
    const [octaveMinMax, setOctaveMinMax] = (0, react_1.useState)([0, 0]);
    const [controlsPressed, setControlsPressed] = (0, react_1.useState)(['', false]);
    const midiLength = (0, react_1.useMemo)(() => midiState.numMeasures * 4 / (midiState.bpm / 60 / 1000), [midiState.bpm]); // number of beats / bpm in ms
    const pulseRate = (0, react_1.useMemo)(() => midiState.ppq * (midiState.bpm / 60 / 1000), [midiState.bpm, midiState.ppq]); // ppq * bpm in ms
    const [time, setTime] = (0, react_1.useState)(0); // 24 * 120 /60/1000 * 16 /(120/60/1000)
    const [pulseNum, setPulseNum] = (0, react_1.useState)(0);
    const [keysPressed, setKeysPressed] = (0, react_1.useState)(new Map());
    const [keysUnpressed, setKeysUnpressed] = (0, react_1.useState)(new Map());
    const [playback, setPlayback] = (0, react_1.useState)([]);
    const [metPlay, setMetPlay] = (0, react_1.useState)(false);
    const [gridSize, setGridSize] = (0, react_1.useState)([]);
    const [focus, setFocus] = (0, react_1.useState)(false);
    const [midiNoteInfo, setMidiNoteInfo] = (0, react_1.useState)([]);
    const [menuShown, setMenuShown] = (0, react_1.useState)('');
    const selectorsRef = (0, react_1.useRef)(null);
    const noteTracksRef = (0, react_1.useRef)(null);
    const timerRef = (0, react_1.useRef)(null);
    const timeSliderRef = (0, react_1.useRef)(null);
    const pianoRollKeyRef = (0, react_1.useRef)(null);
    const labelsRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        async function getSoundDetails() {
            const url = `${process.env.REACT_APP_API}/sounds/Instruments`;
            const options = {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': true,
                },
            };
            var soundDetails = {};
            const soundDeets = await axios_1.default.get(url, options)
                .then(res => {
                soundDetails = res.data;
                console.log(soundDetails);
                return res.data;
            }).catch(err => console.error(err));
            setSoundDetails(soundDetails);
            return soundDeets;
        }
        getSoundDetails();
    }, []);
    (0, react_1.useEffect)(() => {
        if (Object.keys(soundDetails).length > 0) {
            let octavesArray = Object.keys(soundDetails[soundState.sound]);
            let octaveNums = [];
            octavesArray.forEach((octave) => {
                octaveNums.push(parseInt(octave));
            });
            let result = [Math.min(...octaveNums) + 1, Math.max(...octaveNums) + 1];
            setOctaveMinMax(result);
        }
    }, [soundDetails]);
    (0, react_1.useEffect)(() => {
        // console.log(pulseNum , 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4)
        // console.log(time);
        if (pulseNum === midiLength * pulseRate) {
            midiDispatch({ type: 'mode', mode: 'stop' });
            setTimeout(() => midiDispatch({ type: 'mode', mode: 'keyboard' }));
        }
    }, [pulseNum]);
    (0, react_1.useEffect)(() => {
        if (midiState.mode === 'stop') {
            setPulseNum(0);
            setTime(0);
            // setPlayback(tempPlayback)
            // setPlayback({})
        }
    }, [midiState.mode]);
    (0, react_1.useEffect)(() => {
        if (midiState.mode === 'keyboard') {
            // let tempKeysPressed = {...keysPressed};
            // let tempPlayback = {...playback};
            // Object.entries(keysPressed).forEach((keyPressed) => {
            //   tempKeysPressed[keyPressed[0]] = {...keyPressed[1], end: -1}
            // })
            setKeysUnpressed(new Map());
        }
    }, [midiState.mode]);
    function getOctaveArray() {
        let octaveArray = [];
        Object.keys(soundDetails).some((key) => {
            if (key === soundState.sound) {
                Object.keys(soundDetails[key]).forEach((octave) => {
                    octaveArray.push(parseInt(octave));
                });
            }
        });
        return octaveArray;
    }
    function pianoRollKeysPressed(keyPressed) {
        pianoRollKeyRef.current = keyPressed;
    }
    function metPlayed(dut) {
        setMetPlay(dut);
    }
    function clearControls() {
        setControlsPressed(['', false]);
    }
    const bgSizeTrack = 100 / midiState.numMeasures;
    // {console.log(selectorsRef.current)}
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("style", { children: `
            #midi {
              width: ${100}%;
            }

            #midi-note-labels {
              max-width: ${(document.body.offsetWidth <= noteTracksRef.current?.offsetWidth + labelsRef.current?.offsetWidth) ? '8vmax' : '8%'};
              min-width: min-content;
             
            }
            #midi-track {  
              width: 100%;
              height: 100%;
            }

            .note-label {
              // height: ${(100) / 12}%;
            }

          ` }), (0, jsx_runtime_1.jsxs)("div", { ref: selectorsRef, id: 'selectors', children: [(0, jsx_runtime_1.jsxs)("div", { className: 'settings-buttons', children: [(menuShown === 'PianoSettings') ? (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { className: 'settings-button left', onClick: () => setMenuShown(''), children: "Piano Settings" }), (0, jsx_runtime_1.jsx)(SoundSettings_1.default, { soundDetails: soundDetails, sound: soundState.sound, octave: soundState.octave, volume: soundState.volume, pianoDispatch: soundDispatch })] }) : (0, jsx_runtime_1.jsx)("button", { className: 'settings-button left', onClick: () => setMenuShown('PianoSettings'), children: "Piano Settings" }), (menuShown === 'MidiSettings') ? (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(MidiSettings_1.default, { soundDetails: soundDetails, numMeasures: midiState.numMeasures, subdiv: midiState.subdiv, bpm: midiState.bpm, mode: midiState.mode, controlsDispatch: controlsDispatch, midiDispatch: midiDispatch }), (0, jsx_runtime_1.jsx)("button", { className: 'settings-button right', onClick: () => setMenuShown(''), children: "Midi Settings" })] }) : (0, jsx_runtime_1.jsx)("button", { className: 'settings-button right', onClick: () => setMenuShown('MidiSettings'), children: "Midi Settings" })] }), (0, jsx_runtime_1.jsxs)("div", { ref: timerRef, id: 'timer-buttons', children: [(0, jsx_runtime_1.jsx)(TimerButtons_1.default, { metPlay: metPlay, metronome: midiState.metronome, mode: midiState.mode, pulseNum: pulseNum, midiDispatch: midiDispatch }), (0, jsx_runtime_1.jsx)("input", { readOnly: true, id: 'time', className: 'settings input', value: (pulseNum / pulseRate / 1000).toFixed(2) }), (0, jsx_runtime_1.jsx)(KbFunctions_1.default, { controlsPressed: controlsPressed, metronome: midiState.metronome, mode: midiState.mode, octave: soundState.octave, octaveMinMax: octaveMinMax, selectorsRef: selectorsRef, clearControls: clearControls, controlsDispatch: controlsDispatch, midiDispatch: midiDispatch, soundDispatch: soundDispatch })] })] }), (0, jsx_runtime_1.jsx)("div", { className: 'midi-piano', children: (0, jsx_runtime_1.jsxs)("div", { id: 'midi', children: [(0, jsx_runtime_1.jsx)(PianoRoll_1.default, { labelsRef: labelsRef, midiLength: midiLength, noteTracksRef: noteTracksRef, numMeasures: midiState.numMeasures, octave: soundState.octave, pulseNum: pulseNum, pulseRate: pulseRate, sound: soundState.sound, soundDetails: soundDetails, subdiv: midiState.subdiv, time: pulseNum, handleNotePlayed: pianoRollKeysPressed }), (0, jsx_runtime_1.jsxs)("div", { id: 'midi-track', style: { backgroundSize: `${bgSizeTrack}%` }, children: [(noteTracksRef.current && selectorsRef.current) ? (0, jsx_runtime_1.jsx)("input", { ref: timeSliderRef, type: 'range', id: 'time-slider', min: '0', max: `${midiLength * pulseRate}`, value: pulseNum, style: { position: 'sticky', height: 'max-content', top: `${selectorsRef.current.offsetHeight}px` }, onChange: (e) => { setTime(parseInt(e.target.value) / pulseRate); setPulseNum(parseInt(e.target.value)); } }) : null, (0, jsx_runtime_1.jsx)(Grid_1.default, { gridSize: gridSize, midiLength: midiLength, noteTracksRef: noteTracksRef, numMeasures: midiState.numMeasures, pulseNum: pulseNum, pulseRate: pulseRate, selectorsRef: selectorsRef, subdiv: midiState.subdiv, time: time, octaveArray: getOctaveArray(), setPulseNum: setPulseNum, setTime: setTime })] })] }) }), (0, jsx_runtime_1.jsx)(KeyNoteInputCp_1.default, { focus: focus, octave: soundState.octave, pianoRollKey: pianoRollKeyRef.current, pulseNum: pulseNum, onControlsPressed: setControlsPressed, onNotePlayed: setKeysPressed, setKeysPressed: setKeysPressed, setKeysUnpressed: setKeysUnpressed }), (0, jsx_runtime_1.jsx)(MidiRecorder_1.default, { controlsState: controlsState, gridSize: gridSize, keysPressed: keysPressed, keysUnpressed: keysUnpressed, midiLength: midiLength, midiNoteInfo: midiNoteInfo, midiState: midiState, noteTracksRef: noteTracksRef, pulseNum: pulseNum, pulseRate: pulseRate, controlsDispatch: controlsDispatch, setKeysUnpressed: setKeysUnpressed, setMidiNoteInfo: setMidiNoteInfo, setPlayback: setPlayback }), (0, jsx_runtime_1.jsx)(Timer_1.default, { bpm: midiState.bpm, metronome: midiState.metronome, midiLength: midiLength, time: time, timerRef: timerRef, mode: midiState.mode, ppq: midiState.ppq, pulseNum: pulseNum, pulseRate: pulseRate, handleMetPlay: metPlayed, handleSetTime: setTime, handleSetPulseNum: setPulseNum }), (0, jsx_runtime_1.jsx)(PianoInstrument_1.default, { pulseNum: pulseNum, soundDetails: soundDetails, sound: soundState.sound, octave: soundState.octave, octaveMinMax: octaveMinMax, volume: soundState.volume, mode: midiState.mode, keysPressed: keysPressed, keysUnpressed: keysUnpressed, playback: playback, labelsRef: labelsRef, setKeysUnpressed: setKeysUnpressed })] }));
}
exports.default = App;
