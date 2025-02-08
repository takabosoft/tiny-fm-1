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

/***/ "./src/synth.ts":
/*!**********************!*\
  !*** ./src/synth.ts ***!
  \**********************/
/***/ (() => {

eval("\nclass MyProcessor extends AudioWorkletProcessor {\n    constructor() {\n        super();\n        this.phase = 0;\n        this.frequency = 440; // サイン波の周波数（Hz）\n    }\n    process(inputs, outputs, parameters) {\n        const output = outputs[0]; // 1つの出力チャネル\n        // 各フレームごとにサイン波を生成\n        for (let i = 0; i < output[0].length; i++) {\n            this.phase += this.frequency / sampleRate; // 波形の位相を進める\n            if (this.phase >= 1)\n                this.phase -= 1; // 位相が1を超えたら0に戻す\n            // サイン波の計算\n            output[0][i] = Math.sin(this.phase * 2 * Math.PI);\n        }\n        return true;\n    }\n}\nregisterProcessor(\"MyProcessor\", MyProcessor);\n\n\n//# sourceURL=webpack://websynthtest01/./src/synth.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/synth.ts"]();
/******/ 	
/******/ })()
;