/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
 * Development Server(HTTPS): npx live-server docs --https=https.js
 * Release Build: npx webpack --mode=production
 */

import { SynthBody } from "./components/synthBody";
import { SynthProcessorWrapper } from "./synth/synthProcessorWrapper";

$(() => {
    console.log("OK");
    try {
        new PageController().start();
    } catch (e) {
        alert(e);
    }
});

class PageController {
    private readonly audioContext = new AudioContext();
    
    /** 仮想キーボード */
    /*private readonly virtualKeyboard = new VirtualKeyboard({
        height: 200,
        //minNote: MidiNote.A_SHARP_MINUS_1,
        onKeyDown: note => this.noteOn(note),
        onKeyUp: note => this.noteOff(note),
    });*/

    async start() {
        document.addEventListener("pointerdown", () => this.audioContext.resume(), true);
        document.addEventListener("keydown", () => this.audioContext.resume(), true);
        await this.audioContext.audioWorklet.addModule("synth.bundle.js");
        const myProcessorNode = new AudioWorkletNode(this.audioContext, "SynthProcessor", { outputChannelCount: [2] });

        myProcessorNode.connect(this.audioContext.destination);
        const synthBody = new SynthBody(new SynthProcessorWrapper(myProcessorNode));
        $("main").append(synthBody.element);

        /*const slider = $(`<input type="range" min="-1.0" max="1.0" step="0.01" style="width: 200px;">`).on("input", () => {
            //console.log(slider.val() ?? 0);
            this.synthProcessor?.test(parseFloat(slider.val() + ""));
        })
        $("body").append($(`<br>`), slider);*/


        //$("body").append($(`<div class="virtual-keyboard-wrapper">`).append(this.virtualKeyboard.element));
        //this.virtualKeyboard.visibleKey(MidiNote.C4);

        //this.listenPCKeyboard();
    }
}