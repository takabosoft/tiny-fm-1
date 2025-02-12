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

/***/ "./src/components/envelopePreview.ts":
/*!*******************************************!*\
  !*** ./src/components/envelopePreview.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.EnvelopePreview = void 0;\nconst rect_1 = __webpack_require__(/*! ../geometries/rect */ \"./src/geometries/rect.ts\");\nconst vec2_1 = __webpack_require__(/*! ../geometries/vec2 */ \"./src/geometries/vec2.ts\");\nconst const_1 = __webpack_require__(/*! ../synth/const */ \"./src/synth/const.ts\");\nconst envelope_1 = __webpack_require__(/*! ../synth/envelope */ \"./src/synth/envelope.ts\");\nconst component_1 = __webpack_require__(/*! ./component */ \"./src/components/component.ts\");\nconst size = new vec2_1.Vec2(170, 48);\n/** エンベロープの形をプレビューするコンポーネントです。 */\nclass EnvelopePreview extends component_1.Component {\n    constructor() {\n        super();\n        this.element = $(`<svg width=\"${size.x}\" height=\"${size.y}\">`).css({\n            \"margin-left\": \"8px\",\n            \"overflow\": \"hidden\",\n        });\n        this.render({\n            attackSec: 1,\n            attackShape: 0,\n            decaySec: 1,\n            decayShape: 0,\n            sustain: 0.8,\n            releaseSec: 1,\n            releaseShape: 0,\n        });\n    }\n    render(envParams) {\n        var _a;\n        this.element.empty();\n        const svg = this.element[0];\n        const padding = 2;\n        const rc = new rect_1.Rect(padding, padding, size.x - padding * 2, size.y - padding); // 下だけギリギリにする\n        const sustainSec = 1; // 適当\n        const noteOffSec = envParams.attackSec + envParams.decaySec + sustainSec;\n        const totalSec = noteOffSec + envParams.releaseSec;\n        let d = `M${rc.x} ${rc.bottom}`;\n        for (let i = 0; i < rc.width; i++) {\n            const sec = i * totalSec / (rc.width - 1);\n            const x = rc.x + i;\n            const y = rc.bottom - rc.height * ((_a = (0, envelope_1.calcEnvelope)(envParams, sec, noteOffSec)) !== null && _a !== void 0 ? _a : 0);\n            d += `L${x} ${y}`;\n        }\n        const path = $(document.createElementNS(\"http://www.w3.org/2000/svg\", \"path\")).attr({\n            \"stroke\": const_1.highLightColor,\n            \"stroke-width\": 2,\n            \"stroke-linejoin\": \"round\",\n            \"fill\": \"#4088D988\",\n            d\n        });\n        this.element.append(path);\n    }\n}\nexports.EnvelopePreview = EnvelopePreview;\n\n\n//# sourceURL=webpack://websynthtest01/./src/components/envelopePreview.ts?");

/***/ }),

/***/ "./src/components/headerPanel.ts":
/*!***************************************!*\
  !*** ./src/components/headerPanel.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.HeaderPanel = void 0;\nconst component_1 = __webpack_require__(/*! ./component */ \"./src/components/component.ts\");\nconst knobWithInput_1 = __webpack_require__(/*! ./knobWithInput */ \"./src/components/knobWithInput.ts\");\nconst knobSize = 60;\nclass HeaderPanel extends component_1.Component {\n    constructor(synthProcessor) {\n        super();\n        this.synthProcessor = synthProcessor;\n        this.masterVolumeKnob = new knobWithInput_1.KnobWithInput(knobSize, \"M.Volume\", 0, 0.5, 0.2, 0.2, undefined, 3, vol => this.synthProcessor.masterVolume(vol));\n        this.polyphonyKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Polyphony\", 1, 99, 10, 10, undefined, 0, poly => this.synthProcessor.polyphony(poly));\n        this.element = $(`<div class=\"header-panel\">`).append($(`<div class=\"title\">`).text(\"TinyFM1\"), $(`<div class=\"align-right\">`), this.polyphonyKnob.element.css(\"margin-right\", 8), this.masterVolumeKnob.element, $(`<div class=\"sp\">`), $(`<div class=\"copyright\">`).text(\"(C) 2025 Takabo Soft\"));\n        this.synthProcessor.masterVolume(this.masterVolumeKnob.value);\n        this.synthProcessor.polyphony(this.polyphonyKnob.value);\n    }\n}\nexports.HeaderPanel = HeaderPanel;\n\n\n//# sourceURL=webpack://websynthtest01/./src/components/headerPanel.ts?");

