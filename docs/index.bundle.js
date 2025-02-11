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

/***/ "./src/components/headerPanel.ts":
/*!***************************************!*\
  !*** ./src/components/headerPanel.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.HeaderPanel = void 0;\nconst component_1 = __webpack_require__(/*! ./component */ \"./src/components/component.ts\");\nconst knobWithInput_1 = __webpack_require__(/*! ./knobWithInput */ \"./src/components/knobWithInput.ts\");\nconst knobSize = 60;\nclass HeaderPanel extends component_1.Component {\n    constructor() {\n        super();\n        this.masterVolumeKnob = new knobWithInput_1.KnobWithInput(knobSize, \"M.Volume\", 0, 0.5, 0.2, 0.2, undefined, 3, () => { });\n        this.polyphonyKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Polyphony\", 1, 99, 10, 10, undefined, 0, () => { });\n        this.element = $(`<div class=\"header-panel\">`).append($(`<div class=\"title\">`).text(\"TinyFM1\"), $(`<div class=\"align-right\">`), this.polyphonyKnob.element.css(\"margin-right\", 8), this.masterVolumeKnob.element, $(`<div class=\"sp\">`), $(`<div class=\"copyright\">`).text(\"(C) 2025 Takabo Soft\"));\n    }\n}\nexports.HeaderPanel = HeaderPanel;\n\n\n//# sourceURL=webpack://websynthtest01/./src/components/headerPanel.ts?");

/***/ }),

