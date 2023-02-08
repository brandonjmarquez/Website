"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const fa_1 = require("react-icons/fa");
const DragLabel_1 = require("../Tools/DragLabel");
function UISettings(props) {
    const xGridSliderRef = (0, react_1.useRef)(null);
    // useEffect(() => {
    //   if(xGridSliderRef.current) props.setXGridSize(parseInt(xGridSliderRef.current.value));
    // }, [xGridSliderRef.current]);
    // if(xGridSliderRef.current) {
    //   xGridSliderRef.current.oninput = () => {
    //     console.log(xGridSliderRef.current!.value)
    //     props.setXGridSize(parseInt(xGridSliderRef.current!.value));
    //   }
    // }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(DragLabel_1.default, { plane: 'x', range: [-30, 279], style: { cursor: 'ew-resize', userSelect: 'none' }, text: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaArrowsAltH, { style: { verticalAlign: 'middle' } }), " width"] }), value: props.gridSize[0], setValue: (size) => { props.setXGridSize(size); } }), (0, jsx_runtime_1.jsx)(DragLabel_1.default, { plane: 'y', range: [0, 200], style: { cursor: 'ns-resize', userSelect: 'none' }, text: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaArrowsAltV, { style: { verticalAlign: 'middle' } }), "height"] }), value: props.gridSize[1], setValue: (size) => { props.setYGridSize(size); } })] }));
}
exports.default = UISettings;
