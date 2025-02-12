import { Component } from "./component";
import { Knob } from "./knob";

/** タイトル＋つまみ＋編集ボックス */
export class KnobWithInput extends Component {
    private readonly input = $(`<input type="number" step="any">`);
    private readonly knob: Knob;

    constructor(
        size: number,
        label: string,
        min: number,
        max: number,
        value: number,
        resetValue: number,
        centerValue: number | undefined,
        private readonly fractionDigits: number | undefined,
        onInput: (newVal: number) => void,
    ) {
        super();
        this.knob = new Knob(size, min, max, value, resetValue, centerValue, newVal => {
            this.knobToInput();
            onInput(newVal);
        });
        this.element = $(`<div class="knob-with-input">`).append(
            $(`<h5>`).text(label),
            this.knob.element,
            this.input,
        );
        this.knobToInput();

        this.input.on("change", () => {
            const oldValue = this.knob.value;
            const newValue = parseFloat(this.input.val() + "");
            if (isNaN(newValue)) { 
                this.knobToInput();
                return;
            }
            this.knob.value = newValue;
            if (this.knob.value != oldValue) {
                this.knobToInput();
                onInput(this.knob.value);
            }
        }).on("keydown", e => {
            if (e.key == "Enter") {
                this.input.trigger("blur");
            } else if (e.key == "Escape") {
                this.knobToInput();
                this.input.trigger("blur");
            }
        }).css({
            width: size,
        });
    }

    get value() { return this.knob.value; }
    set value(v) {
        const oldValue = this.knob.value;
        this.knob.value = v;
        if (this.knob.value != oldValue) {
            this.knobToInput();
        }
    }

    /** のぶの値をInputへ反映します。 */
    private knobToInput(): void {
        this.input.val(this.knob.value.toFixed(this.fractionDigits));
    }
}
