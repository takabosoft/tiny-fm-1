import { oscCount } from "../synth/const";
import { Component } from "./component";
import { KnobWithInput } from "./knobWithInput";

const knobSize = 60;

export class OscillatorPanel extends Component {
    private readonly ratioKnob = new KnobWithInput(knobSize, "Ratio", 0, 64, 1, 1, undefined, 3, () => {});
    private readonly offsetKnob = new KnobWithInput(knobSize, "Offset(Hz)", 0, 9999, 0, 0, undefined, 2, () => {});
    private readonly sendKnobs: KnobWithInput[] = [];
    private readonly volumeKnob = new KnobWithInput(knobSize, "Volume", 0, 1, 0, 0, undefined, 3, () => {});
    private readonly panKnob = new KnobWithInput(knobSize, "Pan", -1, 1, 0, 0, 0, 3, () => {});
    private readonly ampEnvAttackKnob = new KnobWithInput(knobSize, "Attack(s)", 0, 4, 0, 0, undefined, 3, () => {});
    private readonly ampEnvAttackShapeKnob = new KnobWithInput(knobSize, "A Shape", -1, 1, 0, 0, 0, 2, () => {});
    private readonly ampEnvDecayKnob = new KnobWithInput(knobSize, "Decay(s)", 0, 4, 0, 0, undefined, 3, () => {});
    private readonly ampEnvDecayShapeKnob = new KnobWithInput(knobSize, "D Shape", -1, 1, 0, 0, 0, 2, () => {});
    private readonly ampEnvSustainKnob = new KnobWithInput(knobSize, "Sustain", 0, 1, 1, 1, undefined, 3, () => {});
    private readonly ampEnvReleaseKnob = new KnobWithInput(knobSize, "Release(s)", 0.001, 4, 0, 0.001, undefined, 3, () => {});
    private readonly ampEnvReleaseShapeKnob = new KnobWithInput(knobSize, "R Shape", -1, 1, 0, 0, 0, 2, () => {});

    constructor(private readonly oscIdx: number) {
        super();

        for (let i = 0; i < oscCount; i++) {
            this.sendKnobs.push(new KnobWithInput(knobSize, `Send ${"ABCDEF"[i]}`, 0, 10, 0, 0, 0, 3, () => {}));
        }

        this.element = $(`<div class="oscillator-panel">`).append(
            $(`<div class="title">`).text(`OSC ${"ABCDEF"[oscIdx]}`),
            this.ratioKnob.element,
            this.offsetKnob.element,
            $(`<div class="sp">`),
            ...this.sendKnobs.map(k => k.element),
            $(`<div class="sp">`),
            this.ampEnvAttackKnob.element,
            this.ampEnvAttackShapeKnob.element,
            this.ampEnvDecayKnob.element,
            this.ampEnvDecayShapeKnob.element,
            this.ampEnvSustainKnob.element,
            this.ampEnvReleaseKnob.element,
            this.ampEnvReleaseShapeKnob.element,
            $(`<div class="sp">`),
            this.volumeKnob.element,
            this.panKnob.element,
        );

        
    }
}