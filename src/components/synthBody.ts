import { oscCount } from "../synth/const";
import { SynthProcessorWrapper } from "../synth/synthProcessorWrapper";
import { Component } from "./component";
import { HeaderPanel } from "./headerPanel";
import { OscillatorPanel } from "./oscillatorPanel";

export class SynthBody extends Component {
    constructor(private readonly synthProcessor: SynthProcessorWrapper) {
        super();

        this.element = $(`<div class="synth-body">`).append(
            new HeaderPanel().element,
        );

        for (let i = 0; i < oscCount; i++) {
            this.element.append(new OscillatorPanel(i).element);
        }
    }
}