/***/ }),

/***/ "./src/components/knob.ts":
/*!********************************!*\
  !*** ./src/components/knob.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Knob = void 0;\nconst vec2_1 = __webpack_require__(/*! ../geometries/vec2 */ \"./src/geometries/vec2.ts\");\nconst const_1 = __webpack_require__(/*! ../synth/const */ \"./src/synth/const.ts\");\nconst component_1 = __webpack_require__(/*! ./component */ \"./src/components/component.ts\");\n/** つまみ */\nclass Knob extends component_1.Component {\n    constructor(size = 70, min, max, _value, resetValue, centerValue, onInput) {\n        super();\n        this.size = size;\n        this.min = min;\n        this.max = max;\n        this._value = _value;\n        this.resetValue = resetValue;\n        this.centerValue = centerValue;\n        this.onInput = onInput;\n        this.bottomSpaceDeg = 45;\n        this.lineLen = 10;\n        this.strokeWidth = 4;\n        this.beginDeg = 270 - this.bottomSpaceDeg;\n        this.endDeg = this.beginDeg - 360 + this.bottomSpaceDeg * 2;\n        this.svg = $(`<svg width=\"${this.size}\" height=\"${this.size}\">`);\n        this.appendPath(\"rgba(0, 0, 0, 0.08)\", this.strokeWidth, this.buildPathArcD(this.min, this.max));\n        this.arcPath = this.appendPath(const_1.highLightColor, this.strokeWidth, \"\");\n        this.appendValueLine(this.min);\n        this.appendValueLine(this.max);\n        if (centerValue != null) {\n            this.appendValueLine(centerValue);\n        }\n        this.element = $(`<div class=\"knob\" tabindex=\"-1\">`).append(this.svg, $(`<div>`).append(`<div>`));\n        this.updateKnobAngle();\n        this.listenPointerEvents();\n    }\n    get value() { return this._value; }\n    set value(v) {\n        v = this.clampValue(v);\n        if (this._value != v) {\n            this._value = v;\n            this.updateKnobAngle();\n        }\n    }\n    /** つまみ本体の回転反映および円弧の更新をします。 */\n    updateKnobAngle() {\n        this.element.css({\n            \"--angle\": `${-this.valueToDeg(this._value) + 90}deg`,\n        });\n        if (this.centerValue != null) {\n            if (this._value < this.centerValue) {\n                this.arcPath.attr(\"d\", this.buildPathArcD(this._value, this.centerValue));\n            }\n            else {\n                this.arcPath.attr(\"d\", this.buildPathArcD(this.centerValue, this._value));\n            }\n        }\n        else {\n            this.arcPath.attr(\"d\", this.buildPathArcD(this.min, this._value));\n        }\n    }\n    clampValue(val) {\n        return Math.max(Math.min(val, this.max), this.min);\n    }\n    /** 時計回り */\n    buildPathArcD(startVal, endVal) {\n        const radius = this.size / 2 - this.lineLen / 2;\n        const pt1 = this.calcValuePos(startVal, radius);\n        const pt2 = this.calcValuePos(endVal, radius);\n        const isLarge = (this.valueToDeg(startVal) - this.valueToDeg(endVal)) > 180;\n        return `M${pt1.x} ${pt1.y} A${radius} ${radius} 0 ${isLarge ? 1 : 0} 1 ${pt2.x} ${pt2.y}`;\n    }\n    appendPath(stroke, strokeWidth, d) {\n        const path = $(document.createElementNS(\"http://www.w3.org/2000/svg\", \"path\")).attr({\n            stroke,\n            \"stroke-width\": strokeWidth,\n            fill: \"none\",\n            d,\n        });\n        this.svg.append(path);\n        return path;\n    }\n    appendValueLine(val) {\n        const pt1 = this.calcValuePos(val, this.size / 2);\n        const pt2 = this.calcValuePos(val, this.size / 2 - this.lineLen);\n        this.appendPath(\"#333\", 1, `M${pt1.x} ${pt1.y} L${pt2.x} ${pt2.y}`);\n    }\n    calcValuePos(val, radius) {\n        const deg = this.valueToDeg(val);\n        const rad = deg * Math.PI / 180;\n        return new vec2_1.Vec2(this.size / 2 + Math.cos(rad) * radius, this.size / 2 - Math.sin(rad) * radius);\n    }\n    valueToDeg(val) {\n        const a = (this.clampValue(val) - this.min) / (this.max - this.min);\n        return this.beginDeg * (1 - a) + this.endDeg * a;\n    }\n    listenPointerEvents() {\n        const el = this.element[0];\n        let dragPointerId = undefined;\n        let oldValue = 0;\n        let dragStartY = 0;\n        let lastPointerDownTimeStamp = undefined;\n        const changeValue = (v) => {\n            const newValue = this.clampValue(v);\n            if (this._value != newValue) {\n                this._value = newValue;\n                this.updateKnobAngle();\n                this.onInput(newValue);\n            }\n        };\n        // 虫眼鏡が出たりするのを回避します。\n        el.addEventListener(\"touchstart\", e => e.preventDefault());\n        el.addEventListener(\"pointerdown\", e => {\n            e.preventDefault();\n            this.element.trigger(\"focus\");\n            if (dragPointerId != null) {\n                return;\n            }\n            if (e.pointerType == \"button\" && e.button != 0) {\n                return;\n            }\n            // ダブルクリック検出\n            if (lastPointerDownTimeStamp != null && e.timeStamp - lastPointerDownTimeStamp < 200) {\n                changeValue(this.resetValue);\n                return;\n            }\n            el.setPointerCapture(e.pointerId);\n            dragPointerId = e.pointerId;\n            oldValue = this._value;\n            dragStartY = e.clientY;\n            lastPointerDownTimeStamp = e.timeStamp;\n        });\n        el.addEventListener(\"pointermove\", e => {\n            e.preventDefault();\n            if (el.hasPointerCapture(e.pointerId) && e.pointerId == dragPointerId) {\n                changeValue(oldValue + (dragStartY - e.clientY) * (this.max - this.min) / 180);\n            }\n        });\n        const cancel = (e) => {\n            e.preventDefault();\n            if (e.pointerId == dragPointerId) {\n                dragPointerId = undefined;\n            }\n        };\n        el.addEventListener(\"lostpointercapture\", cancel);\n        el.addEventListener(\"pointercancel\", cancel);\n    }\n}\nexports.Knob = Knob;\n\n\n//# sourceURL=webpack://websynthtest01/./src/components/knob.ts?");

