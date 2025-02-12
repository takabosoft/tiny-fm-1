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
    onPitchBend?: (pitchBend: number) => void;
    onModulation?: (mod: number) => void;

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
        if (ev.data == null || ev.data.length == 0) { return; }
        const [status, data1, data2] = ev.data;

        const command = ev.data[0] & 0xf0; // チャンネル情報を無視
        if (command === 0x90 && data2 > 0) {
            // 複数タブで同時に利用できるため、アクティブなタブに制限します。
            if (!document.hidden) {
                this.onNoteOn?.(data1, data2);
            }
        } else if (command === 0x80 || (command === 0x90 && data2 === 0)) {
            this.onNoteOff?.(data1);
        } else if (command === 0xE0) {
            // ピッチベンド
            const pitchBendValue = (data2 << 7) | data1; // 14bit の値
            const normalizedValue = (pitchBendValue - 8192) / 8192; // -1.0 〜 +1.0 に正規化
            this.onPitchBend?.(normalizedValue);
        } else if (command === 0xB0 && data1 === 1) {
            // モジュレーション (CC#1)
            const modulationAmount = data2 / 127; // 0.0 〜 1.0 に正規化
            this.onModulation?.(modulationAmount);
        }
    }
}

export const midiInManager = new MidiInManager();