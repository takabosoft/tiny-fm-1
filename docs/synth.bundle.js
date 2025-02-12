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

/***/ "./src/presets/init.ts":
/*!*****************************!*\
  !*** ./src/presets/init.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.initPreset = exports.initOperatorsParams = void 0;\nconst envelope_1 = __webpack_require__(/*! ../synth/envelope */ \"./src/synth/envelope.ts\");\nconst operatorParams = {\n    frequencyRatio: 1,\n    frequencyOffsetHz: 0,\n    sendDepths: [0, 0, 0, 0, 0, 0],\n    ampEnvelope: envelope_1.initEnvelopeParams,\n    volume: 0,\n    pan: 0,\n};\nexports.initOperatorsParams = [\n    Object.assign(Object.assign({}, operatorParams), { volume: 1.0 }),\n    operatorParams,\n    operatorParams,\n    operatorParams,\n    operatorParams,\n    operatorParams,\n];\nexports.initPreset = {\n    name: \"Init\",\n    synthPatch: {\n        operatorsParams: exports.initOperatorsParams,\n    }\n};\n\n\n//# sourceURL=webpack://websynthtest01/./src/presets/init.ts?");

/***/ }),

/***/ "./src/synth.ts":
/*!**********************!*\
  !*** ./src/synth.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst synthProcessor_1 = __webpack_require__(/*! ./synth/synthProcessor */ \"./src/synth/synthProcessor.ts\");\nregisterProcessor(\"SynthProcessor\", synthProcessor_1.SynthProcessor);\n\n\n//# sourceURL=webpack://websynthtest01/./src/synth.ts?");

/***/ }),

/***/ "./src/synth/envelope.ts":
/*!*******************************!*\
  !*** ./src/synth/envelope.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.initEnvelopeParams = exports.shapeMax = exports.shapeMin = exports.releaseSecMin = void 0;\nexports.interpolate = interpolate;\nexports.calcEnvelope = calcEnvelope;\nexports.releaseSecMin = 0.001;\nexports.shapeMin = -10;\nexports.shapeMax = +10;\nexports.initEnvelopeParams = {\n    attackSec: 0,\n    attackShape: 0,\n    decaySec: 0,\n    decayShape: 0,\n    sustain: 1,\n    releaseSec: exports.releaseSecMin,\n    releaseShape: 0,\n};\nfunction interpolateCore(t, shape) {\n    if (shape === 0) {\n        return t;\n    }\n    if (shape > 0) {\n        return Math.pow(t, 1 + shape);\n    }\n    else {\n        return 1 - Math.pow(1 - t, 1 - shape);\n    }\n}\nfunction interpolate(t1Sec, v1, t2Sec, v2, shape, curSec) {\n    if (curSec < t1Sec || curSec > t2Sec) {\n        return undefined;\n    }\n    const deltaT = (curSec - t1Sec) / (t2Sec - t1Sec);\n    const alpha = interpolateCore(deltaT, shape);\n    return v1 * (1 - alpha) + v2 * alpha;\n}\nfunction calcEnvelope(params, curSec, noteOffSec) {\n    var _a;\n    if (noteOffSec != null && curSec >= noteOffSec) {\n        const t1Sec = noteOffSec;\n        const v1 = (_a = calcEnvelope(params, noteOffSec, undefined)) !== null && _a !== void 0 ? _a : 0;\n        const t2Sec = t1Sec + params.releaseSec;\n        const v2 = 0;\n        return interpolate(t1Sec, v1, t2Sec, v2, params.releaseShape, curSec);\n    }\n    if (curSec < params.attackSec) {\n        // アタック\n        const t1Sec = 0;\n        const v1 = 0;\n        const t2Sec = params.attackSec;\n        const v2 = 1;\n        return interpolate(t1Sec, v1, t2Sec, v2, params.attackShape, curSec);\n    }\n    else if (curSec < params.attackSec + params.decaySec) {\n        // ディケイ\n        const t1Sec = params.attackSec;\n        const v1 = 1;\n        const t2Sec = params.attackSec + params.decaySec;\n        const v2 = params.sustain;\n        return interpolate(t1Sec, v1, t2Sec, v2, params.decayShape, curSec);\n    }\n    else {\n        return params.sustain;\n    }\n}\n\n\n//# sourceURL=webpack://websynthtest01/./src/synth/envelope.ts?");

/***/ }),

/***/ "./src/synth/operatorParams.ts":
/*!*************************************!*\
  !*** ./src/synth/operatorParams.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.convertOperatorParamsToEx = convertOperatorParamsToEx;\nfunction convertOperatorParamsToEx(params) {\n    return Object.assign(Object.assign({}, params), { sleep: params.sendDepths.every(d => d == 0) && params.volume == 0 });\n}\n\n\n//# sourceURL=webpack://websynthtest01/./src/synth/operatorParams.ts?");

/***/ }),

