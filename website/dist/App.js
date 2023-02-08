"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./App.css");
const fa_1 = require("react-icons/fa");
const Piano_1 = require("./Piano/src/Piano");
function App() {
    const [dimensions, setDimensions] = (0, react_1.useState)();
    const [navRect, setNavRect] = (0, react_1.useState)();
    const navCb = (0, react_1.useCallback)((node) => {
        if (node !== null) {
            setNavRect(node.getBoundingClientRect());
        }
    }, [dimensions]);
    const [headerRect, setHeaderRect] = (0, react_1.useState)();
    const headerCb = (0, react_1.useCallback)((node) => {
        if (node !== null) {
            setHeaderRect(node.getBoundingClientRect());
        }
    }, [dimensions]);
    const looking = true;
    (0, react_1.useEffect)(() => {
        function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            });
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(navRect && headerRect) ? (0, jsx_runtime_1.jsx)("style", { children: `
          .navbar {
            top: ${headerRect.height - navRect.height / 2}px
          }
        ` }) : null, (0, jsx_runtime_1.jsxs)("div", { className: "App", children: [(0, jsx_runtime_1.jsxs)("header", { ref: headerCb, className: "App-header", children: [(0, jsx_runtime_1.jsx)("div", { className: 'left-header' }), (0, jsx_runtime_1.jsxs)("div", { className: 'right-header', children: [(0, jsx_runtime_1.jsx)("div", { className: 'recruitment', children: (0, jsx_runtime_1.jsxs)("div", { className: 'recruit-container', children: [(0, jsx_runtime_1.jsx)("span", { className: 'recruitment-status', children: (0, jsx_runtime_1.jsx)("strong", { children: "Recruitment Status:" }) }), (0, jsx_runtime_1.jsx)(fa_1.FaCircle, { className: 'recruitment-light' }), (0, jsx_runtime_1.jsx)("span", { className: 'header-text', children: (looking) ? 'Looking for work' : 'Not looking for work' })] }) }), (0, jsx_runtime_1.jsx)("div", { id: 'piano', children: (0, jsx_runtime_1.jsx)(Piano_1.default, {}) })] })] }), (0, jsx_runtime_1.jsxs)("nav", { ref: navCb, className: 'navbar', children: [(0, jsx_runtime_1.jsx)("a", { className: 'nav-item', href: '#about-me', children: "About Me" }), (0, jsx_runtime_1.jsx)("a", { className: 'nav-item', href: '#projects', children: "Projects" }), (0, jsx_runtime_1.jsx)("a", { className: 'nav-item', href: '#contact', children: "Contact" })] }), (0, jsx_runtime_1.jsx)("section", { id: 'about-me', children: (0, jsx_runtime_1.jsx)("div", { className: 'about-me-containter' }) })] })] }));
}
exports.default = App;
