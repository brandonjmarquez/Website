"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./PianoRoll.css");
const qwertyNote = require('../Tools/note-to-qwerty-key');
function Key(props) {
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const element = ref.current;
        element.addEventListener('pointerdown', onPointerDown);
        element.addEventListener('pointerup', onPointerUp);
        return (() => {
            element.removeEventListener('pointerdown', onPointerDown);
            element.removeEventListener('pointerup', onPointerUp);
        });
    });
    const onPointerDown = () => {
        // let input = document.getElementById('key-note-input');
        let input = document;
        let keydown = new KeyboardEvent('keydown', {
            key: props.qwertyKey,
            code: props.octave.toString(),
        });
        console.log(props.octave);
        if (input)
            input.dispatchEvent(keydown);
        // props.handleNotePlayed([props.qwertyKey, parseInt(props.octave), true]);
    };
    const onPointerUp = () => {
        // let input = document.getElementById('key-note-input');
        let input = document;
        let keyup = new KeyboardEvent('keyup', {
            key: props.qwertyKey,
            code: props.octave.toString(),
        });
        // console.log(props.octave)
        if (input)
            input.dispatchEvent(keyup);
        // props.handleNotePlayed([props.qwertyKey, parseInt(props.octave), false]);
    };
    let noteName;
    (props.note.includes('#')) ? noteName = props.note.replace('#', 'sharp') : noteName = props.note.replace('b', 'flat');
    return ((0, jsx_runtime_1.jsxs)("button", { type: 'button', ref: ref, id: noteName.toLowerCase() + props.octave + '-label', className: (props.note.length > 1) ? 'note-label accidental' : 'note-label natural', onMouseLeave: onPointerUp, children: [" ", props.note + props.octave] }));
}
function NoteLabels(props) {
    const memoNoteLabels = (0, react_1.useMemo)(() => {
        let gridLabelOctaves = [];
        let gridLabels = [];
        for (var x = props.octaveArray.length - 1; x >= 0; x--) {
            for (var y = 11; y >= 0; y--) {
                gridLabels.push((0, jsx_runtime_1.jsx)(Key, { qwertyKey: qwertyNote[y].key, note: qwertyNote[y].note, altNote: qwertyNote[y].altNote, octave: props.octaveArray[x] }, qwertyNote[y].note + props.octaveArray[x]));
            }
            gridLabelOctaves.push((0, jsx_runtime_1.jsx)("div", { id: `${x}-octave`, className: 'note-label-octaves', children: gridLabels }, x));
            gridLabels = [];
        }
        if (gridLabelOctaves.length === props.octaveArray.length) {
            return gridLabelOctaves;
        }
        return [];
    }, [props.octaveArray]);
    (0, react_1.useEffect)(() => {
        var element = document.getElementById('g' + props.octave + '-label');
        if (element) {
            element.scrollIntoView({ block: 'center' });
        }
    }, [memoNoteLabels]);
    return (0, jsx_runtime_1.jsx)("div", { ref: props.labelsRef, id: 'midi-note-labels', children: memoNoteLabels });
}
function PianoRoll(props) {
    const gridRef = (0, react_1.useRef)(null);
    const [labels, setLabels] = (0, react_1.useState)([]);
    const [octaveArray, setOctaveArray] = (0, react_1.useState)([]);
    const bgSizeTrack = 100 / props.numMeasures;
    (0, react_1.useLayoutEffect)(() => {
        getOctaveArray();
    }, [props.soundDetails, props.sound]);
    (0, react_1.useEffect)(() => {
    });
    function sendNoteProps(keyPressed) {
        props.handleNotePlayed(keyPressed);
    }
    function getOctaveArray() {
        Object.keys(props.soundDetails).some((key) => {
            let octaveArray = [];
            if (key === props.sound) {
                Object.keys(props.soundDetails[key]).forEach((octave) => {
                    octaveArray.push(parseInt(octave));
                });
                setOctaveArray(octaveArray);
                return Object.keys(props.soundDetails[key]);
            }
            else {
                return octaveArray;
            }
        });
    }
    function trackPosition() {
        let position = {};
        if (props.noteTracksRef.current) {
            position = { left: `${(.08 + props.pulseNum / (props.midiLength * props.pulseRate)) * props.noteTracksRef.current.offsetWidth}px` };
        }
        else {
            position = { left: `${(8 + props.pulseNum / (props.midiLength * props.pulseRate) * 92)}%` };
        }
        return (0, jsx_runtime_1.jsx)("div", { id: 'track-position', className: 'keyboard', style: position });
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(NoteLabels, { octaveArray: octaveArray, octave: props.octave, labelsRef: props.labelsRef }) }));
}
exports.default = PianoRoll;
