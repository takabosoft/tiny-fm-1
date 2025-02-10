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

/***/ "./src/components/component.ts":
/*!*************************************!*\
  !*** ./src/components/component.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Component = void 0;\nclass Component {\n    constructor() {\n        this.element = $();\n    }\n}\nexports.Component = Component;\n\n\n//# sourceURL=webpack://websynthtest01/./src/components/component.ts?");

/***/ }),

/***/ "./src/components/virtualKeyboard.ts":
/*!*******************************************!*\
  !*** ./src/components/virtualKeyboard.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.VirtualKeyboard = void 0;\nconst rect_1 = __webpack_require__(/*! ../geometries/rect */ \"./src/geometries/rect.ts\");\nconst vec2_1 = __webpack_require__(/*! ../geometries/vec2 */ \"./src/geometries/vec2.ts\");\nconst component_1 = __webpack_require__(/*! ./component */ \"./src/components/component.ts\");\nfunction isWhiteKey(note) {\n    switch (note % 12) {\n        case 0 /* MidiNote.C_MINUS_1 */:\n        case 2 /* MidiNote.D_MINUS_1 */:\n        case 4 /* MidiNote.E_MINUS_1 */:\n        case 5 /* MidiNote.F_MINUS_1 */:\n        case 7 /* MidiNote.G_MINUS_1 */:\n        case 9 /* MidiNote.A_MINUS_1 */:\n        case 11 /* MidiNote.B_MINUS_1 */:\n            return true;\n    }\n    return false;\n}\nfunction calcWhiteIndex(note) {\n    let idx = 0;\n    for (let n = note % 12; n > 0; n--) {\n        if (isWhiteKey(n)) {\n            idx++;\n        }\n    }\n    return idx;\n}\n/**\n * 取り急ぎキーボードに見えそうなものを生成します。\n * - スクロール的な機能は保有しません。\n * - 押された・離されたイベントを発行します。\n * - 各キーのオン・オフによってビジュアルを変化させます。\n */\nclass VirtualKeyboard extends component_1.Component {\n    constructor(options = {}) {\n        var _a, _b, _c, _d;\n        super();\n        this.keyMap = new Map();\n        this.selectedKeySet = new Set();\n        this.height = (_a = options.height) !== null && _a !== void 0 ? _a : 200;\n        this.minNote = (_b = options.minNote) !== null && _b !== void 0 ? _b : 0;\n        this.maxNote = (_c = options.maxNote) !== null && _c !== void 0 ? _c : 127;\n        this.whiteKeyWidth = (_d = options.whiteKeyWidth) !== null && _d !== void 0 ? _d : 32;\n        this.blackKeyWidth = Math.ceil(this.whiteKeyWidth * 0.8);\n        this.onKeyDown = options.onKeyDown;\n        this.onKeyUp = options.onKeyUp;\n        this.element = $(`<div class=\"virtual-keyboard\">`).css({\n            height: this.height,\n        });\n        this.layout();\n        this.listenPointerEvents();\n    }\n    layout() {\n        this.element.empty();\n        this.keyMap.clear();\n        const firstWhiteKeyNote = isWhiteKey(this.minNote) ? this.minNote : this.minNote + 1;\n        const firstOctave = Math.floor(firstWhiteKeyNote / 12);\n        let x = -calcWhiteIndex(firstWhiteKeyNote) * this.whiteKeyWidth;\n        for (let note = firstOctave * 12; note <= this.maxNote; note++) {\n            const appendKey = (key) => {\n                this.keyMap.set(note, key);\n                this.element.append(key.element);\n                key.isSelected = this.selectedKeySet.has(note);\n            };\n            if (isWhiteKey(note)) {\n                if (note >= this.minNote) {\n                    const text = note % 12 == 0 ? `C${note / 12 - 1}` : \"\";\n                    appendKey(new WhiteKey(new rect_1.Rect(x, 0, this.whiteKeyWidth, this.height), text));\n                }\n                x += this.whiteKeyWidth;\n            }\n            else {\n                if (note >= this.minNote) {\n                    const offset = (() => {\n                        switch (note % 12) {\n                            case 1 /* MidiNote.C_SHARP_MINUS_1 */:\n                            case 6 /* MidiNote.F_SHARP_MINUS_1 */:\n                                return -1;\n                            case 3 /* MidiNote.D_SHARP_MINUS_1 */:\n                            case 10 /* MidiNote.A_SHARP_MINUS_1 */:\n                                return +1;\n                        }\n                        return 0;\n                    })();\n                    appendKey(new BlackKey(new rect_1.Rect(Math.round(x - this.blackKeyWidth / 2 + (offset * this.blackKeyWidth * 0.1)), 0, this.blackKeyWidth, Math.ceil(this.height * 0.6))));\n                }\n            }\n        }\n        this.element.css({\n            width: x,\n        });\n    }\n    /**\n     * キーの当たり判定。\n     * - HACK: 総当たりなので改善の余地有り（本実験ではそこまで追求しない）\n     * @param e\n     * @returns\n     */\n    hitTest(e) {\n        const ptOrg = vec2_1.Vec2.fromPointerEvent(e, this.element);\n        const pt = new vec2_1.Vec2(ptOrg.x, Math.min(Math.max(ptOrg.y, 0), this.height - 1)); // ドラッグ時に上下に突き抜けないようにクランプ\n        let res;\n        for (const [note, key] of this.keyMap.entries()) {\n            if (key.rect.isPointInside(pt)) {\n                if (!isWhiteKey(note)) {\n                    return note;\n                }\n                res = note;\n            }\n        }\n        return res;\n    }\n    /**\n     * ポインターイベントを処理します。\n     * - マウス左ボタン、タッチに対応\n     * - グリッサンドに対応\n     * - 選択状態（押下）はここでは処理しません（イベントを発火するのでそれ経由で処理してもらう）。\n     */\n    listenPointerEvents() {\n        const el = this.element[0];\n        const pointerIdToKey = new Map();\n        // 虫眼鏡が出たりするのを回避します。\n        el.addEventListener(\"touchstart\", e => e.preventDefault());\n        el.addEventListener(\"pointerdown\", e => {\n            var _a;\n            e.preventDefault();\n            //if (el.hasPointerCapture(e.pointerId)) { return; }\n            if (e.pointerType == \"button\" && e.button != 0) {\n                return;\n            }\n            const note = this.hitTest(e);\n            if (note != null) {\n                el.setPointerCapture(e.pointerId);\n                pointerIdToKey.set(e.pointerId, note);\n                (_a = this.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(this, note);\n            }\n        });\n        el.addEventListener(\"pointermove\", e => {\n            var _a, _b;\n            e.preventDefault();\n            if (el.hasPointerCapture(e.pointerId)) {\n                const oldNote = pointerIdToKey.get(e.pointerId);\n                const newNote = this.hitTest(e);\n                if (oldNote != null && newNote != null && oldNote != newNote) {\n                    pointerIdToKey.set(e.pointerId, newNote);\n                    (_a = this.onKeyUp) === null || _a === void 0 ? void 0 : _a.call(this, oldNote);\n                    (_b = this.onKeyDown) === null || _b === void 0 ? void 0 : _b.call(this, newNote);\n                }\n            }\n        });\n        const cancel = (e) => {\n            var _a;\n            e.preventDefault();\n            const note = pointerIdToKey.get(e.pointerId);\n            if (note != null) {\n                pointerIdToKey.delete(e.pointerId);\n                (_a = this.onKeyUp) === null || _a === void 0 ? void 0 : _a.call(this, note);\n            }\n        };\n        el.addEventListener(\"lostpointercapture\", cancel);\n        el.addEventListener(\"pointercancel\", cancel);\n    }\n    /** 指定したキーが見えるようにスクロールします。 */\n    visibleKey(note) {\n        const key = this.keyMap.get(note);\n        if (key == null) {\n            return;\n        }\n        key.element[0].scrollIntoView({ inline: \"center\" });\n    }\n    /** 選択状態を変更します。選択＝押された */\n    selectKey(note, isSelected) {\n        const key = this.keyMap.get(note);\n        if (key == null) {\n            return;\n        }\n        if (isSelected) {\n            this.selectedKeySet.add(note);\n        }\n        else {\n            this.selectedKeySet.delete(note);\n        }\n        key.isSelected = isSelected;\n    }\n}\nexports.VirtualKeyboard = VirtualKeyboard;\nclass Key extends component_1.Component {\n    constructor(rect, addClass) {\n        super();\n        this.rect = rect;\n        this.element = $(`<div>`).addClass(addClass).css(Object.assign(Object.assign({}, rect.toCss()), { \"--w\": `${rect.width}px` }));\n    }\n    set isSelected(sel) {\n        this.element.toggleClass(\"selected\", sel);\n    }\n}\nclass WhiteKey extends Key {\n    constructor(rect, text) {\n        super(rect, \"white-key\");\n        this.element.attr({\n            \"data-text\": text,\n        });\n    }\n}\nclass BlackKey extends Key {\n    constructor(rect) {\n        super(rect, \"black-key\");\n    }\n}\n\n\n//# sourceURL=webpack://websynthtest01/./src/components/virtualKeyboard.ts?");

