import { oscCount } from "../synth/const";
import { MidiNote } from "../synth/synthMessage";
import { SynthProcessorWrapper } from "../synth/synthProcessorWrapper";
import { Component } from "./component";
import { HeaderPanel } from "./headerPanel";
import { OperatorPanel } from "./operatorPanel";

export class SynthBody extends Component {
    private readonly keyNoteDefaultMap = new Map<string, MidiNote>([
        // 白鍵（C3 ~ B3）
        ["z", MidiNote.C3], ["x", MidiNote.D3], ["c", MidiNote.E3],
        ["v", MidiNote.F3], ["b", MidiNote.G3], ["n", MidiNote.A3],
        ["m", MidiNote.B3],

        // 黒鍵（C#3 ~ A#3）
        ["s", MidiNote.C_SHARP_3], ["d", MidiNote.D_SHARP_3],
        ["g", MidiNote.F_SHARP_3], ["h", MidiNote.G_SHARP_3],
        ["j", MidiNote.A_SHARP_3],

        // 高いオクターブ（C4 ~ E4）
        [",", MidiNote.C4], [".", MidiNote.D4], ["/", MidiNote.E4],

        // 黒鍵（C#4 ~ D#4）
        ["l", MidiNote.C_SHARP_4], [";", MidiNote.D_SHARP_4],
    ]);
    /** MIDI ON状態のノートをここで管理します。PCキーボード・マウスなど複数デバイスからありえない入力状態になるのを防ぎます。 */
    private readonly midiNoteOnSet = new Set<MidiNote>();
    /** PCキーボード情報 */
    private readonly pcKeyNoteStateMap = new Map<string, MidiNote>();
    private pcKeyOctaveShift = 1;

    constructor(private readonly synthProcessor: SynthProcessorWrapper) {
        super();

        this.element = $(`<div class="synth-body">`).append(
            new HeaderPanel().element,
        );

        for (let i = 0; i < oscCount; i++) {
            this.element.append(new OperatorPanel(i).element);
        }

        this.listenPCKeyboard();
    }

    private noteOn(note: MidiNote): void {
        if (this.midiNoteOnSet.has(note)) { return; }
        this.midiNoteOnSet.add(note);
        this.synthProcessor?.noteOn(note);
        //this.virtualKeyboard.selectKey(note, true);
    }

    private noteOff(note: MidiNote): void {
        if (!this.midiNoteOnSet.has(note)) { return; }
        this.midiNoteOnSet.delete(note);
        this.synthProcessor?.noteOff(note);
        //this.virtualKeyboard.selectKey(note, false);
    }

    private listenPCKeyboard(): void {
        document.addEventListener("keydown", e => {
            if (this.pcKeyNoteStateMap.has(e.key)) { return; } // キーボード連打阻止
            let note = this.keyNoteDefaultMap.get(e.key);
            if (note != null) {
                note += this.pcKeyOctaveShift * 12;
                if (note >= 0 && note <= 127) {
                    this.noteOn(note);
                    this.pcKeyNoteStateMap.set(e.key, note); // キーボードを押すときと離すときでNote#が変わる場合があり得るので保持しておく
                }
            }
        });

        document.addEventListener("keyup", e => {
            const note = this.pcKeyNoteStateMap.get(e.key);
            if (note != null) {
                this.noteOff(note);
                this.pcKeyNoteStateMap.delete(e.key);
            }
        });
    }
}