/***/ }),

/***/ "./src/components/knobWithInput.ts":
/*!*****************************************!*\
  !*** ./src/components/knobWithInput.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.KnobWithInput = void 0;\nconst component_1 = __webpack_require__(/*! ./component */ \"./src/components/component.ts\");\nconst knob_1 = __webpack_require__(/*! ./knob */ \"./src/components/knob.ts\");\n/** タイトル＋つまみ＋編集ボックス */\nclass KnobWithInput extends component_1.Component {\n    constructor(size, label, min, max, value, resetValue, centerValue, fractionDigits, onInput) {\n        super();\n        this.fractionDigits = fractionDigits;\n        this.input = $(`<input type=\"number\" step=\"any\">`);\n        this.knob = new knob_1.Knob(size, min, max, value, resetValue, centerValue, newVal => {\n            this.toInput();\n            onInput(newVal);\n        });\n        this.element = $(`<div class=\"knob-with-input\">`).append($(`<h5>`).text(label), this.knob.element, this.input);\n        this.toInput();\n        this.input.on(\"change\", () => {\n            const oldValue = this.knob.value;\n            this.knob.value = parseFloat(this.input.val() + \"\");\n            if (this.knob.value != oldValue) {\n                onInput(this.knob.value);\n            }\n        }).css({\n            width: size,\n        });\n    }\n    get value() { return this.knob.value; }\n    set value(v) {\n        const oldValue = this.knob.value;\n        this.knob.value = v;\n        if (this.knob.value != oldValue) {\n            this.toInput();\n        }\n    }\n    /** のぶの値をInputへ反映します。 */\n    toInput() {\n        this.input.val(this.knob.value.toFixed(this.fractionDigits));\n    }\n}\nexports.KnobWithInput = KnobWithInput;\n\n\n//# sourceURL=webpack://websynthtest01/./src/components/knobWithInput.ts?");

