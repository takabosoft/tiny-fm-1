/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\n/**\n * Development Build: npx webpack -w\n * Development Server: npx live-server docs\n * Release Build: npx webpack --mode=production\n */\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst synthProcessorWrapper_1 = __webpack_require__(/*! ./synth/synthProcessorWrapper */ \"./src/synth/synthProcessorWrapper.ts\");\n$(() => {\n    console.log(\"OK\");\n    new PageController().start();\n});\nclass PageController {\n    constructor() {\n        this.audioContext = new AudioContext();\n        this.keyNoteDefaultMap = new Map([\n            // 白鍵（C3 ~ B3）\n            [\"z\", 48 /* MidiNote.C3 */], [\"x\", 50 /* MidiNote.D3 */], [\"c\", 52 /* MidiNote.E3 */],\n            [\"v\", 53 /* MidiNote.F3 */], [\"b\", 55 /* MidiNote.G3 */], [\"n\", 57 /* MidiNote.A3 */],\n            [\"m\", 59 /* MidiNote.B3 */],\n            // 黒鍵（C#3 ~ A#3）\n            [\"s\", 49 /* MidiNote.C_SHARP_3 */], [\"d\", 51 /* MidiNote.D_SHARP_3 */],\n            [\"g\", 54 /* MidiNote.F_SHARP_3 */], [\"h\", 56 /* MidiNote.G_SHARP_3 */],\n            [\"j\", 58 /* MidiNote.A_SHARP_3 */],\n            // 高いオクターブ（C4 ~ E4）\n            [\",\", 60 /* MidiNote.C4 */], [\".\", 62 /* MidiNote.D4 */], [\"/\", 64 /* MidiNote.E4 */],\n            // 黒鍵（C#4 ~ D#4）\n            [\"l\", 61 /* MidiNote.C_SHARP_4 */], [\";\", 63 /* MidiNote.D_SHARP_4 */],\n        ]);\n        this.keyNoteStateMap = new Map();\n        this.octaveShift = 1;\n    }\n    start() {\n        return __awaiter(this, void 0, void 0, function* () {\n            document.addEventListener(\"click\", () => this.audioContext.resume(), true);\n            yield this.audioContext.audioWorklet.addModule(\"synth.bundle.js\");\n            const myProcessorNode = new AudioWorkletNode(this.audioContext, \"SynthProcessor\");\n            myProcessorNode.connect(this.audioContext.destination);\n            this.synthProcessor = new synthProcessorWrapper_1.SynthProcessorWrapper(myProcessorNode);\n            //this.processor.noteOn(MidiNote.A4);\n            const slider = $(`<input type=\"range\" min=\"0.0\" max=\"20\" step=\"0.01\">`).on(\"input\", () => {\n                var _a, _b;\n                console.log((_a = slider.val()) !== null && _a !== void 0 ? _a : 0);\n                (_b = this.synthProcessor) === null || _b === void 0 ? void 0 : _b.test(slider.val());\n            });\n            $(\"body\").append($(`<br>`), slider);\n            document.addEventListener(\"keydown\", e => {\n                var _a;\n                if (this.keyNoteStateMap.has(e.key)) {\n                    return;\n                } // キーボード連打阻止\n                let note = this.keyNoteDefaultMap.get(e.key);\n                if (note != null) {\n                    note += this.octaveShift * 12;\n                    if (note >= 0 && note <= 127) {\n                        (_a = this.synthProcessor) === null || _a === void 0 ? void 0 : _a.noteOn(note);\n                        this.keyNoteStateMap.set(e.key, note); // キーボードを押すときと離すときでNote#が変わる場合があり得るので保持しておく\n                    }\n                }\n            });\n            document.addEventListener(\"keyup\", e => {\n                var _a;\n                const note = this.keyNoteStateMap.get(e.key);\n                if (note != null) {\n                    (_a = this.synthProcessor) === null || _a === void 0 ? void 0 : _a.noteOff(note);\n                    this.keyNoteStateMap.delete(e.key);\n                }\n            });\n        });\n    }\n}\n\n\n//# sourceURL=webpack://websynthtest01/./src/index.ts?");

/***/ }),

/***/ "./src/synth/synthProcessorWrapper.ts":
/*!********************************************!*\
  !*** ./src/synth/synthProcessorWrapper.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SynthProcessorWrapper = void 0;\n/** `SynthProcessor`へメッセージを送る係 */\nclass SynthProcessorWrapper {\n    constructor(node) {\n        this.node = node;\n    }\n    send(msg) {\n        this.node.port.postMessage(msg);\n    }\n    noteOn(note) {\n        this.send({ type: \"NoteOn\", note });\n    }\n    noteOff(note) {\n        this.send({ type: \"NoteOff\", note });\n    }\n    test(val) {\n        this.send({ type: \"Test\", val });\n    }\n}\nexports.SynthProcessorWrapper = SynthProcessorWrapper;\n\n\n//# sourceURL=webpack://websynthtest01/./src/synth/synthProcessorWrapper.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;