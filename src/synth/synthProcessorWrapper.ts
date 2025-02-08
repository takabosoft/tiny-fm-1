import { MidiNote, SynthMessage } from "./synthMessage";

/** `SynthProcessor`へメッセージを送る係 */
export class SynthProcessorWrapper {
    constructor(private readonly node: AudioWorkletNode) {}

    private send(msg: SynthMessage): void {
        this.node.port.postMessage(msg);
    }

    noteOn(note: MidiNote) {
        this.send({ type: "NoteOn", note });
    }

    noteOff(note: MidiNote) {
        this.send({ type: "NoteOff", note });
    }
}