/**
 * MIDI入力をいろいろするクラスです。
 * - HACK: `Manager`は名付け的に負けた感ある
 */
class MidiInManager {
    private midiInputs: MIDIInput[] = [];

    constructor() {
    }

    get names(): string[] {
        return this.midiInputs.map(i => i.name ?? "");
    }

    async initialize(): Promise<boolean> {
        if (navigator.requestMIDIAccess == null) { return false; }
        try {
            const access = await navigator.requestMIDIAccess();
            access.inputs.forEach(i => this.midiInputs.push(i));
            return true;
        } catch {
            return false;
        }
    }
}

export const midiInManager = new MidiInManager();