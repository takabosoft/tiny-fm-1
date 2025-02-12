import { calcEnvelope, interpolate, releaseSecMin } from "./envelope";
import { OperatorParamsEx } from "./operatorParams";
import { MidiNote } from "./synthMessage";
import { SynthPatchEx } from "./synthPatch";

const PI2 = 2 * Math.PI;
const fadeOutSec = releaseSecMin;

function midiNoteToFrequency(note: MidiNote): number {
    return 440 * Math.pow(2, (note - MidiNote.A4) / 12);
}

/**
 * 線形パンニングです。
 * @param input モノラル入力
 * @param pan パン(-1.0～1.0)
 * @param output 出力
 */
function panning(input: number, pan: number, output: number[]) {
    output[0] += input * (1 - pan) / 2;
    output[1] += input * (1 + pan) / 2;
}

/** 波形生成 */
class WaveformGenerator {
    /** 位相0.0～1.0 */
    private phase = 0;

    constructor() { }

    /**
     * 現在の波形の値を算出します。現状はサイン波のみです。
     * @param fm 変調
     * @returns 
     */
    getValue(fm = 0): number {
        return Math.sin(this.phase * PI2 + fm);
    }

    addPhase(frequency: number) {
        this.phase += frequency / sampleRate;
        this.phase %= 1;
    }
}

/** FMオペレーター */
class Operator {
    oldOpValue = 0;
    newOpValue = 0;
    readonly waveformGen = new WaveformGenerator();

    constructor(public params: OperatorParamsEx) { }
}

/** キーボードの1音に対応する音を管理するものです。 */
export class SynthNote {
    private operators: Operator[];
    private mod = new WaveformGenerator();
    private _sampleIndex = 0;

    noteOffSec?: number;
    fadeOutStartSec?: number;

    constructor(readonly note: MidiNote, private patch: SynthPatchEx) {
        this.operators = patch.operatorsParams.map(params => new Operator(params));
    }

    get sampleIndex() { return this._sampleIndex; }
    get curSec() { return this._sampleIndex / sampleRate; }

    /** 波形の値を生成します。グローバル変数の`sampleRate`を使います。 */
    generateSample(output: number[], pitchBend: number, modulation: number): boolean {
        const freq = midiNoteToFrequency(this.note + pitchBend + this.mod.getValue() * modulation);
        this.mod.addPhase(this.patch.modulationFrequency);

        const curSec = this.curSec;
        let isContinue = false;

        for (let opIdx = 0; opIdx < this.operators.length; opIdx++) {
            const op = this.operators[opIdx];
            const params = op.params;
            if (params.sleep) { continue; }

            // モジューレーターは一つ前の値（oldOpValue）を使うと仕組みが簡単になる
            const mod = this.operators.reduce((prev, op2) => prev + op2.params.sendDepths[opIdx] * op2.oldOpValue, 0);
            op.newOpValue = op.waveformGen.getValue(mod);

            if (params.volume > 0) {
                const amp = calcEnvelope(params.ampEnvelope, curSec, this.noteOffSec);
                if (amp != null) {
                    // ノートが重なる場合の短いフェードアウト処理
                    if (this.fadeOutStartSec != null) {
                        const fadeAmp = interpolate(this.fadeOutStartSec, 1, this.fadeOutStartSec + fadeOutSec, 0, 0, curSec);
                        if (fadeAmp != null) {
                            isContinue = true;
                            panning(op.newOpValue * amp * fadeAmp * params.volume, params.pan, output);
                        }
                    } else {
                        isContinue = true;
                        panning(op.newOpValue * amp * params.volume, params.pan, output);
                    }
                }
            }
            op.waveformGen.addPhase(freq * params.frequencyRatio + params.frequencyOffsetHz);
        }

        // 計算結果をoldへ格納する
        for (const op of this.operators) {
            op.oldOpValue = op.newOpValue;
        }

        this._sampleIndex++;
        return isContinue;
    }

    updatePatch(patch: SynthPatchEx): void {
        this.patch = patch;
        this.operators.forEach((op, i) => op.params = patch.operatorsParams[i]);
    }
}