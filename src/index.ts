/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
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
    private readonly keyNoteStateMap = new Map<string, MidiNote>();
    private octaveShift = 1;

    async start() {
        document.addEventListener("click", () => this.audioContext.resume(), true);
        await this.audioContext.audioWorklet.addModule("synth.bundle.js");
        const myProcessorNode = new AudioWorkletNode(this.audioContext, "SynthProcessor", { outputChannelCount: [2] });
        myProcessorNode.connect(this.audioContext.destination);
        this.synthProcessor = new SynthProcessorWrapper(myProcessorNode);

        /*const slider = $(`<input type="range" min="-1.0" max="1.0" step="0.01" style="width: 200px;">`).on("input", () => {
            //console.log(slider.val() ?? 0);
            this.synthProcessor?.test(parseFloat(slider.val() + ""));
        })
        $("body").append($(`<br>`), slider);*/

        const keyboard = new VirtualKeyboard({
            height: 200,
            //minNote: MidiNote.A_SHARP_MINUS_1,
        });
        $("body").append($(`<br>`), $(`<div class="virtual-keyboard-wrapper">`).append(keyboard.element));

        document.addEventListener("keydown", e => {
            if (this.keyNoteStateMap.has(e.key)) { return; } // キーボード連打阻止
            let note = this.keyNoteDefaultMap.get(e.key);
            if (note != null) {
                note += this.octaveShift * 12;
                if (note >= 0 && note <= 127) {
                    this.synthProcessor?.noteOn(note);
                    this.keyNoteStateMap.set(e.key, note); // キーボードを押すときと離すときでNote#が変わる場合があり得るので保持しておく
                }
            }
        });

        document.addEventListener("keyup", e => {
            const note = this.keyNoteStateMap.get(e.key);
            if (note != null) {
                this.synthProcessor?.noteOff(note);
                this.keyNoteStateMap.delete(e.key);
            }
        });
    }
}