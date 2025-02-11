import { initOperatorsParams } from "../presets/init";
import { OperatorsParams } from "../presets/presetEntity";
import { calcEnvelope, initEnvelopeParams } from "./envelope";
import { OperatorParams } from "./operatorParams";
import { MidiNote, SynthMessage } from "./synthMessage";

const PI2 = 2 * Math.PI;
const fadeOutSec = 0.01;

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

interface OperatorParamsEx extends OperatorParams {
    /** オペレーターとして全く利用していない場合はtrue */
    readonly sleep: boolean;
}

function convertOperatorParamsToEx(params: OperatorParams): OperatorParamsEx {
    return {
        ...params,
        sleep: params.sendDepths.every(d => d == 0) && params.volume == 0,
    }
}

/** オペーレータの音色情報です。各ノートからは共通参照とします。 */
let operatorsParamsEx: OperatorsParams<OperatorParamsEx> = initOperatorsParams.map(p => convertOperatorParamsToEx(p)) as OperatorsParams<OperatorParamsEx>;

class Oscillator {
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

class Operator {
    oldOpValue = 0;
    newOpValue = 0;
    readonly oscillator = new Oscillator();

    constructor(readonly params: OperatorParamsEx) { }
}

/** キーボードの1音に対応する音を管理するものです。 */
class SynthNote {
    private operators: Operator[];
    private mod = new Oscillator();
    private sampleIndex = 0;

    noteOffSec?: number;
    fadeOutStartSec?: number;

    constructor(readonly note: MidiNote) {    
        this.operators = operatorsParamsEx.map(params => new Operator(params));
    }

    get curSec() { return this.sampleIndex / sampleRate; }

    generateSample(output: number[]): boolean {
        this.mod.addPhase(5);
        const freq = midiNoteToFrequency(this.note /*+ this.mod.getValue() * 0.1*/);
        const curSec = this.curSec;
        let isContinue = false;

        for (let opIdx = 0; opIdx < this.operators.length; opIdx++) {
            const op = this.operators[opIdx];
            const params = op.params;
            if (params.sleep) { continue; }

            // モジューレーターは一つ前の値（oldOpValue）を使うと仕組みが簡単になる
            const mod = this.operators.reduce((prev, op2) => prev + op2.params.sendDepths[opIdx] * op2.oldOpValue, 0);
            op.newOpValue = op.oscillator.getValue(mod);

            if (params.volume > 0) {
                let amp = calcEnvelope(params.ampEnvelope, curSec, this.noteOffSec);
                if (amp != null) {
                    // ノートが重なる場合の短いフェードアウト処理
                    /*if (this.fadeOutStartSec != null) {
                        const fadeAmp = interpolate(this.fadeOutStartSec, 1, this.fadeOutStartSec + fadeOutSec, 0, 0, curSec);
                        if (fadeAmp != null) {
                            isContinue = true;
                            amp *= fadeAmp;
                        }
                    } else*/ {
                        isContinue = true;
                    }
                    
                    panning(op.newOpValue * amp * params.volume, params.pan, output);
                }
            }

            op.oscillator.addPhase(freq * params.frequencyRatio + params.frequencyOffsetHz);
        }

        // 計算結果をoldへ格納する
        for (const op of this.operators) {
            op.oldOpValue = op.newOpValue;
        }

        this.sampleIndex++;
        return isContinue;
    }
}

export class SynthProcessor extends AudioWorkletProcessor {
    private readonly synthNoteMap = new Map<MidiNote, SynthNote>();
    //private readonly fadeOutNotes: SynthNote[] = [];

    constructor() {
        super();
        this.listenMessages();
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
        const output = outputs[0];
        const leftChannel = output[0];
        const rightChannel = output[1];
        const masterVolume = 0.2;


        for (let i = 0; i < leftChannel.length; i++) {

            const wave = [0, 0];
            for (const note of Array.from(this.synthNoteMap.values())) {
                if (!note.generateSample(wave)) {
                    this.synthNoteMap.delete(note.note);
                }
            }

            /*for (let j = this.fadeOutNotes.length - 1; j >= 0; j--) {
                if (!this.fadeOutNotes[j].generateSample(wave)) {
                    this.fadeOutNotes.splice(j);
                }
            }*/

            leftChannel[i] = wave[0] * masterVolume;
            rightChannel[i] = wave[1] * masterVolume;
        }

        return true;
    }

    private listenMessages() {
        this.port.onmessage = e => {
            const msg = e.data as SynthMessage;
            //console.log(e.data);
            switch (msg.type) {
                case "NoteOn":
                    this.noteOn(msg.note);
                    break;
                case "NoteOff":
                    this.noteOff(msg.note);
                    break;
            }
        };
    }

    private noteOn(note: MidiNote): void {
        const oldNote = this.synthNoteMap.get(note);
        if (oldNote != null && oldNote.noteOffSec == null) { return; }
        /*if (oldNote != null && oldNote.noteOffSec != null) {
            oldNote.fadeOutStartSec = oldNote.curSec;
            this.fadeOutNotes.push(oldNote);
        }*/
        this.synthNoteMap.set(note, new SynthNote(note));
    }

    private noteOff(note: MidiNote): void {
        const synthNote = this.synthNoteMap.get(note);
        if (synthNote == null) {
            return;
        }
        if (synthNote.noteOffSec == null) {
            synthNote.noteOffSec = synthNote.curSec;
        }
    }
}