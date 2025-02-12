import { midiInManager } from "../midi/midiInManager";
import { Component } from "./component";

export class MidiInSelector extends Component {
    constructor(onChange: () => void) {
        super();
        this.element = $(`<select class="midi-in-selector">`).append(
            $(`<option>`).text("MIDI IN Device").val(""),
            midiInManager.names.map(n => $(`<option>`).text(n).val(n))
        ).on("change", () => {
            console.log(this.element.val() + "");
        });
    }
}