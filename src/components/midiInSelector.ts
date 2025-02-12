import { midiInManager } from "../midi/midiInManager";
import { Component } from "./component";

export class MidiInSelector extends Component {
    constructor() {
        super();
        this.element = $(`<select class="midi-in-selector">`).append(
            $(`<option>`).text("MIDI IN Device").val(""),
            midiInManager.names.map(n => $(`<option>`).text(n).val(n))
        ).on("change", () => {
            midiInManager.curDeviceName = this.element.val() + "";
        });
    }
}