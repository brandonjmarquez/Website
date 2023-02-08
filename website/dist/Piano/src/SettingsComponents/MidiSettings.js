"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const DragLabel_1 = require("../Tools/DragLabel");
require("./Settings.css");
const fa_1 = require("react-icons/fa");
const react_dom_1 = require("react-dom");
function BpmInput(props) {
    const [value, setValue] = (0, react_1.useState)(0);
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (props.bpm > 160) {
            alert('BPM cannot exceed 160.');
            props.midiDispatch({ type: 'bpm', bpm: 120 });
        }
    }, [props.bpm]);
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(DragLabel_1.default, { plane: 'y', range: [0, 161], style: { cursor: 'ns-resize', userSelect: 'none' }, text: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaArrowsAltV, { style: { verticalAlign: 'middle' } }), "BPM"] }), value: props.bpm, setValue: (bpm) => { props.midiDispatch({ type: 'bpm', bpm: bpm }); } }), (0, jsx_runtime_1.jsx)("input", { ref: ref, className: 'bpm-input settings input', value: props.bpm.toString(), onChange: (e) => (e.target.value === '') ? props.midiDispatch({ type: 'bpm', bpm: 0 }) : props.midiDispatch({ type: 'bpm', bpm: parseInt(e.target.value) }) })] });
}
function MidiSettings(props) {
    const [modal, setModal] = (0, react_1.useState)();
    function renderNumMeasures() {
        var measureOpts = [];
        for (var i = 1; i < 9; i++) {
            measureOpts.push((0, jsx_runtime_1.jsx)("option", { value: i, children: i }, i));
        }
        return measureOpts;
    }
    function newTrack() {
        var picked = 'none';
        pickNew();
        function pickNew() {
            console.log(picked);
            if (picked === 'none' && props.selectorsRef.current) {
                setModal((0, react_dom_1.createPortal)((0, jsx_runtime_1.jsxs)("div", { id: 'popup', children: [(0, jsx_runtime_1.jsx)("div", { id: 'popup-bg' }), (0, jsx_runtime_1.jsxs)("div", { id: 'popup-select', className: 'popup select', style: {
                                marginTop: `${props.selectorsRef.current.offsetHeight / 4}px`,
                                // left: `${props.selectorsRef.current.offsetWidth / 8}%`,
                                zIndex: 6
                            }, children: [(0, jsx_runtime_1.jsx)("button", { type: 'button', className: 'popup-button settings button', onClick: () => {
                                        picked = 'new';
                                        document.getElementById('popup-bg').classList.toggle('lift-out');
                                        document.getElementById('popup-select').classList.toggle('lift-out');
                                        setTimeout(() => setModal(null), 500);
                                    }, children: "Start New Track" }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: 'popup-button settings button', onClick: () => {
                                        picked = 'dont';
                                        document.getElementById('popup-bg').classList.toggle('lift-out');
                                        document.getElementById('popup-select').classList.toggle('lift-out');
                                        setTimeout(() => setModal(null), 500);
                                    }, children: "Keep Track" })] })] }), props.selectorsRef.current));
                setTimeout(pickNew, 0);
            }
            else {
                if (picked === 'new') {
                    props.setMidiNoteInfo([]);
                }
                else if (picked === 'dont') {
                    return;
                }
            }
        }
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [modal, (0, jsx_runtime_1.jsx)(BpmInput, { bpm: props.bpm, midiDispatch: props.midiDispatch }), (0, jsx_runtime_1.jsxs)("select", { name: 'subdiv', id: 'subdiv-selector', className: 'settings', value: props.subdiv, onChange: (e) => { props.midiDispatch({ type: 'subdiv', subdiv: parseInt(e.target.value) }); }, children: [(0, jsx_runtime_1.jsx)("option", { value: '1', children: "1" }), (0, jsx_runtime_1.jsx)("option", { value: '2', children: "1/2" }), (0, jsx_runtime_1.jsx)("option", { value: '4', children: "1/4" }), (0, jsx_runtime_1.jsx)("option", { value: '8', children: "1/8" }), (0, jsx_runtime_1.jsx)("option", { value: '16', children: "1/16" }), (0, jsx_runtime_1.jsx)("option", { value: '32', children: "1/32" })] }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: 'settings button', onClick: () => {
                    if (props.midiNoteInfoLength > 0)
                        newTrack();
                    else
                        props.setMidiNoteInfo([]);
                }, children: "New" })] }));
}
exports.default = MidiSettings;
