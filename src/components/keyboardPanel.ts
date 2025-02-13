import { SynthProcessorWrapper } from "../synth/synthProcessorWrapper";
import { Component } from "./component";
import { KnobWithInput } from "./knobWithInput";
import { MidiInSelector } from "./midiInSelector";
import { VirtualKeyboard } from "./virtualKeyboard";

const knobSize = 60;

export class KeyboardPanel extends Component {
    private readonly bendRangeKnob = new KnobWithInput(knobSize, "Bend Range", 0, 12, 2, 2, undefined, 3, () => this.onPatchEdit());
    private readonly pitchBendKnob = new KnobWithInput(knobSize, "Pitch Bend", -1, 1, 0, 0, 0, 3, bend => this.synthProcessor.pitchBend = bend);
    private readonly modulationFreqKnob = new KnobWithInput(knobSize, "Mod Freq", 1, 10, 5, 5, undefined, 3, () => this.onPatchEdit());
    private readonly modulationKnob = new KnobWithInput(knobSize, "Modulation", 0, 1, 0, 0, undefined, 3, mod => this.synthProcessor.modulation = mod);
    private readonly scrollKnob = new KnobWithInput(knobSize, "Scroll", 0, 127, 64, 64, 64, 0, () => this.scrollVirtualKeyboard());

    constructor(private readonly synthProcessor: SynthProcessorWrapper, readonly virtualKeyboard: VirtualKeyboard, private readonly onPatchEdit: () => void) {
        super();
        this.element = $(`<div class="keyboard-panel">`).append(
            $(`<div class="grid">`).append(
                this.bendRangeKnob.element,
                this.modulationFreqKnob.element,
                this.pitchBendKnob.element,
                this.modulationKnob.element,
            ),
            $(`<div class="key-v-stack">`).append(
                new MidiInSelector().element,
                $(`<div class="virtual-keyboard-wrapper">`).append(virtualKeyboard.element),
            ),
            this.scrollKnob.element
        );
    }

    get bendRange() { return this.bendRangeKnob.value; }
    /** UIのみ更新 */
    set bendRange(br: number) { this.bendRangeKnob.value = br; }
    /** UIのみ更新 */
    set pitchBend(bend: number) { this.pitchBendKnob.value = bend; }

    get modulationFreq() { return this.modulationFreqKnob.value; }
    /** UIのみ更新 */
    set modulationFreq(f: number) { this.modulationFreqKnob.value = f; }
    /** UIのみ更新 */
    set modulation(mod: number) { this.modulationKnob.value = mod; }

    scrollVirtualKeyboard(): void {
        this.virtualKeyboard.visibleKey(Math.floor(this.scrollKnob.value));
    }
}