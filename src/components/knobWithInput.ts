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
            this.toInput();
            onInput(newVal);
        });
        this.element = $(`<div class="knob-with-input">`).append(
            $(`<h5>`).text(label),
            this.knob.element,
            this.input,
        );
        this.toInput();

        this.input.on("change", () => {
            const oldValue = this.knob.value;
            this.knob.value = parseFloat(this.input.val() + "");
            if (this.knob.value != oldValue) {
                onInput(this.knob.value);
            }
        }).css({
            width: size,
        });
    }

    private toInput(): void {
        this.input.val(this.knob.value.toFixed(this.fractionDigits));
    }
}