/***/ "./src/synth/synthNote.ts":
/*!********************************!*\
  !*** ./src/synth/synthNote.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SynthNote = void 0;\nconst envelope_1 = __webpack_require__(/*! ./envelope */ \"./src/synth/envelope.ts\");\nconst PI2 = 2 * Math.PI;\nconst fadeOutSec = envelope_1.releaseSecMin;\nfunction midiNoteToFrequency(note) {\n    return 440 * Math.pow(2, (note - 69 /* MidiNote.A4 */) / 12);\n}\n/**\n * 線形パンニングです。\n * @param input モノラル入力\n * @param pan パン(-1.0～1.0)\n * @param output 出力\n */\nfunction panning(input, pan, output) {\n    output[0] += input * (1 - pan) / 2;\n    output[1] += input * (1 + pan) / 2;\n}\n/** 波形生成 */\nclass WaveformGenerator {\n    constructor() {\n        /** 位相0.0～1.0 */\n        this.phase = 0;\n    }\n    /**\n     * 現在の波形の値を算出します。現状はサイン波のみです。\n     * @param fm 変調\n     * @returns\n     */\n    getValue(fm = 0) {\n        return Math.sin(this.phase * PI2 + fm);\n    }\n    addPhase(frequency) {\n        this.phase += frequency / sampleRate;\n        this.phase %= 1;\n    }\n}\n/** FMオペレーター */\nclass Operator {\n    constructor(params) {\n        this.params = params;\n        this.oldOpValue = 0;\n        this.newOpValue = 0;\n        this.waveformGen = new WaveformGenerator();\n    }\n}\n/** キーボードの1音に対応する音を管理するものです。 */\nclass SynthNote {\n    constructor(note, patch) {\n        this.note = note;\n        this.mod = new WaveformGenerator();\n        this._sampleIndex = 0;\n        this.operators = patch.operatorsParams.map(params => new Operator(params));\n    }\n    get sampleIndex() { return this._sampleIndex; }\n    get curSec() { return this._sampleIndex / sampleRate; }\n    generateSample(output) {\n        this.mod.addPhase(5);\n        const freq = midiNoteToFrequency(this.note /*+ this.mod.getValue() * 0.1*/);\n        const curSec = this.curSec;\n        let isContinue = false;\n        for (let opIdx = 0; opIdx < this.operators.length; opIdx++) {\n            const op = this.operators[opIdx];\n            const params = op.params;\n            if (params.sleep) {\n                continue;\n            }\n            // モジューレーターは一つ前の値（oldOpValue）を使うと仕組みが簡単になる\n            const mod = this.operators.reduce((prev, op2) => prev + op2.params.sendDepths[opIdx] * op2.oldOpValue, 0);\n            op.newOpValue = op.waveformGen.getValue(mod);\n            if (params.volume > 0) {\n                const amp = (0, envelope_1.calcEnvelope)(params.ampEnvelope, curSec, this.noteOffSec);\n                if (amp != null) {\n                    // ノートが重なる場合の短いフェードアウト処理\n                    if (this.fadeOutStartSec != null) {\n                        const fadeAmp = (0, envelope_1.interpolate)(this.fadeOutStartSec, 1, this.fadeOutStartSec + fadeOutSec, 0, 0, curSec);\n                        if (fadeAmp != null) {\n                            isContinue = true;\n                            panning(op.newOpValue * amp * fadeAmp * params.volume, params.pan, output);\n                        }\n                    }\n                    else {\n                        isContinue = true;\n                        panning(op.newOpValue * amp * params.volume, params.pan, output);\n                    }\n                }\n            }\n            op.waveformGen.addPhase(freq * params.frequencyRatio + params.frequencyOffsetHz);\n        }\n        // 計算結果をoldへ格納する\n        for (const op of this.operators) {\n            op.oldOpValue = op.newOpValue;\n        }\n        this._sampleIndex++;\n        return isContinue;\n    }\n}\nexports.SynthNote = SynthNote;\n\n\n//# sourceURL=webpack://websynthtest01/./src/synth/synthNote.ts?");

/***/ }),

/***/ "./src/synth/synthPatch.ts":
/*!*********************************!*\
  !*** ./src/synth/synthPatch.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.convertSynthPatchToEx = convertSynthPatchToEx;\nconst operatorParams_1 = __webpack_require__(/*! ./operatorParams */ \"./src/synth/operatorParams.ts\");\nfunction convertSynthPatchToEx(patch) {\n    return {\n        operatorsParams: [\n            (0, operatorParams_1.convertOperatorParamsToEx)(patch.operatorsParams[0]),\n            (0, operatorParams_1.convertOperatorParamsToEx)(patch.operatorsParams[1]),\n            (0, operatorParams_1.convertOperatorParamsToEx)(patch.operatorsParams[2]),\n            (0, operatorParams_1.convertOperatorParamsToEx)(patch.operatorsParams[3]),\n            (0, operatorParams_1.convertOperatorParamsToEx)(patch.operatorsParams[4]),\n            (0, operatorParams_1.convertOperatorParamsToEx)(patch.operatorsParams[5]),\n        ]\n    };\n}\n\n\n//# sourceURL=webpack://websynthtest01/./src/synth/synthPatch.ts?");

/***/ }),

