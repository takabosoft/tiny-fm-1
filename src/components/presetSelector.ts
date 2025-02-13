import { presets } from "../presets/presets";
import { SynthPatch } from "../synth/synthPatch";
import { Component } from "./component";

/** プリセットセレクターです。見た目はボタンです。  */
export class PresetSelector extends Component {
    constructor(onPresetSelect: (synthPatch: SynthPatch) => void) {
        super();
        this.element = $(`<select class="btn">`).append(
            $(`<option>`).text("Preset"),
            presets.map(p => $(`<option>`).text(p.name)),
        ).on("change", () => {
            if (this.selectedIndex > 0) {
                onPresetSelect(presets[this.selectedIndex - 1]);
            }
            this.selectedIndex = 0;
        });
    }

    private get selectEl() { return this.element[0] as HTMLSelectElement; }
    get selectedIndex() { return this.selectEl.selectedIndex; }
    set selectedIndex(i: number) { this.selectEl.selectedIndex = i; }
}