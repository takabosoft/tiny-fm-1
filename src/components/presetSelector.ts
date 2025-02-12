import { Preset } from "../presets/preset";
import { presets } from "../presets/presets";
import { Component } from "./component";

export class PresetSelector extends Component {
    constructor(onPresetSelect: (preset: Preset) => void) {
        super();
        this.element = $(`<select class="preset-selector">`).append(
            presets.map(p => $(`<option>`).text(p.name)),
        ).on("change", () => {
            onPresetSelect(presets[this.selectedIndex]);
        });
    }

    private get selectEl() { return this.element[0] as HTMLSelectElement; }
    get selectedIndex() { return this.selectEl.selectedIndex; }
    
    selectByName(name: string): void {
        this.selectEl.selectedIndex = presets.findIndex(p => p.name == name);
    }
}