import { MidiNote, SynthMessage } from "./synthMessage";

const PI2 = 2 * Math.PI;
let testVal = 0;

function midiNoteToFrequency(note: MidiNote): number {
    return 440 * Math.pow(2, (note - MidiNote.A4) / 12);
}

function convertModulationAmplitude(v: number): number {
    return v * v / 4800 * PI2;
}

function convertModulationAmplitudeForFeedback(v: number): number {
    return v * v / 9600 * PI2;
}

function convertPan(pan: number): number {
    return pan / 99;
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

/** オペレーターの音色情報の型 */
interface OperatorParams {
    readonly frequencyRatio: number,
    readonly frequencyOffsetHz: number,
    /** モジューレータの振幅 */
    readonly depths: readonly number[],
    readonly volume: number,
    readonly pan: number,
}

/** オペーレータの音色情報です。各ノートからは共通参照とします。 */
let operatorParams: readonly OperatorParams[] = [
    {
        frequencyRatio: 2,
        frequencyOffsetHz: -0.6,
        depths: [0, 0, 0, 0, 0, 0],
        volume: 0.39,
        pan: convertPan(-21),
    },
    {
        frequencyRatio: 1,
        frequencyOffsetHz: 0,
        depths: [convertModulationAmplitude(27), 0, 0, 0, 0, 0],
        volume: 0.41,
        pan: convertPan(-19),
    },
    {
        frequencyRatio: 2,
        frequencyOffsetHz: 0.4,
        depths: [0, 0, 0, 0, 0, 0],
        volume: 0.2,
        pan: convertPan(-15),
    },
    {
        frequencyRatio: 1,
        frequencyOffsetHz: 0,
        depths: [0, 0, convertModulationAmplitude(33), 0, 0, 0],
        volume: 0.52,
        pan: convertPan(28),
    },
    {
        frequencyRatio: 5.4969,
        frequencyOffsetHz: 2000,
        depths: [0, 0, 0, 0, 0, 0],
        volume: 0,
        pan: 0,
    },
    {
        frequencyRatio: 2,
        frequencyOffsetHz: 0,
        depths: [0, 0, 0, 0, convertModulationAmplitude(26), 0],
        volume: 0.16,
        pan: 0,
    },
];

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

    constructor(readonly params: OperatorParams) { }
}

/** キーボードの1音に対応する音を管理するものです。 */
class SynthNote {
    private frequency: number;
    private operators: Operator[];
    private mod = new Oscillator();

    constructor(note: number) {
        this.frequency = midiNoteToFrequency(note);
        this.operators = operatorParams.map(params => new Operator(params));
    }

    generateSample(output: number[]): void {
        this.mod.addPhase(5);
        const freq = this.frequency /*+ this.mod.getValue() * 2*/;

        for (const op of this.operators) {
            const params = op.params;
            op.oscillator.addPhase(freq * params.frequencyRatio + params.frequencyOffsetHz);
            // モジューレーターは一つ前の値（oldOpValue）を使うと仕組みが簡単になる
            const mod = params.depths.reduce((prev, depth, opIdx2) => prev + depth * this.operators[opIdx2].oldOpValue, 0);
            op.newOpValue = op.oscillator.getValue(mod);
            panning(op.newOpValue * params.volume, params.pan, output);
        }

        // 計算結果をoldへ格納する
        for (const op of this.operators) {
            op.oldOpValue = op.newOpValue;
        }
    }
}

export class SynthProcessor extends AudioWorkletProcessor {
    private readonly synthNoteMap = new Map<MidiNote, SynthNote>();

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
            for (const note of this.synthNoteMap.values()) {
                note.generateSample(wave);
            }

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
                case "Test":
                    testVal = msg.val;
                    break;
            }
        };
    }

    private noteOn(note: MidiNote): void {
        const oldNote = this.synthNoteMap.get(note);
        if (oldNote != null) { return; }
        this.synthNoteMap.set(note, new SynthNote(note));
    }

    private noteOff(note: MidiNote): void {
        const synthNote = this.synthNoteMap.get(note);
        if (synthNote == null) {
            return;
        }
        this.synthNoteMap.delete(note);
    }
}