import { Component } from "./component";
import { KnobWithInput } from "./knobWithInput";

const knobSize = 60;

export class HeaderPanel extends Component {
    private readonly masterVolumeKnob = new KnobWithInput(knobSize, "M.Volume", 0, 0.5, 0.2, 0.2, undefined, 3, () => {});
    private readonly polyphonyKnob = new KnobWithInput(knobSize, "Polyphony", 1, 99, 10, 10, undefined, 0, () => {});

    constructor() {
        super();
        this.element = $(`<div class="header-panel">`).append(
            $(`<div class="title">`).text("TinyFM1"),
            $(`<div class="align-right">`),
            this.polyphonyKnob.element.css("margin-right", 8),
            this.masterVolumeKnob.element,
            $(`<div class="sp">`),
            $(`<div class="copyright">`).text("(C) 2025 Takabo Soft"),
        )
    }
}