/***/ "./src/components/knob.ts":
/*!********************************!*\
  !*** ./src/components/knob.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Knob = void 0;\nconst vec2_1 = __webpack_require__(/*! ../geometries/vec2 */ \"./src/geometries/vec2.ts\");\nconst component_1 = __webpack_require__(/*! ./component */ \"./src/components/component.ts\");\n/** つまみ */\nclass Knob extends component_1.Component {\n    constructor(size = 70, min, max, _value, resetValue, centerValue, onInput) {\n        super();\n        this.size = size;\n        this.min = min;\n        this.max = max;\n        this._value = _value;\n        this.resetValue = resetValue;\n        this.centerValue = centerValue;\n        this.onInput = onInput;\n        this.bottomSpaceDeg = 45;\n        this.lineLen = 10;\n        this.strokeWidth = 4;\n        this.beginDeg = 270 - this.bottomSpaceDeg;\n        this.endDeg = this.beginDeg - 360 + this.bottomSpaceDeg * 2;\n        this.svg = $(`<svg width=\"${this.size}\" height=\"${this.size}\">`);\n        this.appendPath(\"rgba(0, 0, 0, 0.08)\", this.strokeWidth, this.buildPathArcD(this.min, this.max));\n        this.arcPath = this.appendPath(\"#4088D9\", this.strokeWidth, \"\");\n        this.appendValueLine(this.min);\n        this.appendValueLine(this.max);\n        if (centerValue != null) {\n            this.appendValueLine(centerValue);\n        }\n        this.element = $(`<div class=\"knob\" tabindex=\"-1\">`).append(this.svg, $(`<div>`).append(`<div>`));\n        this.updateKnobAngle();\n        this.listenPointerEvents();\n    }\n    get value() { return this._value; }\n    set value(v) {\n        v = this.clampValue(v);\n        if (this._value != v) {\n            this._value = v;\n            this.updateKnobAngle();\n        }\n    }\n    /** つまみ本体の回転反映および円弧の更新をします。 */\n    updateKnobAngle() {\n        this.element.css({\n            \"--angle\": `${-this.valueToDeg(this._value) + 90}deg`,\n        });\n        if (this.centerValue != null) {\n            if (this._value < this.centerValue) {\n                this.arcPath.attr(\"d\", this.buildPathArcD(this._value, this.centerValue));\n            }\n            else {\n                this.arcPath.attr(\"d\", this.buildPathArcD(this.centerValue, this._value));\n            }\n        }\n        else {\n            this.arcPath.attr(\"d\", this.buildPathArcD(this.min, this._value));\n        }\n    }\n    clampValue(val) {\n        return Math.max(Math.min(val, this.max), this.min);\n    }\n    /** 時計回り */\n    buildPathArcD(startVal, endVal) {\n        const radius = this.size / 2 - this.lineLen / 2;\n        const pt1 = this.calcValuePos(startVal, radius);\n        const pt2 = this.calcValuePos(endVal, radius);\n        const isLarge = (this.valueToDeg(startVal) - this.valueToDeg(endVal)) > 180;\n        return `M${pt1.x} ${pt1.y} A${radius} ${radius} 0 ${isLarge ? 1 : 0} 1 ${pt2.x} ${pt2.y}`;\n    }\n    appendPath(stroke, strokeWidth, d) {\n        const path = $(document.createElementNS(\"http://www.w3.org/2000/svg\", \"path\")).attr({\n            stroke,\n            \"stroke-width\": strokeWidth,\n            fill: \"none\",\n            d,\n        });\n        this.svg.append(path);\n        return path;\n    }\n    appendValueLine(val) {\n        const pt1 = this.calcValuePos(val, this.size / 2);\n        const pt2 = this.calcValuePos(val, this.size / 2 - this.lineLen);\n        this.appendPath(\"black\", 1, `M${pt1.x} ${pt1.y} L${pt2.x} ${pt2.y}`);\n    }\n    calcValuePos(val, radius) {\n        const deg = this.valueToDeg(val);\n        const rad = deg * Math.PI / 180;\n        return new vec2_1.Vec2(this.size / 2 + Math.cos(rad) * radius, this.size / 2 - Math.sin(rad) * radius);\n    }\n    valueToDeg(val) {\n        const a = (this.clampValue(val) - this.min) / (this.max - this.min);\n        return this.beginDeg * (1 - a) + this.endDeg * a;\n    }\n    listenPointerEvents() {\n        const el = this.element[0];\n        let dragPointerId = undefined;\n        let oldValue = 0;\n        let dragStartY = 0;\n        let lastPointerDownTimeStamp = undefined;\n        const changeValue = (v) => {\n            const newValue = this.clampValue(v);\n            if (this._value != newValue) {\n                this._value = newValue;\n                this.updateKnobAngle();\n                this.onInput(newValue);\n            }\n        };\n        // 虫眼鏡が出たりするのを回避します。\n        el.addEventListener(\"touchstart\", e => e.preventDefault());\n        el.addEventListener(\"pointerdown\", e => {\n            e.preventDefault();\n            this.element.trigger(\"focus\");\n            if (dragPointerId != null) {\n                return;\n            }\n            if (e.pointerType == \"button\" && e.button != 0) {\n                return;\n            }\n            // ダブルクリック検出\n            if (lastPointerDownTimeStamp != null && e.timeStamp - lastPointerDownTimeStamp < 200) {\n                changeValue(this.resetValue);\n                return;\n            }\n            el.setPointerCapture(e.pointerId);\n            dragPointerId = e.pointerId;\n            oldValue = this._value;\n            dragStartY = e.clientY;\n            lastPointerDownTimeStamp = e.timeStamp;\n        });\n        el.addEventListener(\"pointermove\", e => {\n            e.preventDefault();\n            if (el.hasPointerCapture(e.pointerId) && e.pointerId == dragPointerId) {\n                changeValue(oldValue + (dragStartY - e.clientY) * (this.max - this.min) / 180);\n            }\n        });\n        const cancel = (e) => {\n            e.preventDefault();\n            if (e.pointerId == dragPointerId) {\n                dragPointerId = undefined;\n            }\n        };\n        el.addEventListener(\"lostpointercapture\", cancel);\n        el.addEventListener(\"pointercancel\", cancel);\n    }\n}\nexports.Knob = Knob;\n\n\n//# sourceURL=webpack://websynthtest01/./src/components/knob.ts?");

/***/ }),

