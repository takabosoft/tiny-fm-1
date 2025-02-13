import { Component } from "./component";

const maxLength = 128;

function truncateToMaxLength(input: string): string {
    let trimmed = [...input].slice(0, maxLength).join(''); // スプレッド構文でコードポイント単位に分解
    return trimmed;
}

export class PatchNameInput extends Component {
    constructor() {
        super();
        this.element = $(`<input type="text" maxlength="${maxLength}" placeholder="Unnamed Patch" class="patch-name-input">`);
    }

    get name() {
        return truncateToMaxLength(this.element.val() + "");
    }
    set name(name: string) {
        this.element.val(truncateToMaxLength(name));
    }
}