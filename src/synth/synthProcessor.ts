import { MidiNote, SynthMessage } from "./synthMessage";

function midiNoteToFrequency(note: MidiNote): number {
    return 440 * Math.pow(2, (note - MidiNote.A4) / 12);
}

const PI2 = 2 * Math.PI;

/** キーボードの1音に対応する音を管理するものです。 */
class SynthNote {
    /** 位相（0.0～1.0） */
    private phase = 0;
    private delta: number;

    constructor(note: number) {
        this.delta = midiNoteToFrequency(note) / sampleRate;
    }

    get sample(): number {
        this.phase += this.delta; // 波形の位相を進める
        this.phase %= 1;
        return Math.sin(this.phase * PI2);
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

            output[0][i] = wave * 0.1;
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