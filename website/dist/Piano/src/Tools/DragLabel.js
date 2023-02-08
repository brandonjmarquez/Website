"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("../SettingsComponents/Settings.css");
function DragLabel(props) {
    const [origVal, setOrigVal] = (0, react_1.useState)(props.value);
    const [startVal, setStartVal] = (0, react_1.useState)(0);
    const onStart = (0, react_1.useCallback)((e) => {
        console.log(e.clientY);
        (props.plane === 'y') ? setStartVal(e.clientY) : setStartVal(e.clientX);
        setOrigVal(props.value);
    }, [props.value]);
    (0, react_1.useEffect)(() => {
        function onUpdate(e) {
            if (startVal) {
                if (props.plane === 'y') {
                    if (startVal - e.clientY + origVal > props.range[0] && startVal - e.clientY + origVal < props.range[1])
                        props.setValue(startVal - e.clientY + origVal);
                }
                else {
                    if (startVal - e.clientX + origVal > props.range[0] && startVal - e.clientX + origVal < props.range[1])
                        props.setValue(startVal - e.clientX + origVal);
                }
            }
        }
        function onEnd() {
            setStartVal(0);
        }
        document.addEventListener('mousemove', onUpdate);
        document.addEventListener('mouseup', onEnd);
        return () => {
            document.removeEventListener('mousemove', onUpdate);
            document.removeEventListener('mouseup', onEnd);
        };
    }, [origVal, props.setValue, startVal]);
    return ((0, jsx_runtime_1.jsx)("button", { className: 'click-drag', style: props.style, onMouseDown: onStart, children: props.text }));
}
exports.default = DragLabel;
