"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const fa_1 = require("react-icons/fa");
function TimerButtons(props) {
    (0, react_1.useEffect)(() => {
        // console.log(props.metPlay)
    }, [props.metPlay]);
    const recordingClassName = `playback-button recording-button${(props.mode === 'recording') ? ' active' : ''}`;
    const playingClassName = `playback-button playing-button${(props.mode === 'playing') ? ' active' : ''}`;
    const metronomeClassName = `playback-button metronome-button${props.metronome === 'on' ? ' active' : ''}`;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { type: 'button', className: 'playback-button stop-button', onClick: () => { props.midiDispatch({ type: 'mode', mode: (props.mode === 'keyboard') ? 'stop' : 'keyboard' }); setTimeout(() => props.midiDispatch({ type: 'mode', mode: 'keyboard' })); }, children: (0, jsx_runtime_1.jsx)(fa_1.FaStop, { style: { verticalAlign: 'middle' } }) }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: recordingClassName, onClick: () => props.midiDispatch({ type: 'mode', mode: (props.mode === 'keyboard') ? 'recording' : 'keyboard' }), children: (0, jsx_runtime_1.jsx)(fa_1.FaCircle, { style: { verticalAlign: 'middle' } }) }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: playingClassName, onClick: () => props.midiDispatch({ type: 'mode', mode: (props.mode === 'keyboard') ? 'playing' : 'keyboard' }), children: (0, jsx_runtime_1.jsx)(fa_1.FaPlay, { style: { verticalAlign: 'middle' } }) }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: metronomeClassName, onClick: () => { props.midiDispatch({ type: 'metronome', metronome: (props.metronome === 'on') ? 'off' : 'on' }); }, children: (props.metPlay) ? (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaRegCircle, { style: { verticalAlign: 'middle' } }), (0, jsx_runtime_1.jsx)(fa_1.FaCircle, { style: { verticalAlign: 'middle' } })] }) : (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaCircle, { style: { verticalAlign: 'middle' } }), (0, jsx_runtime_1.jsx)(fa_1.FaRegCircle, { style: { verticalAlign: 'middle' } })] }) })] }));
}
exports.default = TimerButtons;