/***/ }),

/***/ "./src/components/operatorPanel.ts":
/*!*****************************************!*\
  !*** ./src/components/operatorPanel.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.OperatorPanel = void 0;\nconst const_1 = __webpack_require__(/*! ../synth/const */ \"./src/synth/const.ts\");\nconst envelope_1 = __webpack_require__(/*! ../synth/envelope */ \"./src/synth/envelope.ts\");\nconst component_1 = __webpack_require__(/*! ./component */ \"./src/components/component.ts\");\nconst envelopePreview_1 = __webpack_require__(/*! ./envelopePreview */ \"./src/components/envelopePreview.ts\");\nconst knobWithInput_1 = __webpack_require__(/*! ./knobWithInput */ \"./src/components/knobWithInput.ts\");\nconst knobSize = 60;\nclass OperatorPanel extends component_1.Component {\n    constructor(oscIdx, onChange) {\n        super();\n        this.onChange = onChange;\n        this.ratioKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Ratio\", 0, 64, 1, 1, undefined, 3, () => this.onChange());\n        this.offsetKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Offset(Hz)\", 0, 9999, 0, 0, undefined, 2, () => this.onChange());\n        this.sendKnobs = [];\n        this.ampEnvAttackKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Attack(s)\", 0, 4, 0, 0, undefined, 3, () => this.onAmpEnvChange());\n        this.ampEnvAttackShapeKnob = new knobWithInput_1.KnobWithInput(knobSize, \"A Shape\", envelope_1.shapeMin, envelope_1.shapeMax, 0, 0, 0, 2, () => this.onAmpEnvChange());\n        this.ampEnvDecayKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Decay(s)\", 0, 4, 0, 0, undefined, 3, () => this.onAmpEnvChange());\n        this.ampEnvDecayShapeKnob = new knobWithInput_1.KnobWithInput(knobSize, \"D Shape\", envelope_1.shapeMin, envelope_1.shapeMax, 0, 0, 0, 2, () => this.onAmpEnvChange());\n        this.ampEnvSustainKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Sustain\", 0, 1, 1, 1, undefined, 3, () => this.onAmpEnvChange());\n        this.ampEnvReleaseKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Release(s)\", envelope_1.releaseSecMin, 4, envelope_1.releaseSecMin, envelope_1.releaseSecMin, undefined, 3, () => this.onAmpEnvChange());\n        this.ampEnvReleaseShapeKnob = new knobWithInput_1.KnobWithInput(knobSize, \"R Shape\", envelope_1.shapeMin, envelope_1.shapeMax, 0, 0, 0, 2, () => this.onAmpEnvChange());\n        this.envelopePreview = new envelopePreview_1.EnvelopePreview();\n        this.volumeKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Volume\", 0, 1, 0, 0, undefined, 3, () => this.onChange());\n        this.panKnob = new knobWithInput_1.KnobWithInput(knobSize, \"Pan\", -1, 1, 0, 0, 0, 3, () => this.onChange());\n        for (let i = 0; i < const_1.oscCount; i++) {\n            this.sendKnobs.push(new knobWithInput_1.KnobWithInput(knobSize, i == oscIdx ? \"FeedBack\" : `Send ${\"ABCDEF\"[i]}`, 0, 10, 0, 0, 0, 3, () => { }));\n        }\n        this.element = $(`<div class=\"operator-panel\">`).append($(`<div class=\"title\">`).text(`OP ${\"ABCDEF\"[oscIdx]}`), this.ratioKnob.element, this.offsetKnob.element, $(`<div class=\"sp\">`), this.sendKnobs.map(k => k.element), $(`<div class=\"sp\">`), this.ampEnvAttackKnob.element, this.ampEnvAttackShapeKnob.element, this.ampEnvDecayKnob.element, this.ampEnvDecayShapeKnob.element, this.ampEnvSustainKnob.element, this.ampEnvReleaseKnob.element, this.ampEnvReleaseShapeKnob.element, this.envelopePreview.element, $(`<div class=\"sp\">`), this.volumeKnob.element, this.panKnob.element);\n    }\n    get envelopeParams() {\n        return {\n            attackSec: this.ampEnvAttackKnob.value,\n            attackShape: this.ampEnvAttackShapeKnob.value,\n            decaySec: this.ampEnvDecayKnob.value,\n            decayShape: this.ampEnvDecayShapeKnob.value,\n            sustain: this.ampEnvSustainKnob.value,\n            releaseSec: this.ampEnvReleaseKnob.value,\n            releaseShape: this.ampEnvReleaseShapeKnob.value,\n        };\n    }\n    get operatorParams() {\n        return {\n            frequencyRatio: this.ratioKnob.value,\n            frequencyOffsetHz: this.offsetKnob.value,\n            sendDepths: [\n                this.sendKnobs[0].value,\n                this.sendKnobs[1].value,\n                this.sendKnobs[2].value,\n                this.sendKnobs[3].value,\n                this.sendKnobs[4].value,\n                this.sendKnobs[5].value,\n            ],\n            ampEnvelope: this.envelopeParams,\n            volume: this.volumeKnob.value,\n            pan: this.panKnob.value,\n        };\n    }\n    set operatorParams(p) {\n        this.ratioKnob.value = p.frequencyRatio;\n        this.offsetKnob.value = p.frequencyOffsetHz;\n        this.sendKnobs.forEach((knob, idx) => knob.value = p.sendDepths[idx]);\n        this.ampEnvAttackKnob.value = p.ampEnvelope.attackSec;\n        this.ampEnvAttackShapeKnob.value = p.ampEnvelope.attackShape;\n        this.ampEnvDecayKnob.value = p.ampEnvelope.decaySec;\n        this.ampEnvDecayShapeKnob.value = p.ampEnvelope.decayShape;\n        this.ampEnvSustainKnob.value = p.ampEnvelope.sustain;\n        this.ampEnvReleaseKnob.value = p.ampEnvelope.releaseSec;\n        this.ampEnvReleaseShapeKnob.value = p.ampEnvelope.releaseShape;\n        this.envelopePreview.render(p.ampEnvelope);\n        this.volumeKnob.value = p.volume;\n        this.panKnob.value = p.pan;\n    }\n    onAmpEnvChange() {\n        this.envelopePreview.render(this.envelopeParams);\n        this.onChange();\n    }\n}\nexports.OperatorPanel = OperatorPanel;\n\n\n//# sourceURL=webpack://websynthtest01/./src/components/operatorPanel.ts?");

