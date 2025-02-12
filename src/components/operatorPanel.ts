import { oscCount } from "../synth/const";
import { EnvelopeParams, releaseSecMin, shapeMax, shapeMin } from "../synth/envelope";
import { OperatorParams } from "../synth/operatorParams";
import { Component } from "./component";
import { EnvelopePreview } from "./envelopePreview";
import { KnobWithInput } from "./knobWithInput";

const knobSize = 60;

export class OperatorPanel extends Component {
    private readonly ratioKnob = new KnobWithInput(knobSize, "Ratio", 0, 64, 1, 1, undefined, 3, () => this.onChange());
    private readonly offsetKnob = new KnobWithInput(knobSize, "Offset(Hz)", 0, 9999, 0, 0, undefined, 2, () => this.onChange());
    private readonly sendKnobs: KnobWithInput[] = [];
    private readonly ampEnvAttackKnob = new KnobWithInput(knobSize, "Attack(s)", 0, 4, 0, 0, undefined, 3, () => this.onAmpEnvChange());
    private readonly ampEnvAttackShapeKnob = new KnobWithInput(knobSize, "A Shape", shapeMin, shapeMax, 0, 0, 0, 2, () => this.onAmpEnvChange());
    private readonly ampEnvDecayKnob = new KnobWithInput(knobSize, "Decay(s)", 0, 4, 0, 0, undefined, 3, () => this.onAmpEnvChange());
    private readonly ampEnvDecayShapeKnob = new KnobWithInput(knobSize, "D Shape", shapeMin, shapeMax, 0, 0, 0, 2, () => this.onAmpEnvChange());
    private readonly ampEnvSustainKnob = new KnobWithInput(knobSize, "Sustain", 0, 1, 1, 1, undefined, 3, () => this.onAmpEnvChange());
    private readonly ampEnvReleaseKnob = new KnobWithInput(knobSize, "Release(s)", releaseSecMin, 4, releaseSecMin, releaseSecMin, undefined, 3, () => this.onAmpEnvChange());
    private readonly ampEnvReleaseShapeKnob = new KnobWithInput(knobSize, "R Shape", shapeMin, shapeMax, 0, 0, 0, 2, () => this.onAmpEnvChange());
    private readonly envelopePreview = new EnvelopePreview();
    private readonly volumeKnob = new KnobWithInput(knobSize, "Volume", 0, 1, 0, 0, undefined, 3, () => this.onChange());
    private readonly panKnob = new KnobWithInput(knobSize, "Pan", -1, 1, 0, 0, 0, 3, () => this.onChange());

    constructor(oscIdx: number, private readonly onChange: () => void) {
        super();

        for (let i = 0; i < oscCount; i++) {
            this.sendKnobs.push(new KnobWithInput(knobSize, i == oscIdx ? "FeedBack" : `Send ${"ABCDEF"[i]}`, 0, 10, 0, 0, 0, 3, () => { }));
        }

        this.element = $(`<div class="operator-panel">`).append(
            $(`<div class="title">`).text(`OP ${"ABCDEF"[oscIdx]}`),
            this.ratioKnob.element,
            this.offsetKnob.element,
            $(`<div class="sp">`),
            this.sendKnobs.map(k => k.element),
            $(`<div class="sp">`),
            this.ampEnvAttackKnob.element,
            this.ampEnvAttackShapeKnob.element,
            this.ampEnvDecayKnob.element,
            this.ampEnvDecayShapeKnob.element,
            this.ampEnvSustainKnob.element,
            this.ampEnvReleaseKnob.element,
            this.ampEnvReleaseShapeKnob.element,
            this.envelopePreview.element,
            $(`<div class="sp">`),
            this.volumeKnob.element,
            this.panKnob.element,
        );
    }

    get envelopeParams(): EnvelopeParams {
        return {
            attackSec: this.ampEnvAttackKnob.value,
            attackShape: this.ampEnvAttackShapeKnob.value,
            decaySec: this.ampEnvDecayKnob.value,
            decayShape: this.ampEnvDecayShapeKnob.value,
            sustain: this.ampEnvSustainKnob.value,
            releaseSec: this.ampEnvReleaseKnob.value,
            releaseShape: this.ampEnvReleaseShapeKnob.value,
        }
    }

    get operatorParams(): OperatorParams {
        return {
            frequencyRatio: this.ratioKnob.value,
            frequencyOffsetHz: this.offsetKnob.value,
            sendDepths: [
                this.sendKnobs[0].value,
                this.sendKnobs[1].value,
                this.sendKnobs[2].value,
                this.sendKnobs[3].value,
                this.sendKnobs[4].value,
                this.sendKnobs[5].value,
            ],
            ampEnvelope: this.envelopeParams,
            volume: this.volumeKnob.value,
            pan: this.panKnob.value,
        }
    }
    set operatorParams(p: OperatorParams) {
        this.ratioKnob.value = p.frequencyRatio;
        this.offsetKnob.value = p.frequencyOffsetHz;
        this.sendKnobs.forEach((knob, idx) => knob.value = p.sendDepths[idx]);

        this.ampEnvAttackKnob.value = p.ampEnvelope.attackSec;
        this.ampEnvAttackShapeKnob.value = p.ampEnvelope.attackShape;
        this.ampEnvDecayKnob.value = p.ampEnvelope.decaySec;
        this.ampEnvDecayShapeKnob.value = p.ampEnvelope.decayShape;
        this.ampEnvSustainKnob.value = p.ampEnvelope.sustain;
        this.ampEnvReleaseKnob.value = p.ampEnvelope.releaseSec;
        this.ampEnvReleaseShapeKnob.value = p.ampEnvelope.releaseShape;
        this.envelopePreview.render(p.ampEnvelope);

        this.volumeKnob.value = p.volume;
        this.panKnob.value = p.pan;
    }

    private onAmpEnvChange(): void {
        this.envelopePreview.render(this.envelopeParams);
        this.onChange();
    }
}