import { Rect } from "../geometries/rect";
import { MidiNote } from "../synth/synthMessage";
import { Component } from "./component";

export interface VirtualKeyboardOptions {
    readonly height?: number;
    readonly minNote?: MidiNote,
    readonly maxNote?: MidiNote,
    readonly whiteKeyWidth?: number;
}

function isWhiteKey(note: MidiNote): boolean {
    switch (note % 12) {
        case MidiNote.C_MINUS_1:
        case MidiNote.D_MINUS_1:
        case MidiNote.E_MINUS_1:
        case MidiNote.F_MINUS_1:
        case MidiNote.G_MINUS_1:
        case MidiNote.A_MINUS_1:
        case MidiNote.B_MINUS_1:
            return true;
    }
    return false;
}

function calcWhiteIndex(note: MidiNote): number {
    let idx = 0;
    for (let n = note % 12; n > 0; n--) {
        if (isWhiteKey(n)) {
            idx++;
        }
    }
    return idx;
}

/**
 * 取り急ぎキーボードに見えそうなものを生成します。
 * - スクロール的な機能は保有しません。
 * - 押された・離されたイベントを発行します。
 * - 各キーのオン・オフによってビジュアルを変化させます。
 */
export class VirtualKeyboard extends Component {
    private readonly height: number;
    private readonly minNote: MidiNote;
    private readonly maxNote: MidiNote;
    private readonly whiteKeyWidth: number;
    private readonly blackKeyWidth: number;

    constructor(options: VirtualKeyboardOptions = {}) {
        super();

        this.height = options.height ?? 200;
        this.minNote = options.minNote ?? 0;
        this.maxNote = options.maxNote ?? 127;
        this.whiteKeyWidth = options.whiteKeyWidth ?? 32;
        this.blackKeyWidth = Math.ceil(this.whiteKeyWidth * 0.8);

        this.element = $(`<div class="virtual-keyboard">`).css({
            height: this.height,
        });

        this.layout();
    }

    private layout() {
        this.element.empty();

        const firstWhiteKeyNote = isWhiteKey(this.minNote) ? this.minNote : this.minNote + 1;
        const firstOctave = Math.floor(firstWhiteKeyNote / 12);
        let x = -calcWhiteIndex(firstWhiteKeyNote) * this.whiteKeyWidth;
        //console.log(x)

        for (let note = firstOctave * 12; note <= this.maxNote; note++) {
            if (isWhiteKey(note)) {
                if (note >= this.minNote) {
                    const key = new WhiteKey(new Rect(x, 0, this.whiteKeyWidth, this.height));
                    this.element.append(key.element);
                }
                x += this.whiteKeyWidth;
            } else {
                if (note >= this.minNote) {
                    const offset = (() => {
                        switch (note % 12) {
                            case MidiNote.C_SHARP_MINUS_1:
                            case MidiNote.F_SHARP_MINUS_1:
                                return -1;
                            case MidiNote.D_SHARP_MINUS_1:
                            case MidiNote.A_SHARP_MINUS_1:
                                return +1;
                        }
                        return 0;
                    })();

                    const key = new BlackKey(new Rect(Math.round(x - this.blackKeyWidth / 2 + (offset * this.blackKeyWidth * 0.1)), 0, this.blackKeyWidth, Math.ceil(this.height * 0.6)));
                    this.element.append(key.element);
                }
            }
        }
        this.element.css({
            width: x,
        })
    }
}

class Key extends Component {
    constructor(readonly rect: Rect, addClass: string) {
        super();
        this.element = $(`<div>`).addClass(addClass).css(rect.toCss());
    }
}

class WhiteKey extends Key {
    constructor(rect: Rect) {
        super(rect, "white-key");

    }
}

class BlackKey extends Key {
    constructor(rect: Rect) {
        super(rect, "black-key");

    }
}