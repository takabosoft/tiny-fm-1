/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
 * Development Server(HTTPS): npx live-server docs --https=https.js
 * Release Build: npx webpack --mode=production
 */

import { VirtualKeyboard } from "./components/virtualKeyboard";
import { MidiNote } from "./synth/synthMessage";
import { SynthProcessorWrapper } from "./synth/synthProcessorWrapper";

$(() => {
    console.log("OK");
    new PageController().start();
});

class PageController {
    private readonly audioContext = new AudioContext();
    private synthProcessor?: SynthProcessorWrapper;
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
    /** 仮想キーボード */
    private readonly virtualKeyboard = new VirtualKeyboard({
        height: 200,
        //minNote: MidiNote.A_SHARP_MINUS_1,
        onKeyDown: note => this.noteOn(note),
        onKeyUp: note => this.noteOff(note),
    });
    private octaveShift = 1;

    async start() {
        document.addEventListener("pointerdown", () => this.audioContext.resume(), true);
        document.addEventListener("keydown", () => this.audioContext.resume(), true);
        await this.audioContext.audioWorklet.addModule("synth.bundle.js");
        const myProcessorNode = new AudioWorkletNode(this.audioContext, "SynthProcessor", { outputChannelCount: [2] });
        myProcessorNode.connect(this.audioContext.destination);
        this.synthProcessor = new SynthProcessorWrapper(myProcessorNode);

        /*const slider = $(`<input type="range" min="-1.0" max="1.0" step="0.01" style="width: 200px;">`).on("input", () => {
            //console.log(slider.val() ?? 0);
            this.synthProcessor?.test(parseFloat(slider.val() + ""));
        })
        $("body").append($(`<br>`), slider);*/


        $("body").append($(`<div class="virtual-keyboard-wrapper">`).append(this.virtualKeyboard.element));
        this.virtualKeyboard.visibleKey(MidiNote.C4);

        this.listenPCKeyboard();
    }

    private noteOn(note: MidiNote): void {
        if (this.midiNoteOnSet.has(note)) { return; }
        this.midiNoteOnSet.add(note);
        this.synthProcessor?.noteOn(note);
        this.virtualKeyboard.selectKey(note, true);
    }

    private noteOff(note: MidiNote): void {
        if (!this.midiNoteOnSet.has(note)) { return; }
        this.midiNoteOnSet.delete(note);
        this.synthProcessor?.noteOff(note);
        this.virtualKeyboard.selectKey(note, false);
    }

    private listenPCKeyboard(): void {
        document.addEventListener("keydown", e => {
            if (this.pcKeyNoteStateMap.has(e.key)) { return; } // キーボード連打阻止
            let note = this.keyNoteDefaultMap.get(e.key);
            if (note != null) {
                note += this.octaveShift * 12;
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