/***/ }),

/***/ "./src/geometries/rect.ts":
/*!********************************!*\
  !*** ./src/geometries/rect.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Rect = void 0;\nconst vec2_1 = __webpack_require__(/*! ./vec2 */ \"./src/geometries/vec2.ts\");\nclass Rect {\n    constructor(x, y, width, height) {\n        this.x = x;\n        this.y = y;\n        this.width = width;\n        this.height = height;\n    }\n    get left() { return this.x; }\n    get top() { return this.y; }\n    get right() { return this.x + this.width; }\n    get bottom() { return this.y + this.height; }\n    get center() { return new vec2_1.Vec2((this.left + this.right) / 2, (this.top + this.bottom) / 2); }\n    get isEmpty() { return this.width <= 0 || this.height <= 0; }\n    isPointInside(pt) {\n        return pt.x >= this.left && pt.x < this.right && pt.y >= this.top && pt.y < this.bottom;\n    }\n    toCss() {\n        return {\n            left: `${this.left}px`,\n            top: `${this.top}px`,\n            width: `${this.width}px`,\n            height: `${this.height}px`,\n        };\n    }\n}\nexports.Rect = Rect;\n\n\n//# sourceURL=webpack://websynthtest01/./src/geometries/rect.ts?");

/***/ }),