/***/ }),

/***/ "./src/components/synthBody.ts":
/*!*************************************!*\
  !*** ./src/components/synthBody.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SynthBody = void 0;\nconst init_1 = __webpack_require__(/*! ../presets/init */ \"./src/presets/init.ts\");\nconst const_1 = __webpack_require__(/*! ../synth/const */ \"./src/synth/const.ts\");\nconst component_1 = __webpack_require__(/*! ./component */ \"./src/components/component.ts\");\nconst headerPanel_1 = __webpack_require__(/*! ./headerPanel */ \"./src/components/headerPanel.ts\");\nconst operatorPanel_1 = __webpack_require__(/*! ./operatorPanel */ \"./src/components/operatorPanel.ts\");\nclass SynthBody extends component_1.Component {\n    constructor(synthProcessor) {\n        super();\n        this.synthProcessor = synthProcessor;\n        this.keyNoteDefaultMap = new Map([\n            // 白鍵（C3 ~ B3）\n            [\"z\", 48 /* MidiNote.C3 */], [\"x\", 50 /* MidiNote.D3 */], [\"c\", 52 /* MidiNote.E3 */],\n            [\"v\", 53 /* MidiNote.F3 */], [\"b\", 55 /* MidiNote.G3 */], [\"n\", 57 /* MidiNote.A3 */],\n            [\"m\", 59 /* MidiNote.B3 */],\n            // 黒鍵（C#3 ~ A#3）\n            [\"s\", 49 /* MidiNote.C_SHARP_3 */], [\"d\", 51 /* MidiNote.D_SHARP_3 */],\n            [\"g\", 54 /* MidiNote.F_SHARP_3 */], [\"h\", 56 /* MidiNote.G_SHARP_3 */],\n            [\"j\", 58 /* MidiNote.A_SHARP_3 */],\n            // 高いオクターブ（C4 ~ E4）\n            [\",\", 60 /* MidiNote.C4 */], [\".\", 62 /* MidiNote.D4 */], [\"/\", 64 /* MidiNote.E4 */],\n            // 黒鍵（C#4 ~ D#4）\n            [\"l\", 61 /* MidiNote.C_SHARP_4 */], [\";\", 63 /* MidiNote.D_SHARP_4 */],\n        ]);\n        /** MIDI ON状態のノートをここで管理します。PCキーボード・マウスなど複数デバイスからありえない入力状態になるのを防ぎます。 */\n        this.midiNoteOnSet = new Set();\n        /** PCキーボード情報 */\n        this.pcKeyNoteStateMap = new Map();\n        this.operatorPanels = [];\n        this.pcKeyOctaveShift = 1;\n        for (let i = 0; i < const_1.oscCount; i++) {\n            this.operatorPanels.push(new operatorPanel_1.OperatorPanel(i, () => this.changePatch(this.synthPatch)));\n        }\n        this.element = $(`<div class=\"synth-body\">`).append(new headerPanel_1.HeaderPanel(synthProcessor).element, this.operatorPanels.map(p => p.element));\n        this.listenPCKeyboard();\n        this.changePatch(init_1.initPreset.synthPatch);\n    }\n    get synthPatch() {\n        return {\n            operatorsParams: [\n                this.operatorPanels[0].operatorParams,\n                this.operatorPanels[1].operatorParams,\n                this.operatorPanels[2].operatorParams,\n                this.operatorPanels[3].operatorParams,\n                this.operatorPanels[4].operatorParams,\n                this.operatorPanels[5].operatorParams,\n            ]\n        };\n    }\n    /** パッチを変更します。プロセッサに情報を送り、UIも更新します。 */\n    changePatch(newPatch) {\n        this.synthProcessor.patch(newPatch);\n        for (let i = 0; i < const_1.oscCount; i++) {\n            this.operatorPanels[i].operatorParams = newPatch.operatorsParams[i];\n        }\n    }\n    noteOn(note) {\n        var _a;\n        if (this.midiNoteOnSet.has(note)) {\n            return;\n        }\n        this.midiNoteOnSet.add(note);\n        (_a = this.synthProcessor) === null || _a === void 0 ? void 0 : _a.noteOn(note);\n        //this.virtualKeyboard.selectKey(note, true);\n    }\n    noteOff(note) {\n        var _a;\n        if (!this.midiNoteOnSet.has(note)) {\n            return;\n        }\n        this.midiNoteOnSet.delete(note);\n        (_a = this.synthProcessor) === null || _a === void 0 ? void 0 : _a.noteOff(note);\n        //this.virtualKeyboard.selectKey(note, false);\n    }\n    listenPCKeyboard() {\n        document.addEventListener(\"keydown\", e => {\n            if (this.pcKeyNoteStateMap.has(e.key)) {\n                return;\n            } // キーボード連打阻止\n            let note = this.keyNoteDefaultMap.get(e.key);\n            if (note != null) {\n                note += this.pcKeyOctaveShift * 12;\n                if (note >= 0 && note <= 127) {\n                    this.noteOn(note);\n                    this.pcKeyNoteStateMap.set(e.key, note); // キーボードを押すときと離すときでNote#が変わる場合があり得るので保持しておく\n                }\n            }\n        });\n        document.addEventListener(\"keyup\", e => {\n            const note = this.pcKeyNoteStateMap.get(e.key);\n            if (note != null) {\n                this.noteOff(note);\n                this.pcKeyNoteStateMap.delete(e.key);\n            }\n        });\n    }\n}\nexports.SynthBody = SynthBody;\n\n\n//# sourceURL=webpack://websynthtest01/./src/components/synthBody.ts?");

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

