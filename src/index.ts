/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
 * Development Server(HTTPS): npx live-server docs --https=https.js
 * Release Build: npx webpack --mode=production
 */

import { SynthBody } from "./components/synthBody";
import { midiInManager } from "./midi/midiInManager";
import { SynthProcessorWrapper } from "./synth/synthProcessorWrapper";

$(() => {
    try {
        new PageController().start();
    } catch (e) {
        alert(e);
    }
});

class PageController {
    private readonly audioContext = new AudioContext({ latencyHint: "interactive" });
    async start() {
        document.addEventListener("pointerdown", () => this.audioContext.resume(), true);
        document.addEventListener("keydown", () => this.audioContext.resume(), true);
        await midiInManager.initialize();
        await this.audioContext.audioWorklet.addModule("synth.bundle.js");
        
        const synthBody = new SynthBody(this.audioContext);
        $("main").append(synthBody.element);
        synthBody.scrollVirtualKeyboard();
    }
}