"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const axios_1 = require("axios");
const react_1 = require("react");
// import  {DraggableNumber} from './libs/draggable-number'
require("./Settings.css");
const react_dom_1 = require("react-dom");
function SaveExport(props) {
    const nameRef = (0, react_1.useRef)(null);
    const formRef = (0, react_1.useRef)(null);
    const [midiNoteString, setMidiNoteString] = (0, react_1.useState)();
    const [trackNames, setTrackNames] = (0, react_1.useState)([]);
    const [modal, setModal] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        async function getSavedTracks() {
            const url = `${process.env.REACT_APP_API}/get-saved-tracks/${props.username}`;
            const options = {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': true,
                },
            };
            var trackNames = [];
            const savedTracks = await axios_1.default.get(url, options)
                .then((res) => {
                trackNames = res.data;
                setTrackNames(trackNames);
                return res.data;
            }).catch((err) => console.error(err));
            return savedTracks;
        }
        if (props.username.length > 0)
            getSavedTracks();
        if (props.username.length === 0) {
            props.setMidiNoteInfo([]);
            setTrackNames([]);
        }
    }, [props.username]);
    (0, react_1.useEffect)(() => {
        if (nameRef.current) {
            nameRef.current.addEventListener('focusin', () => {
                props.setFocus(true);
            });
            nameRef.current.addEventListener('focusout', () => {
                props.setFocus(false);
            });
            return (() => {
                if (nameRef.current) {
                    nameRef.current.removeEventListener('focusin', props.setFocus(true));
                    nameRef.current.removeEventListener('focusout', props.setFocus(false));
                }
            });
        }
    }, []);
    (0, react_1.useEffect)(() => {
        var midiNoteTemp = [];
        if (props.midiNoteInfo.length > 0) {
            // props.midiNoteInfo.map((midiNote) => {
            //   midiNoteTemp.push(JSON.stringify(midiNote))
            // })
            // console.log(props.midiNoteInfo)
        }
    }, [props.midiNoteInfo]);
    async function changeSelected(selectedTrack) {
        if (!trackNames.includes(selectedTrack))
            return;
        const url = `${process.env.REACT_APP_API}/get-track/${props.username}/${selectedTrack}`;
        const options = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Origin-Allow': true
            },
        };
        var midiNoteInfo = [];
        const track = axios_1.default.get(url, options)
            .then((res) => {
            // console.log(res.data);
            Object.entries(res.data).forEach((midiNote) => {
                midiNoteInfo.push(midiNote[1]);
            });
            props.setMidiNoteInfo(midiNoteInfo);
        });
    }
    function overwrite(trackname, callback) {
        if (trackNames.includes(trackname) && props.selectorsRef.current) {
            var picked = 'none';
            pickOverwrite();
            function pickOverwrite() {
                if (picked === 'none' && props.selectorsRef.current) {
                    setModal((0, react_dom_1.createPortal)((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { id: 'popup-bg' }), (0, jsx_runtime_1.jsxs)("div", { id: 'popup-select', className: 'popup select', style: {
                                    marginTop: `${props.selectorsRef.current.offsetHeight / 3}px`,
                                    left: `${props.selectorsRef.current.offsetWidth / 2}px`,
                                    zIndex: 6
                                }, children: [(0, jsx_runtime_1.jsxs)("button", { type: 'button', className: 'popup-button settings button', onClick: () => {
                                            picked = 'overwrite';
                                            document.getElementById('popup-bg').classList.toggle('lift-out');
                                            document.getElementById('popup-select').classList.toggle('lift-out');
                                            setTimeout(() => setModal(null), 500);
                                        }, children: ["Overwrite ", trackname, "?"] }), (0, jsx_runtime_1.jsxs)("button", { type: 'button', className: 'popup-button settings button', onClick: () => {
                                            picked = 'dont';
                                            document.getElementById('popup-bg').classList.toggle('lift-out');
                                            document.getElementById('popup-select').classList.toggle('lift-out');
                                            setTimeout(() => setModal(null), 500);
                                        }, children: ["Don't Overwrite ", trackname] })] })] }), props.selectorsRef.current));
                    // console.log('hhhhh');
                    setTimeout(pickOverwrite, 0);
                }
                else {
                    if (picked === 'overwrite') {
                        callback();
                    }
                    else if (picked === 'dont') {
                        return;
                    }
                }
            }
        }
        else {
            callback();
            setTrackNames((trackNames) => [trackname, ...trackNames]);
        }
    }
    async function overwriteCB(trackname) {
        const url = `${process.env.REACT_APP_API}/save-track`;
        const options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Origin-Allow': true,
            },
            username: props.username,
            trackname: trackname,
            midiNoteInfo: JSON.stringify({ ...props.midiNoteInfo }),
        };
        const track = await axios_1.default.post(url, options)
            .then((res) => {
            // alert('savve')
        }).catch((err) => console.error(err));
        console.log(track);
    }
    function deleteTrack(trackname, callback) {
        if (trackNames.includes(trackname) && props.selectorsRef.current) {
            var picked = 'none';
            console.log('hhh');
            pickDelete();
            function pickDelete() {
                console.log(picked === 'none');
                if (picked === 'none' && props.selectorsRef.current) {
                    setModal((0, react_dom_1.createPortal)((0, jsx_runtime_1.jsxs)("div", { id: 'popup', children: [(0, jsx_runtime_1.jsx)("div", { id: 'popup-bg' }), (0, jsx_runtime_1.jsxs)("div", { id: 'popup-select', className: 'popup select', style: {
                                    marginTop: `${props.selectorsRef.current.offsetHeight / 3}px`,
                                    left: `${props.selectorsRef.current.offsetWidth / 2}px`,
                                    zIndex: 6
                                }, children: [(0, jsx_runtime_1.jsx)("button", { type: 'button', className: 'popup-button settings button', onClick: () => {
                                            picked = 'delete';
                                            document.getElementById('popup-bg').classList.toggle('lift-out');
                                            document.getElementById('popup-select').classList.toggle('lift-out');
                                            setTimeout(() => setModal(null), 500);
                                        }, children: "Delete" }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: 'popup-button settings button', onClick: () => {
                                            picked = 'dont';
                                            document.getElementById('popup-bg').classList.toggle('lift-out');
                                            document.getElementById('popup-select').classList.toggle('lift-out');
                                            setTimeout(() => setModal(null), 500);
                                        }, children: "Don't Delete" })] })] }), props.selectorsRef.current));
                    setTimeout(pickDelete, 0);
                }
                else {
                    if (picked === 'delete') {
                        console.log('delete');
                        callback();
                    }
                    else if (picked === 'dont') {
                        console.log('dont delete');
                        return;
                    }
                }
            }
        }
    }
    async function deleteCB() {
        const url = `${process.env.REACT_APP_API}/delete-track`;
        const options = {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Origin-Allow': true
            },
            data: {
                username: props.username,
                trackname: props.trackName
            }
        };
        axios_1.default.delete(url, options)
            .then((res) => console.log(res.data))
            .catch((err) => console.error(err));
    }
    function newTrack() {
        var picked = 'none';
        pickNew();
        function pickNew() {
            if (picked === 'none' && props.selectorsRef.current) {
                setModal((0, react_dom_1.createPortal)((0, jsx_runtime_1.jsxs)("div", { id: 'popup', children: [(0, jsx_runtime_1.jsx)("div", { id: 'popup-bg' }), (0, jsx_runtime_1.jsxs)("div", { id: 'popup-select', className: 'popup select', style: {
                                marginTop: `${props.selectorsRef.current.offsetHeight / 3}px`,
                                left: `${props.selectorsRef.current.offsetWidth / 2}px`,
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
                                    }, children: "Don't Start New Track" })] })] }), props.selectorsRef.current));
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
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [modal, (0, jsx_runtime_1.jsx)("button", { type: 'button', className: 'settings button', onClick: () => {
                    deleteTrack(props.trackName, () => deleteCB());
                }, children: "Delete" }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: 'settings button', onClick: () => {
                    if (props.midiNoteInfoLength > 0)
                        newTrack();
                    else
                        props.setMidiNoteInfo([]);
                }, children: "New" }), (0, jsx_runtime_1.jsxs)("form", { ref: formRef, id: 'save-track-form', className: 'save-export', method: 'post', onSubmit: (e) => {
                    e.preventDefault();
                    const target = e.target;
                    const trackname = target.trackname.value;
                    overwrite(trackname, () => overwriteCB(trackname));
                }, children: [(0, jsx_runtime_1.jsx)("input", { ref: nameRef, type: 'trackname', name: 'trackname', className: 'settings input', list: 'track-names', onChange: (e) => { props.setTrackName(e.target.value); } }), (0, jsx_runtime_1.jsx)("datalist", { id: "track-names", children: trackNames.map((track) => {
                            return (0, jsx_runtime_1.jsx)("option", { children: track }, track);
                        }) }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: 'settings button', onClick: () => changeSelected(props.trackName), children: "Load" }), (0, jsx_runtime_1.jsx)("input", { type: 'submit', className: 'settings button', value: 'Save' }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: 'settings button', onClick: () => props.controlsDispatch({ type: 'export', export: true }), children: "Export" })] })] }));
}
exports.default = SaveExport;