eval("\n/**\n * Development Build: npx webpack -w\n * Development Server: npx live-server docs\n * Development Server(HTTPS): npx live-server docs --https=https.js\n * Release Build: npx webpack --mode=production\n */\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst synthBody_1 = __webpack_require__(/*! ./components/synthBody */ \"./src/components/synthBody.ts\");\nconst synthProcessorWrapper_1 = __webpack_require__(/*! ./synth/synthProcessorWrapper */ \"./src/synth/synthProcessorWrapper.ts\");\n$(() => {\n    console.log(\"OK\");\n    try {\n        new PageController().start();\n    }\n    catch (e) {\n        alert(e);\n    }\n});\nclass PageController {\n    constructor() {\n        this.audioContext = new AudioContext();\n    }\n    /** 仮想キーボード */\n    /*private readonly virtualKeyboard = new VirtualKeyboard({\n        height: 200,\n        //minNote: MidiNote.A_SHARP_MINUS_1,\n        onKeyDown: note => this.noteOn(note),\n        onKeyUp: note => this.noteOff(note),\n    });*/\n    start() {\n        return __awaiter(this, void 0, void 0, function* () {\n            document.addEventListener(\"pointerdown\", () => this.audioContext.resume(), true);\n            document.addEventListener(\"keydown\", () => this.audioContext.resume(), true);\n            yield this.audioContext.audioWorklet.addModule(\"synth.bundle.js\");\n            const myProcessorNode = new AudioWorkletNode(this.audioContext, \"SynthProcessor\", { outputChannelCount: [2] });\n            myProcessorNode.connect(this.audioContext.destination);\n            const synthBody = new synthBody_1.SynthBody(new synthProcessorWrapper_1.SynthProcessorWrapper(myProcessorNode));\n            $(\"main\").append(synthBody.element);\n            /*const slider = $(`<input type=\"range\" min=\"-1.0\" max=\"1.0\" step=\"0.01\" style=\"width: 200px;\">`).on(\"input\", () => {\n                //console.log(slider.val() ?? 0);\n                this.synthProcessor?.test(parseFloat(slider.val() + \"\"));\n            })\n            $(\"body\").append($(`<br>`), slider);*/\n            //$(\"body\").append($(`<div class=\"virtual-keyboard-wrapper\">`).append(this.virtualKeyboard.element));\n            //this.virtualKeyboard.visibleKey(MidiNote.C4);\n            //this.listenPCKeyboard();\n        });\n    }\n}\n\n\n//# sourceURL=webpack://websynthtest01/./src/index.ts?");

