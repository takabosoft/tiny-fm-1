import { MidiNote, SynthMessage } from "./synthMessage";
import { SynthPatch } from "./synthPatch";

/** `SynthProcessor`へメッセージを送る係 */
export class SynthProcessorWrapper {
    constructor(private readonly node: AudioWorkletNode) {}

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

    /**
     * パッチの変更
     * @param patch 
     */
    patch(patch: SynthPatch): void {
        this.send({ type: "Patch", patch });
    }
}