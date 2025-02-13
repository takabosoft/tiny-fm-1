import { midiInManager } from "../midi/midiInManager";
import { tinyFM1LocalStorage } from "../tinyFM1LocalStorage";
import { Component } from "./component";

export class MidiInSelector extends Component {
    constructor() {
        super();

        midiInManager.curDeviceName = tinyFM1LocalStorage.midiInName;

        this.element = $(`<select class="midi-in-selector">`).append(
            $(`<option>`).text("MIDI IN Device").val(""),
            midiInManager.names.map(n => $(`<option>`).text(n).val(n))
        );

        (this.element[0] as HTMLSelectElement).selectedIndex = midiInManager.names.indexOf(midiInManager.curDeviceName) + 1;
        
        this.element.on("change", () => {
            const devName = this.element.val() + "";
            midiInManager.curDeviceName = devName;
            tinyFM1LocalStorage.midiInName = devName;
        });
    }
}