/***/ }),

/***/ "./src/presets/init.ts":
/*!*****************************!*\
  !*** ./src/presets/init.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.initPreset = exports.initOperatorsParams = void 0;\nconst envelope_1 = __webpack_require__(/*! ../synth/envelope */ \"./src/synth/envelope.ts\");\nconst operatorParams = {\n    frequencyRatio: 1,\n    frequencyOffsetHz: 0,\n    sendDepths: [0, 0, 0, 0, 0, 0],\n    ampEnvelope: envelope_1.initEnvelopeParams,\n    volume: 0,\n    pan: 0,\n};\nexports.initOperatorsParams = [\n    Object.assign(Object.assign({}, operatorParams), { volume: 1.0 }),\n    operatorParams,\n    operatorParams,\n    operatorParams,\n    operatorParams,\n    operatorParams,\n];\nexports.initPreset = {\n    name: \"Init\",\n    synthPatch: {\n        operatorsParams: exports.initOperatorsParams,\n    }\n};\n\n\n//# sourceURL=webpack://websynthtest01/./src/presets/init.ts?");

/***/ }),

/***/ "./src/synth/const.ts":
/*!****************************!*\
  !*** ./src/synth/const.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.highLightColor = exports.oscCount = void 0;\nexports.oscCount = 6;\nexports.highLightColor = \"#4088D9\";\n\n\n//# sourceURL=webpack://websynthtest01/./src/synth/const.ts?");

/***/ }),

