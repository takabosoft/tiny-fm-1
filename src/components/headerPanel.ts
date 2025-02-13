import { tinyFM1LocalStorage } from "../tinyFM1LocalStorage";
import { SynthProcessorWrapper } from "../synth/synthProcessorWrapper";
import { Component } from "./component";
import { masterVolumeDefault, polyphonyDefault } from "./const";
import { KnobWithInput } from "./knobWithInput";
import { PresetSelector } from "./presetSelector";
import { SpectrumAnalyzer } from "./spectrumAnalyzer";
import { SynthPatch } from "../synth/synthPatch";
import { PatchNameInput } from "./patchNameInput";
import { Button } from "./button";

const knobSize = 60;

export class HeaderPanel extends Component {
    readonly patchNameInput = new PatchNameInput()
    private readonly presetSelector: PresetSelector;
    private readonly spectrumAnalyzer: SpectrumAnalyzer;
    private readonly masterVolumeKnob = new KnobWithInput(knobSize, "M.Volume", 0, 0.7, tinyFM1LocalStorage.masterVolume, masterVolumeDefault, undefined, 3, vol => {
        this.masterGainNode.gain.value = vol;
        tinyFM1LocalStorage.masterVolume = vol;
    });
    private readonly polyphonyKnob = new KnobWithInput(knobSize, "Polyphony", 1, 99, tinyFM1LocalStorage.polyphony, polyphonyDefault, undefined, 0, poly => {
        this.synthProcessor.polyphony = poly;
        tinyFM1LocalStorage.polyphony = poly;
    });

    constructor(
        private readonly synthProcessor: SynthProcessorWrapper, 
        private readonly masterGainNode: GainNode, 
        analyserNode: AnalyserNode, 
        onPresetSelect: (preset: SynthPatch) => void, 
        onSave: () => void,
        onSharePatchToX: () => void,
    ) {
        super();
        this.presetSelector = new PresetSelector(onPresetSelect);
        this.spectrumAnalyzer = new SpectrumAnalyzer(analyserNode);
        this.element = $(`<div class="header-panel">`).append(
            $(`<div>`).append(
                $(`<div class="title">`).text("TinyFM1"),
                $(`<div class="copyright">(C) <a href="https://takabosoft.com" target="_blank">Takabo Soft</a></div>`),
            ),
            this.patchNameInput.element,
            $(`<div class="buttons">`).append(
                this.presetSelector.element,
                new Button("Save", onSave).element,
                new Button("Share Patch to X", onSharePatchToX).element,
                new Button("Doc", () => window.open("https://github.com/takabosoft/tiny-fm-1", "_blank")).element,
                
            ),
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