/***/ "./src/components/knobWithInput.ts":
/*!*****************************************!*\
  !*** ./src/components/knobWithInput.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.KnobWithInput = void 0;\nconst component_1 = __webpack_require__(/*! ./component */ \"./src/components/component.ts\");\nconst knob_1 = __webpack_require__(/*! ./knob */ \"./src/components/knob.ts\");\n/** タイトル＋つまみ＋編集ボックス */\nclass KnobWithInput extends component_1.Component {\n    constructor(size, label, min, max, value, resetValue, centerValue, fractionDigits, onInput) {\n        super();\n        this.fractionDigits = fractionDigits;\n        this.input = $(`<input type=\"number\" step=\"any\">`);\n        this.knob = new knob_1.Knob(size, min, max, value, resetValue, centerValue, newVal => {\n            this.toInput();\n            onInput(newVal);\n        });\n        this.element = $(`<div class=\"knob-with-input\">`).append($(`<h5>`).text(label), this.knob.element, this.input);\n        this.toInput();\n        this.input.on(\"change\", () => {\n            const oldValue = this.knob.value;\n            this.knob.value = parseFloat(this.input.val() + \"\");\n            if (this.knob.value != oldValue) {\n                onInput(this.knob.value);\n            }\n        }).css({\n            width: size,\n        });\n    }\n    toInput() {\n        this.input.val(this.knob.value.toFixed(this.fractionDigits));\n    }\n}\nexports.KnobWithInput = KnobWithInput;\n\n\n//# sourceURL=webpack://websynthtest01/./src/components/knobWithInput.ts?");

/***/ }),

/***/ "./src/components/oscillatorPanel.ts":
/*!*******************************************!*\
  !*** ./src/components/oscillatorPanel.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.OscillatorPanel = void 0;\nconst const_1 = __webpack_require__(/*! ../synth/const */ \"./src/synth/const.ts\");\nconst component_1 = __webpack_require__(/*! ./component */ \"./src/components/component.ts\");\nconst knobWithInput_1 = __webpack_require__(/*! ./knobWithInput */ \"./src/components/knobWithInput.ts\");\nconst knobSize = 60;\nclass OscillatorPanel extends component_1.Component {\n    constructor(oscIdx) {\n        super();\n        this.oscIdx = oscIdx;\n        this.ratioKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Ratio\", 0, 64, 1, 1, undefined, 3, () => { });\n        this.offsetKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Offset(Hz)\", 0, 9999, 0, 0, undefined, 2, () => { });\n        this.sendKnobs = [];\n        this.volumeKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Volume\", 0, 1, 0, 0, undefined, 3, () => { });\n        this.panKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Pan\", -1, 1, 0, 0, 0, 3, () => { });\n        this.ampEnvAttackKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Attack(s)\", 0, 4, 0, 0, undefined, 3, () => { });\n        this.ampEnvAttackShapeKnob = new knobWithInput_1.KnobWithInput(knobSize, \"A Shape\", -1, 1, 0, 0, 0, 2, () => { });\n        this.ampEnvDecayKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Decay(s)\", 0, 4, 0, 0, undefined, 3, () => { });\n        this.ampEnvDecayShapeKnob = new knobWithInput_1.KnobWithInput(knobSize, \"D Shape\", -1, 1, 0, 0, 0, 2, () => { });\n        this.ampEnvSustainKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Sustain\", 0, 1, 1, 1, undefined, 3, () => { });\n        this.ampEnvReleaseKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Release(s)\", 0.001, 4, 0, 0.001, undefined, 3, () => { });\n        this.ampEnvReleaseShapeKnob = new knobWithInput_1.KnobWithInput(knobSize, \"R Shape\", -1, 1, 0, 0, 0, 2, () => { });\n        for (let i = 0; i < const_1.oscCount; i++) {\n            this.sendKnobs.push(new knobWithInput_1.KnobWithInput(knobSize, `Send ${\"ABCDEF\"[i]}`, 0, 10, 0, 0, 0, 3, () => { }));\n        }\n        this.element = $(`<div class=\"oscillator-panel\">`).append($(`<div class=\"title\">`).text(`OSC ${\"ABCDEF\"[oscIdx]}`), this.ratioKnob.element, this.offsetKnob.element, $(`<div class=\"sp\">`), ...this.sendKnobs.map(k => k.element), $(`<div class=\"sp\">`), this.ampEnvAttackKnob.element, this.ampEnvAttackShapeKnob.element, this.ampEnvDecayKnob.element, this.ampEnvDecayShapeKnob.element, this.ampEnvSustainKnob.element, this.ampEnvReleaseKnob.element, this.ampEnvReleaseShapeKnob.element, $(`<div class=\"sp\">`), this.volumeKnob.element, this.panKnob.element);\n    }\n}\nexports.OscillatorPanel = OscillatorPanel;\n\n\n//# sourceURL=webpack://websynthtest01/./src/components/oscillatorPanel.ts?");

