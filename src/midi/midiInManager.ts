import { MidiNote } from "../synth/synthMessage";

/**
 * MIDI入力をいろいろするクラスです。
 * - HACK: `Manager`は名付け的に負けた感ある
 */
class MidiInManager {
    private midiInputs: MIDIInput[] = [];
    private _curDevice = "";

    onChangeCurDevice?: () => void;
    onNoteOn?: (note: MidiNote, velocity: number) => void;
    onNoteOff?: (note: MidiNote) => void;

    constructor() {
    }

    get names(): string[] {
        return this.midiInputs.map(i => i.name ?? "");
    }

    set curDeviceName(name: string) {
        if (this._curDevice == name) { return; }
        this._curDevice = name;

        const targetIdx = name.length > 0 ? this.midiInputs.findIndex(i => i.name == name) : -1;
        for (let i = 0; i < this.midiInputs.length; i++) {
            this.midiInputs[i].onmidimessage = null;
            if (i == targetIdx) {
                this.midiInputs[i].onmidimessage = ev => this.onMidiMessage(ev);
            }
        }

        this.onChangeCurDevice?.();
    }

    async initialize(): Promise<boolean> {
        if (navigator.requestMIDIAccess == null) { return false; }
        try {
            const access = await navigator.requestMIDIAccess();
            access.inputs.forEach(i => this.midiInputs.push(i));
            access.onstatechange = e => {
                console.log("midi state change");
            };
            return true;
        } catch {
            return false;
        }
    }

    private onMidiMessage(ev: MIDIMessageEvent): void {
        if (ev.data == null) { return; }
        const [status, note, velocity] = ev.data;

        const command = status & 0xf0;

        if (command === 0x90 && velocity > 0) {
            this.onNoteOn?.(note, velocity);
        } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
            this.onNoteOff?.(note);
        }
    }
}

export const midiInManager = new MidiInManager();