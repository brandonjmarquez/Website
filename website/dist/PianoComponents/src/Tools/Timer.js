"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const { Howl, Howler } = require('howler');
// import { createPortal } from 'react-dom';
function Metronome(props) {
    const [metronome, setMetronome] = (0, react_1.useState)();
    const [metPlayed, setMetPlayed] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        // if(props.pulseNum % 48 === 0) {
        //   setMetPlayed(metPlayed);
        // } else if(props.pulseNum % 24 === 0) {
        //   setMetPlayed(!metPlayed);
        // }
    }, [props.pulseNum, props.mode, props.metronome]);
    (0, react_1.useEffect)(() => {
        const met = new Howl({
            src: [`../sounds/Metronome/metronome.webm`, `${process.env.REACT_APP_SERVER}/sounds/Metronome/metronome.mp3`],
            sprite: {
                firstBeat: [0, 10],
                beat: [10, 10]
            },
            // onplay: () => setMetPlayed(!metPlayed)
        });
        setMetronome(met);
    }, []);
    (0, react_1.useEffect)(() => {
        if (props.pulseNum >= props.midiLength * props.pulseRate) {
            return;
        }
        if (metronome && props.mode != 'keyboard' && props.mode != 'stop' && props.metronome === 'on') {
            if (props.pulseNum % (props.ppq * 2) === 0) {
                // setMetPlayed(metPlayed);
                props.handleMetPlay(true);
            }
            else if (props.pulseNum % props.ppq === 0) {
                // setMetPlayed(!metPlayed);
                props.handleMetPlay(false);
            }
            if (props.pulseNum % (props.ppq * 4) === 0) {
                metronome.play('firstBeat');
            }
            else if (props.pulseNum % props.ppq === 0) {
                metronome.play('beat');
            }
        }
    }, [props.pulseNum, props.mode, props.metronome]);
    return null;
}
function Timer(props) {
    const [date, setDate] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
    }, [props.pulseNum]);
    (0, react_1.useEffect)(() => {
        // let pulseRate = 60 / props.bpm / props.ppq * 1000; //interval
        if (props.mode === 'recording' || props.mode === 'playing') {
            let start = performance.now();
            let tempTime = props.time;
            let pulseNum = props.pulseNum;
            setDate(setInterval(() => {
                let expected = tempTime + 1 / props.pulseRate;
                tempTime += performance.now() - start;
                tempTime += tempTime - expected;
                tempTime = Math.round(tempTime);
                if (tempTime % props.pulseRate < 5)
                    pulseNum++;
                // pulseNum = Math.round(tempTime * props.pulseRate);
                // pulseNum++;
                // console.log(pulseNum)
                start = performance.now();
                props.handleSetTime(tempTime);
                props.handleSetPulseNum(pulseNum);
            }, 1 / props.pulseRate));
        }
        else if (props.mode === 'keyboard' || props.mode === 'stop') {
            clearInterval(date);
            if (props.pulseNum >= props.midiLength * props.pulseRate || props.mode === 'stop') {
                console.log('reset timer');
                return;
            }
        }
    }, [props.mode]);
    function metPlay(dut) {
        props.handleMetPlay(dut);
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(Metronome, { metronome: props.metronome, midiLength: props.midiLength, mode: props.mode, ppq: props.ppq, pulseNum: props.pulseNum, pulseRate: props.pulseRate, handleMetPlay: metPlay }) }));
}
exports.default = Timer;
