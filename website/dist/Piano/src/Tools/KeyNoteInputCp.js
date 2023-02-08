"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
const kbControls = require('../Tools/keyboard-controls');
function KeyNoteInput(props) {
    const [keysPressed, setKeysPressed] = (0, react_1.useState)(new Map());
    const [keysUnpressed, setKeysUnpressed] = (0, react_1.useState)(new Map());
    // const [loginExists, setLoginExists] = useState<boolean>(props.loginRef.current !== undefined)
    // useEffect(() => { 
    //   console.log(props.loginRef.current)
    // }, [props.loginRef.current])
    (0, react_1.useEffect)(() => {
        const onKeyDown = (e) => {
            if (e.repeat) {
                // setController((controller) => ({...controller, [note + octave]: {...controller[note + octave], ...{end: props.pulseNum}}}));
                return;
            }
            ;
            const control = e.metaKey || e.ctrlKey;
            if (Object.keys(kbControls).includes(e.key)) {
                e.preventDefault();
                props.onControlsPressed([e.key, control]);
            }
            if (!Object.keys(qwertyNote).includes(e.key.toLocaleLowerCase())) {
                return;
            }
            let octave = props.octave + qwertyNote[e.key.toLocaleLowerCase()].octave;
            if (parseInt(e.code) - parseInt(e.code) === 0) {
                octave = parseInt(e.code);
            }
            if (!control) {
                let note = qwertyNote[e.key.toLowerCase()].note; // toLowerCase() is for caps lock
                setKeysPressed((keysPressed) => {
                    let state = new Map(keysPressed);
                    state.set(note + octave, { key: e.key.toLowerCase(), pressed: true, start: props.pulseNum, end: -1 });
                    return state;
                });
                if (keysUnpressed.get(note + octave)) {
                    setKeysUnpressed((keysPressed) => {
                        let state = new Map(keysPressed);
                        state.delete(note + octave);
                        return state;
                    });
                }
            }
        };
        const onKeyUp = (e) => {
            if (!Object.keys(qwertyNote).includes(e.key))
                return;
            let octave = props.octave + qwertyNote[e.key.toLocaleLowerCase()].octave;
            if (parseInt(e.code) - parseInt(e.code) === 0) {
                octave = parseInt(e.code);
            }
            let note = qwertyNote[e.key.toLocaleLowerCase()].note;
            let noteOct = note + octave;
            if (keysPressed.size > 0 && keysPressed.get(noteOct)) {
                setKeysUnpressed((keysUnpressed) => {
                    let state = new Map(keysUnpressed);
                    console.log(keysPressed.get(note + octave));
                    state.set(noteOct, { start: keysPressed.get(noteOct).start, key: e.key.toLowerCase(), pressed: false, end: props.pulseNum });
                    return state;
                });
                if (keysPressed.get(note + octave)) {
                    setKeysPressed((keysPressed) => {
                        let state = new Map(keysPressed);
                        state.delete(note + octave);
                        return state;
                    });
                }
            }
        };
        if (document && !props.focus) {
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);
            return () => {
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('keyup', onKeyUp);
            };
        }
        else {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        }
    }, [props.octave, props.pulseNum, props.focus, keysPressed, keysUnpressed]);
    (0, react_1.useEffect)(() => {
        props.setKeysPressed(keysPressed);
        // eslint-disable-next-line
    }, [keysPressed]);
    (0, react_1.useEffect)(() => {
        props.setKeysUnpressed(keysUnpressed);
        // eslint-disable-next-line
    }, [keysUnpressed]);
    return null;
}
exports.default = KeyNoteInput;
