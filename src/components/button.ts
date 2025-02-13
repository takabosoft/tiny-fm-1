import { Component } from "./component";

export class Button extends Component {
    constructor(text: string, onClick: () => void) {
        super();
        this.element = $(`<button class="btn">`).text(text).on("click", onClick);
    }
}