/***/ "./src/synth/envelope.ts":
/*!*******************************!*\
  !*** ./src/synth/envelope.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.initEnvelopeParams = exports.shapeMax = exports.shapeMin = exports.releaseSecMin = void 0;\nexports.interpolate = interpolate;\nexports.calcEnvelope = calcEnvelope;\nexports.releaseSecMin = 0.001;\nexports.shapeMin = -10;\nexports.shapeMax = +10;\nexports.initEnvelopeParams = {\n    attackSec: 0,\n    attackShape: 0,\n    decaySec: 0,\n    decayShape: 0,\n    sustain: 1,\n    releaseSec: exports.releaseSecMin,\n    releaseShape: 0,\n};\nfunction interpolateCore(t, shape) {\n    if (shape === 0) {\n        return t;\n    }\n    if (shape > 0) {\n        return Math.pow(t, 1 + shape);\n    }\n    else {\n        return 1 - Math.pow(1 - t, 1 - shape);\n    }\n}\nfunction interpolate(t1Sec, v1, t2Sec, v2, shape, curSec) {\n    if (curSec < t1Sec || curSec > t2Sec) {\n        return undefined;\n    }\n    const deltaT = (curSec - t1Sec) / (t2Sec - t1Sec);\n    const alpha = interpolateCore(deltaT, shape);\n    return v1 * (1 - alpha) + v2 * alpha;\n}\nfunction calcEnvelope(params, curSec, noteOffSec) {\n    var _a;\n    if (noteOffSec != null && curSec >= noteOffSec) {\n        const t1Sec = noteOffSec;\n        const v1 = (_a = calcEnvelope(params, noteOffSec, undefined)) !== null && _a !== void 0 ? _a : 0;\n        const t2Sec = t1Sec + params.releaseSec;\n        const v2 = 0;\n        return interpolate(t1Sec, v1, t2Sec, v2, params.releaseShape, curSec);\n    }\n    if (curSec < params.attackSec) {\n        // アタック\n        const t1Sec = 0;\n        const v1 = 0;\n        const t2Sec = params.attackSec;\n        const v2 = 1;\n        return interpolate(t1Sec, v1, t2Sec, v2, params.attackShape, curSec);\n    }\n    else if (curSec < params.attackSec + params.decaySec) {\n        // ディケイ\n        const t1Sec = params.attackSec;\n        const v1 = 1;\n        const t2Sec = params.attackSec + params.decaySec;\n        const v2 = params.sustain;\n        return interpolate(t1Sec, v1, t2Sec, v2, params.decayShape, curSec);\n    }\n    else {\n        return params.sustain;\n    }\n}\n\n\n//# sourceURL=webpack://websynthtest01/./src/synth/envelope.ts?");

/***/ }),

/***/ "./src/synth/synthProcessorWrapper.ts":
/*!********************************************!*\
  !*** ./src/synth/synthProcessorWrapper.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SynthProcessorWrapper = void 0;\n/** `SynthProcessor`へメッセージを送る係 */\nclass SynthProcessorWrapper {\n    constructor(node) {\n        this.node = node;\n    }\n    send(msg) {\n        this.node.port.postMessage(msg);\n    }\n    /**\n     * ノートオン\n     * @param note\n     */\n    noteOn(note) {\n        this.send({ type: \"NoteOn\", note });\n    }\n    /**\n     * ノートオフ\n     * @param note\n     */\n    noteOff(note) {\n        this.send({ type: \"NoteOff\", note });\n    }\n    /**\n     * パッチの変更\n     * @param patch\n     */\n    patch(patch) {\n        this.send({ type: \"Patch\", patch });\n    }\n    /**\n     * マスターボリュームの変更\n     * @param volume\n     */\n    masterVolume(volume) {\n        this.send({ type: \"MasterVolume\", volume });\n    }\n    /**\n     * 最大同時発音数の変更\n     * @param polyphony\n     */\n    polyphony(polyphony) {\n        this.send({ type: \"Polyphony\", polyphony: Math.floor(polyphony) });\n    }\n}\nexports.SynthProcessorWrapper = SynthProcessorWrapper;\n\n\n//# sourceURL=webpack://websynthtest01/./src/synth/synthProcessorWrapper.ts?");

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