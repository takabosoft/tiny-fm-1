/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
 * Release Build: npx webpack --mode=production
 */

$(() => {
    console.log("OK");
    new PageController().start();
});

class PageController {
    private readonly audioContext = new AudioContext();

    async start() {
        await this.audioContext.audioWorklet.addModule("synth.bundle.js");
        const myProcessorNode = new AudioWorkletNode(this.audioContext, "MyProcessor");
        myProcessorNode.connect(this.audioContext.destination);
        document.addEventListener("click", () => this.audioContext.resume(), true);
    }
}