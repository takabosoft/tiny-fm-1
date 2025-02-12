import { SynthProcessorWrapper } from "../synth/synthProcessorWrapper";
import { Component } from "./component";
import { KnobWithInput } from "./knobWithInput";

const knobSize = 60;

export class HeaderPanel extends Component {
    private readonly masterVolumeKnob = new KnobWithInput(knobSize, "M.Volume", 0, 0.7, 0.2, 0.2, undefined, 3, vol => this.masterGainNode.gain.value = vol);
    private readonly polyphonyKnob = new KnobWithInput(knobSize, "Polyphony", 1, 99, 10, 10, undefined, 0, poly => this.synthProcessor.polyphony = poly);

    constructor(private readonly synthProcessor: SynthProcessorWrapper, private readonly masterGainNode: GainNode) {
        super();
        this.element = $(`<div class="header-panel">`).append(
            $(`<div>`).append(
                $(`<div class="title">`).text("TinyFM1"),
                $(`<div class="copyright">(C) <a href="https://takabosoft.com" target="_blank">Takabo Soft</a></div>`),
            ),
            $(`<div class="align-right">`),
            this.polyphonyKnob.element.css("margin-right", 8),
            this.masterVolumeKnob.element,
            //$(`<div class="sp">`),
        );
        
        // 初期値をUIと同期
        masterGainNode.gain.value = this.masterVolumeKnob.value;
        this.synthProcessor.polyphony = this.polyphonyKnob.value;
    }
}