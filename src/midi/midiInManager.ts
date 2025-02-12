/**
 * MIDI入力をいろいろするクラスです。
 * - HACK: `Manager`は名付け的に負けた感ある
 */
class MidiInManager {
    constructor() {
    }

    async initialize(): Promise<boolean> {
        if (navigator.requestMIDIAccess == null) { return false; }
        try {
            const access = await navigator.requestMIDIAccess();
            access.inputs.forEach(i => console.log(i.name));

            return true;
        } catch {
            return false;
        }
    }
}

export const midiInManager = new MidiInManager();