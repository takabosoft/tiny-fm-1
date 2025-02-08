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

    constructor(private readonly ratio = 1, private readonly offset = 0) {
    }

    getValue(fm = 0): number {
        return Math.sin(this.phase * PI2 + fm);
    }

    addPhase(baseFrequency: number) {  
        this.phase += (baseFrequency * this.ratio + this.offset) / sampleRate;
        this.phase %= 1;
    }
}

let testVal = 0;

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

/** キーボードの1音に対応する音を管理するものです。 */
class SynthNote {
    private frequency: number; 
    private oscA: Oscillator;
    private oscB: Oscillator;
    private oscC: Oscillator;
    private oscD: Oscillator;
    private oscE: Oscillator;
    private oscF: Oscillator;
    private mod = new Oscillator(1, 0);

    constructor(note: number) {
        this.frequency = midiNoteToFrequency(note);
        this.oscA = new Oscillator(2, -0.6);
        this.oscB = new Oscillator();
        this.oscC = new Oscillator(2, 0.4);
        this.oscD = new Oscillator();
        this.oscE = new Oscillator(5.4969, 2000);
        this.oscF = new Oscillator(2);
    }

    generateSample(output: number[]): void {
        this.mod.addPhase(5);
        const freq = this.frequency + this.mod.getValue() * 2;

        this.oscA.addPhase(freq);
        this.oscB.addPhase(freq);
        this.oscC.addPhase(freq);
        this.oscD.addPhase(freq);
        this.oscE.addPhase(freq);
        this.oscF.addPhase(freq);

        const val = (
            this.oscA.getValue() * 0.43 + 
            this.oscB.getValue(this.oscA.getValue() * convertModulationAmplitude(27)) * 0.41 +
            this.oscC.getValue() * 0.20 +
            this.oscD.getValue(this.oscC.getValue() * convertModulationAmplitude(33)) * 0.52 +
            this.oscF.getValue(this.oscE.getValue() * convertModulationAmplitude(27)) * 0.16
        );

        //output[0] += val;
        panning(val, testVal, output);
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