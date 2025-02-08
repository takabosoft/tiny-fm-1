import { MidiNote, SynthMessage } from "./synthMessage";

function midiNoteToFrequency(note: MidiNote): number {
    return 440 * Math.pow(2, (note - MidiNote.A4) / 12);
}

function convertModulationAmplitude(v: number): number {
    return v * v / 4800 * PI2;
}

const PI2 = 2 * Math.PI;

class Oscillator {
    private phase = 0;
    private readonly delta: number;

    constructor(frequency: number) {
        this.delta = frequency / sampleRate;
    }

    getValue(fm = 0): number {
        return Math.sin(this.phase * PI2 + fm);
    }

    addPhase() {  
        this.phase += this.delta;
        this.phase %= 1;
    }
}

let testVal = 0;

/** キーボードの1音に対応する音を管理するものです。 */
class SynthNote {
    private oscA: Oscillator;
    private oscB: Oscillator;
    private oscC: Oscillator;
    private oscD: Oscillator;
    private oscE: Oscillator;
    private oscF: Oscillator;

    constructor(note: number) {
        const freq = midiNoteToFrequency(note);
        this.oscA = new Oscillator(freq * 2 - 0.6);
        this.oscB = new Oscillator(freq);
        this.oscC = new Oscillator(freq * 2 + 0.4);
        this.oscD = new Oscillator(freq);
        this.oscE = new Oscillator(freq * 5.4969 + 2000);
        this.oscF = new Oscillator(freq * 2);
    }

    get sample(): number {
        this.oscA.addPhase();
        this.oscB.addPhase();
        this.oscC.addPhase();
        this.oscD.addPhase();
        this.oscE.addPhase();
        this.oscF.addPhase();

        return (
            this.oscA.getValue() * 0.43 + 
            this.oscB.getValue(this.oscA.getValue() * convertModulationAmplitude(27)) * 0.41 +
            this.oscC.getValue() * 0.20 +
            this.oscD.getValue(this.oscC.getValue() * convertModulationAmplitude(33)) * 0.52 +
            this.oscF.getValue(this.oscE.getValue() * convertModulationAmplitude(27)) * 0.16
        );

        /*return (
            this.oscB.getValue(this.oscA.getValue() * convertModulationAmplitude(55))
        );*/
    }
}

export class SynthProcessor extends AudioWorkletProcessor {
    private readonly synthNoteMap = new Map<MidiNote, SynthNote>();

    constructor() {
        super();
        this.listenMessages();
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
        const output = outputs[0]; // 1つの出力チャネル

        // 各フレームごとにサイン波を生成
        for (let i = 0; i < output[0].length; i++) {

            let wave = 0;
            for (const note of this.synthNoteMap.values()) {
                wave += note.sample;
            }

            output[0][i] = wave * 0.2;
        }

        return true;
    }

    private listenMessages() {
        this.port.onmessage = e => {
            const msg = e.data as SynthMessage;
            console.log(e.data);
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