/***/ }),

/***/ "./src/components/synthBody.ts":
/*!*************************************!*\
  !*** ./src/components/synthBody.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SynthBody = void 0;\nconst const_1 = __webpack_require__(/*! ../synth/const */ \"./src/synth/const.ts\");\nconst component_1 = __webpack_require__(/*! ./component */ \"./src/components/component.ts\");\nconst headerPanel_1 = __webpack_require__(/*! ./headerPanel */ \"./src/components/headerPanel.ts\");\nconst oscillatorPanel_1 = __webpack_require__(/*! ./oscillatorPanel */ \"./src/components/oscillatorPanel.ts\");\nclass SynthBody extends component_1.Component {\n    constructor(synthProcessor) {\n        super();\n        this.synthProcessor = synthProcessor;\n        this.element = $(`<div class=\"synth-body\">`).append(new headerPanel_1.HeaderPanel().element);\n        for (let i = 0; i < const_1.oscCount; i++) {\n            this.element.append(new oscillatorPanel_1.OscillatorPanel(i).element);\n        }\n    }\n}\nexports.SynthBody = SynthBody;\n\n\n//# sourceURL=webpack://websynthtest01/./src/components/synthBody.ts?");

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

eval("\n/**\n * Development Build: npx webpack -w\n * Development Server: npx live-server docs\n * Development Server(HTTPS): npx live-server docs --https=https.js\n * Release Build: npx webpack --mode=production\n */\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst synthBody_1 = __webpack_require__(/*! ./components/synthBody */ \"./src/components/synthBody.ts\");\nconst synthProcessorWrapper_1 = __webpack_require__(/*! ./synth/synthProcessorWrapper */ \"./src/synth/synthProcessorWrapper.ts\");\n$(() => {\n    console.log(\"OK\");\n    try {\n        new PageController().start();\n    }\n    catch (e) {\n        alert(e);\n    }\n});\nclass PageController {\n    constructor() {\n        this.audioContext = new AudioContext();\n        this.keyNoteDefaultMap = new Map([\n            // 白鍵（C3 ~ B3）\n            [\"z\", 48 /* MidiNote.C3 */], [\"x\", 50 /* MidiNote.D3 */], [\"c\", 52 /* MidiNote.E3 */],\n            [\"v\", 53 /* MidiNote.F3 */], [\"b\", 55 /* MidiNote.G3 */], [\"n\", 57 /* MidiNote.A3 */],\n            [\"m\", 59 /* MidiNote.B3 */],\n            // 黒鍵（C#3 ~ A#3）\n            [\"s\", 49 /* MidiNote.C_SHARP_3 */], [\"d\", 51 /* MidiNote.D_SHARP_3 */],\n            [\"g\", 54 /* MidiNote.F_SHARP_3 */], [\"h\", 56 /* MidiNote.G_SHARP_3 */],\n            [\"j\", 58 /* MidiNote.A_SHARP_3 */],\n            // 高いオクターブ（C4 ~ E4）\n            [\",\", 60 /* MidiNote.C4 */], [\".\", 62 /* MidiNote.D4 */], [\"/\", 64 /* MidiNote.E4 */],\n            // 黒鍵（C#4 ~ D#4）\n            [\"l\", 61 /* MidiNote.C_SHARP_4 */], [\";\", 63 /* MidiNote.D_SHARP_4 */],\n        ]);\n        /** MIDI ON状態のノートをここで管理します。PCキーボード・マウスなど複数デバイスからありえない入力状態になるのを防ぎます。 */\n        this.midiNoteOnSet = new Set();\n        /** PCキーボード情報 */\n        this.pcKeyNoteStateMap = new Map();\n        /** 仮想キーボード */\n        /*private readonly virtualKeyboard = new VirtualKeyboard({\n            height: 200,\n            //minNote: MidiNote.A_SHARP_MINUS_1,\n            onKeyDown: note => this.noteOn(note),\n            onKeyUp: note => this.noteOff(note),\n        });*/\n        this.octaveShift = 1;\n        /*private noteOn(note: MidiNote): void {\n            if (this.midiNoteOnSet.has(note)) { return; }\n            this.midiNoteOnSet.add(note);\n            this.synthProcessor?.noteOn(note);\n            this.virtualKeyboard.selectKey(note, true);\n        }\n    \n        private noteOff(note: MidiNote): void {\n            if (!this.midiNoteOnSet.has(note)) { return; }\n            this.midiNoteOnSet.delete(note);\n            this.synthProcessor?.noteOff(note);\n            this.virtualKeyboard.selectKey(note, false);\n        }\n    \n        private listenPCKeyboard(): void {\n            document.addEventListener(\"keydown\", e => {\n                if (this.pcKeyNoteStateMap.has(e.key)) { return; } // キーボード連打阻止\n                let note = this.keyNoteDefaultMap.get(e.key);\n                if (note != null) {\n                    note += this.octaveShift * 12;\n                    if (note >= 0 && note <= 127) {\n                        this.noteOn(note);\n                        this.pcKeyNoteStateMap.set(e.key, note); // キーボードを押すときと離すときでNote#が変わる場合があり得るので保持しておく\n                    }\n                }\n            });\n    \n            document.addEventListener(\"keyup\", e => {\n                const note = this.pcKeyNoteStateMap.get(e.key);\n                if (note != null) {\n                    this.noteOff(note);\n                    this.pcKeyNoteStateMap.delete(e.key);\n                }\n            });\n        }*/\n    }\n    start() {\n        return __awaiter(this, void 0, void 0, function* () {\n            document.addEventListener(\"pointerdown\", () => this.audioContext.resume(), true);\n            document.addEventListener(\"keydown\", () => this.audioContext.resume(), true);\n            yield this.audioContext.audioWorklet.addModule(\"synth.bundle.js\");\n            const myProcessorNode = new AudioWorkletNode(this.audioContext, \"SynthProcessor\", { outputChannelCount: [2] });\n            myProcessorNode.connect(this.audioContext.destination);\n            const synthBody = new synthBody_1.SynthBody(new synthProcessorWrapper_1.SynthProcessorWrapper(myProcessorNode));\n            $(\"main\").append(synthBody.element);\n            /*const slider = $(`<input type=\"range\" min=\"-1.0\" max=\"1.0\" step=\"0.01\" style=\"width: 200px;\">`).on(\"input\", () => {\n                //console.log(slider.val() ?? 0);\n                this.synthProcessor?.test(parseFloat(slider.val() + \"\"));\n            })\n            $(\"body\").append($(`<br>`), slider);*/\n            //$(\"body\").append($(`<div class=\"virtual-keyboard-wrapper\">`).append(this.virtualKeyboard.element));\n            //this.virtualKeyboard.visibleKey(MidiNote.C4);\n            //this.listenPCKeyboard();\n        });\n    }\n}\n\n\n//# sourceURL=webpack://websynthtest01/./src/index.ts?");

/***/ }),

/***/ "./src/synth/const.ts":
/*!****************************!*\
  !*** ./src/synth/const.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.oscCount = void 0;\nexports.oscCount = 6;\n\n\n//# sourceURL=webpack://websynthtest01/./src/synth/const.ts?");

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