/***/ "./src/geometries/vec2.ts":
/*!********************************!*\
  !*** ./src/geometries/vec2.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Vec2 = void 0;\nclass Vec2 {\n    constructor(x, y) {\n        this.x = x;\n        this.y = y;\n    }\n    static fromPointerEvent(e, baseElement) {\n        const baseOffset = baseElement.offset();\n        return new Vec2(e.pageX - baseOffset.left, e.pageY - baseOffset.top);\n    }\n}\nexports.Vec2 = Vec2;\n\n\n//# sourceURL=webpack://websynthtest01/./src/geometries/vec2.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\n/**\n * Development Build: npx webpack -w\n * Development Server: npx live-server docs\n * Development Server(HTTPS): npx live-server docs --https=https.js\n * Release Build: npx webpack --mode=production\n */\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst virtualKeyboard_1 = __webpack_require__(/*! ./components/virtualKeyboard */ \"./src/components/virtualKeyboard.ts\");\nconst synthProcessorWrapper_1 = __webpack_require__(/*! ./synth/synthProcessorWrapper */ \"./src/synth/synthProcessorWrapper.ts\");\n$(() => {\n    console.log(\"OK\");\n    new PageController().start();\n});\nclass PageController {\n    constructor() {\n        this.audioContext = new AudioContext();\n        this.keyNoteDefaultMap = new Map([\n            // 白鍵（C3 ~ B3）\n            [\"z\", 48 /* MidiNote.C3 */], [\"x\", 50 /* MidiNote.D3 */], [\"c\", 52 /* MidiNote.E3 */],\n            [\"v\", 53 /* MidiNote.F3 */], [\"b\", 55 /* MidiNote.G3 */], [\"n\", 57 /* MidiNote.A3 */],\n            [\"m\", 59 /* MidiNote.B3 */],\n            // 黒鍵（C#3 ~ A#3）\n            [\"s\", 49 /* MidiNote.C_SHARP_3 */], [\"d\", 51 /* MidiNote.D_SHARP_3 */],\n            [\"g\", 54 /* MidiNote.F_SHARP_3 */], [\"h\", 56 /* MidiNote.G_SHARP_3 */],\n            [\"j\", 58 /* MidiNote.A_SHARP_3 */],\n            // 高いオクターブ（C4 ~ E4）\n            [\",\", 60 /* MidiNote.C4 */], [\".\", 62 /* MidiNote.D4 */], [\"/\", 64 /* MidiNote.E4 */],\n            // 黒鍵（C#4 ~ D#4）\n            [\"l\", 61 /* MidiNote.C_SHARP_4 */], [\";\", 63 /* MidiNote.D_SHARP_4 */],\n        ]);\n        /** MIDI ON状態のノートをここで管理します。PCキーボード・マウスなど複数デバイスからありえない入力状態になるのを防ぎます。 */\n        this.midiNoteOnSet = new Set();\n        /** PCキーボード情報 */\n        this.pcKeyNoteStateMap = new Map();\n        /** 仮想キーボード */\n        this.virtualKeyboard = new virtualKeyboard_1.VirtualKeyboard({\n            height: 200,\n            //minNote: MidiNote.A_SHARP_MINUS_1,\n            onKeyDown: note => this.noteOn(note),\n            onKeyUp: note => this.noteOff(note),\n        });\n        this.octaveShift = 1;\n    }\n    start() {\n        return __awaiter(this, void 0, void 0, function* () {\n            document.addEventListener(\"pointerdown\", () => this.audioContext.resume(), true);\n            document.addEventListener(\"keydown\", () => this.audioContext.resume(), true);\n            yield this.audioContext.audioWorklet.addModule(\"synth.bundle.js\");\n            const myProcessorNode = new AudioWorkletNode(this.audioContext, \"SynthProcessor\", { outputChannelCount: [2] });\n            myProcessorNode.connect(this.audioContext.destination);\n            this.synthProcessor = new synthProcessorWrapper_1.SynthProcessorWrapper(myProcessorNode);\n            /*const slider = $(`<input type=\"range\" min=\"-1.0\" max=\"1.0\" step=\"0.01\" style=\"width: 200px;\">`).on(\"input\", () => {\n                //console.log(slider.val() ?? 0);\n                this.synthProcessor?.test(parseFloat(slider.val() + \"\"));\n            })\n            $(\"body\").append($(`<br>`), slider);*/\n            $(\"body\").append($(`<div class=\"virtual-keyboard-wrapper\">`).append(this.virtualKeyboard.element));\n            this.virtualKeyboard.visibleKey(60 /* MidiNote.C4 */);\n            this.listenPCKeyboard();\n        });\n    }\n    noteOn(note) {\n        var _a;\n        if (this.midiNoteOnSet.has(note)) {\n            return;\n        }\n        this.midiNoteOnSet.add(note);\n        (_a = this.synthProcessor) === null || _a === void 0 ? void 0 : _a.noteOn(note);\n        this.virtualKeyboard.selectKey(note, true);\n    }\n    noteOff(note) {\n        var _a;\n        if (!this.midiNoteOnSet.has(note)) {\n            return;\n        }\n        this.midiNoteOnSet.delete(note);\n        (_a = this.synthProcessor) === null || _a === void 0 ? void 0 : _a.noteOff(note);\n        this.virtualKeyboard.selectKey(note, false);\n    }\n    listenPCKeyboard() {\n        document.addEventListener(\"keydown\", e => {\n            if (this.pcKeyNoteStateMap.has(e.key)) {\n                return;\n            } // キーボード連打阻止\n            let note = this.keyNoteDefaultMap.get(e.key);\n            if (note != null) {\n                note += this.octaveShift * 12;\n                if (note >= 0 && note <= 127) {\n                    this.noteOn(note);\n                    this.pcKeyNoteStateMap.set(e.key, note); // キーボードを押すときと離すときでNote#が変わる場合があり得るので保持しておく\n                }\n            }\n        });\n        document.addEventListener(\"keyup\", e => {\n            const note = this.pcKeyNoteStateMap.get(e.key);\n            if (note != null) {\n                this.noteOff(note);\n                this.pcKeyNoteStateMap.delete(e.key);\n            }\n        });\n    }\n}\n\n\n//# sourceURL=webpack://websynthtest01/./src/index.ts?");

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