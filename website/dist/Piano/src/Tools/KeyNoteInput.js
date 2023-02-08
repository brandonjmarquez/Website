"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
const kbControls = require('../Tools/keyboard-controls');
function KeyNoteInput(props) {
    const ref = (0, react_1.useRef)(null);
    const [controller, setController] = (0, react_1.useState)({});
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
            if (!Object.keys(qwertyNote).includes(e.key)) {
                return;
            }
            let octave = props.octave + qwertyNote[e.key.toLowerCase()].octave;
            let pressed = true;
            if (parseInt(e.code) - parseInt(e.code) === 0) {
                octave = parseInt(e.code);
                console.log(octave);
            }
            if (!control) {
                let note = qwertyNote[e.key.toLowerCase()].note; // toLowerCase() is for caps lock
                setController((controller) => ({ ...controller, [note + octave]: { ...controller[note + octave], ...{ key: e.key.toLowerCase(), pressed: true, start: props.pulseNum, end: -1 } } }));
            }
            // console.warn('KEY DOWN')
            // console.warn(qwertyNote[key])
            // setController((controller) => ({...controller, [note + octave]: {...controller[note + octave], ...{key: e.key.toLowerCase(), pressed: true, start: props.pulseNum, end: props.pulseNum + 1}}}));
        };
        const onKeyUp = (e) => {
            if (!Object.keys(qwertyNote).includes(e.key))
                return;
            let octave = props.octave + qwertyNote[e.key.toLowerCase()].octave;
            let pressed = false;
            if (parseInt(e.code) - parseInt(e.code) === 0) {
                octave = parseInt(e.code);
            }
            let note = qwertyNote[e.key.toLowerCase()].note;
            setController((controller) => ({ ...controller, [note + octave]: { ...controller[note + octave], ...{ key: e.key.toLowerCase(), pressed: false, end: props.pulseNum } } }));
        };
        // const element = ref.current!;
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
    }, [props.octave, props.pulseNum, props.focus]);
    // useEffect(() => {
    //   const element = ref.current;
    //   if(element) {
    //     element.addEventListener('focusout', () => {
    //       let tempController = JSON.stringify(controller).replaceAll('true', 'false');
    //       tempController = JSON.stringify(controller).replaceAll('-1', '0');
    //       setController(JSON.parse(tempController))
    //     });
    //     return () => {
    //       element.removeEventListener('focusout', () => element.focus());
    //     };
    //   }
    //   // console.log(!element);
    //   // if(element) {
    //   //   console.log('huh');
    //   //   .focus();
    //   //   return () => {
    //   //     element.removeEventListener('focusout', () => element.focus());
    //   //   };
    //   // }
    // }, []);
    (0, react_1.useEffect)(() => {
        props.onNotePlayed(controller);
        // eslint-disable-next-line
    }, [controller]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}));
}
exports.default = KeyNoteInput;