/***/ "./src/synth/synthProcessor.ts":
/*!*************************************!*\
  !*** ./src/synth/synthProcessor.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SynthProcessor = void 0;\nconst init_1 = __webpack_require__(/*! ../presets/init */ \"./src/presets/init.ts\");\nconst synthNote_1 = __webpack_require__(/*! ./synthNote */ \"./src/synth/synthNote.ts\");\nconst synthPatch_1 = __webpack_require__(/*! ./synthPatch */ \"./src/synth/synthPatch.ts\");\nclass SynthProcessor extends AudioWorkletProcessor {\n    constructor() {\n        super();\n        this.synthNoteMap = new Map();\n        this.fadeOutNotes = [];\n        this.synthPatchEx = (0, synthPatch_1.convertSynthPatchToEx)(init_1.initPreset.synthPatch);\n        this.polyphony = 2;\n        this.masterVolume = 0.2;\n        this.listenMessages();\n    }\n    /** 一番古いノートを取得します。 */\n    get oldestNote() {\n        let oldestNote = undefined;\n        let sampleIndex = 0;\n        for (const [midiNote, synthNote] of this.synthNoteMap.entries()) {\n            if (oldestNote == null || sampleIndex < synthNote.sampleIndex) {\n                oldestNote = midiNote;\n                sampleIndex = synthNote.sampleIndex;\n            }\n        }\n        return oldestNote;\n    }\n    process(inputs, outputs, parameters) {\n        const output = outputs[0];\n        const leftChannel = output[0];\n        const rightChannel = output[1];\n        const wave = [0, 0];\n        for (let i = 0; i < leftChannel.length; i++) {\n            wave[0] = wave[1] = 0;\n            // ノートオン or リリース状態\n            for (const note of Array.from(this.synthNoteMap.values())) {\n                if (!note.generateSample(wave)) {\n                    this.synthNoteMap.delete(note.note);\n                }\n            }\n            // 短いフェードアウト\n            for (let j = this.fadeOutNotes.length - 1; j >= 0; j--) {\n                if (!this.fadeOutNotes[j].generateSample(wave)) {\n                    this.fadeOutNotes.splice(j);\n                }\n            }\n            leftChannel[i] = wave[0] * this.masterVolume;\n            rightChannel[i] = wave[1] * this.masterVolume;\n        }\n        return true;\n    }\n    listenMessages() {\n        this.port.onmessage = e => {\n            const msg = e.data;\n            //console.log(e.data);\n            switch (msg.type) {\n                case \"NoteOn\":\n                    this.onNoteOn(msg.note);\n                    break;\n                case \"NoteOff\":\n                    this.onNoteOff(msg.note);\n                    break;\n                case \"Patch\":\n                    this.onPatch(msg.patch);\n                    break;\n                case \"MasterVolume\":\n                    this.onMasterVolume(msg.volume);\n                    break;\n                case \"Polyphony\":\n                    this.onPolyphony(msg.polyphony);\n                    break;\n            }\n        };\n    }\n    /** 指定された音階のノートがあれば短いフェードアウトで消すようにします。 */\n    fadeOutNote(note) {\n        const oldNote = this.synthNoteMap.get(note);\n        if (oldNote == null) {\n            return;\n        }\n        oldNote.fadeOutStartSec = oldNote.curSec;\n        this.fadeOutNotes.push(oldNote);\n        this.synthNoteMap.delete(note);\n    }\n    /** 同時発音数上限をチェックし、超えていたらフェードアウトさせます。 */\n    checkPolyphony() {\n        while (this.polyphony < this.synthNoteMap.size) {\n            const oldestNote = this.oldestNote;\n            if (oldestNote == null) {\n                break;\n            }\n            this.fadeOutNote(oldestNote);\n        }\n    }\n    onNoteOn(note) {\n        const oldNote = this.synthNoteMap.get(note);\n        if (oldNote != null && oldNote.noteOffSec == null) {\n            return;\n        }\n        if (oldNote != null && oldNote.noteOffSec != null) {\n            this.fadeOutNote(note);\n            //return;\n        }\n        this.synthNoteMap.set(note, new synthNote_1.SynthNote(note, this.synthPatchEx));\n        this.checkPolyphony();\n    }\n    onNoteOff(note) {\n        const synthNote = this.synthNoteMap.get(note);\n        if (synthNote == null) {\n            return;\n        }\n        if (synthNote.noteOffSec == null) {\n            synthNote.noteOffSec = synthNote.curSec;\n        }\n    }\n    /** パッチを変更します。 */\n    onPatch(path) {\n        this.synthPatchEx = (0, synthPatch_1.convertSynthPatchToEx)(path);\n    }\n    onMasterVolume(vol) {\n        this.masterVolume = vol;\n    }\n    onPolyphony(polyphony) {\n        this.polyphony = polyphony;\n        this.checkPolyphony();\n    }\n}\nexports.SynthProcessor = SynthProcessor;\n\n\n//# sourceURL=webpack://websynthtest01/./src/synth/synthProcessor.ts?");

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/synth.ts");
/******/ 	
/******/ })()
;