import { Preset } from "../presets/preset";
import { SynthProcessorWrapper } from "../synth/synthProcessorWrapper";
import { Component } from "./component";
import { KnobWithInput } from "./knobWithInput";
import { PresetSelector } from "./presetSelector";
import { SpectrumAnalyzer } from "./spectrumAnalyzer";

const knobSize = 60;

export class HeaderPanel extends Component {
    readonly presetSelector: PresetSelector;
    private readonly spectrumAnalyzer: SpectrumAnalyzer;
    private readonly masterVolumeKnob = new KnobWithInput(knobSize, "M.Volume", 0, 0.7, 0.3, 0.3, undefined, 3, vol => this.masterGainNode.gain.value = vol);
    private readonly polyphonyKnob = new KnobWithInput(knobSize, "Polyphony", 1, 99, 10, 10, undefined, 0, poly => this.synthProcessor.polyphony = poly);

    constructor(private readonly synthProcessor: SynthProcessorWrapper, private readonly masterGainNode: GainNode, analyserNode: AnalyserNode, onPresetSelect: (preset: Preset) => void) {
        super();
        this.presetSelector = new PresetSelector(onPresetSelect);
        this.spectrumAnalyzer = new SpectrumAnalyzer(analyserNode);
        this.element = $(`<div class="header-panel">`).append(
            $(`<div>`).append(
                $(`<div class="title">`).text("TinyFM1"),
                $(`<div class="copyright">(C) <a href="https://takabosoft.com" target="_blank">Takabo Soft</a></div>`),
            ),
            this.presetSelector.element,
            $(`<div class="align-right">`),
            this.spectrumAnalyzer.element,
            this.polyphonyKnob.element.css("margin-right", 8),
            this.masterVolumeKnob.element,
        );
        
        // 初期値をUIと同期
        masterGainNode.gain.value = this.masterVolumeKnob.value;
        this.synthProcessor.polyphony = this.polyphonyKnob.value;
    }
}