import { MidiNote, SynthMessage } from "./synthMessage";
import { SynthPatch } from "./synthPatch";

/** `SynthProcessor`へメッセージを送る係 */
export class SynthProcessorWrapper {
    readonly node: AudioWorkletNode;

    constructor(audioContext: AudioContext) {
        this.node = new AudioWorkletNode(audioContext, "SynthProcessor", { outputChannelCount: [2] });        
    }

    private send(msg: SynthMessage): void {
        this.node.port.postMessage(msg);
    }

    /**
     * ノートオン
     * @param note 
     */
    noteOn(note: MidiNote): void {
        this.send({ type: "NoteOn", note });
    }

    /**
     * ノートオフ
     * @param note 
     */
    noteOff(note: MidiNote): void {
        this.send({ type: "NoteOff", note });
    }

    /** ピッチベンド変更 */
    set pitchBend(pitchBend: number) {
        this.send({ type: "PitchBend", pitchBend });
    }

    /** モジュレーション変更 */
    set modulation(modulation: number) {
        this.send({ type: "Modulation", modulation });
    }

    /** パッチの変更 */
    set patch(patch: SynthPatch) {
        this.send({ type: "Patch", patch });
    }

    /** 最大同時発音数の変更 */
    set polyphony(polyphony: number) {
        this.send({ type: "Polyphony", polyphony: Math.floor(polyphony) });
    }
}