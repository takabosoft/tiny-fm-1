import { SynthProcessorWrapper } from "../synth/synthProcessorWrapper";
import { Component } from "./component";
import { KnobWithInput } from "./knobWithInput";
import { VirtualKeyboard } from "./virtualKeyboard";

const knobSize = 60;

export class KeyboardPanel extends Component {
    constructor(private readonly synthProcessor: SynthProcessorWrapper, readonly virtualKeyboard: VirtualKeyboard) {
        super();
        this.element = $(`<div class="keyboard-panel">`).append(
            $(`<div class="grid">`).append(
                new KnobWithInput(knobSize, "Bend Range", 0, 12, 2, 2, undefined, 3, () => {}).element,
                new KnobWithInput(knobSize, "Mod Freq",  1, 10, 5, 5, undefined, 3, () => {}).element,
                new KnobWithInput(knobSize, "Pitch Bend", -1, 1, 0, 0, 0, 3, () => {}).element,
                new KnobWithInput(knobSize, "Modulation", 0, 1, 0, 0, undefined, 3, () => {}).element,
            ),
            $(`<div class="key-v-stack">`).append(
                $(`<select class="midi-in">`),
                $(`<div class="virtual-keyboard-wrapper">`).append(virtualKeyboard.element)
            ),
        );
    }
}