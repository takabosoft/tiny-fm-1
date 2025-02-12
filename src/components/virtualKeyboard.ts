import { Rect } from "../geometries/rect";
import { Vec2 } from "../geometries/vec2";
import { MidiNote } from "../synth/synthMessage";
import { Component } from "./component";

export interface VirtualKeyboardOptions {
    readonly height?: number;
    readonly minNote?: MidiNote,
    readonly maxNote?: MidiNote,
    readonly whiteKeyWidth?: number;
    readonly onKeyDown?: (note: MidiNote) => void;
    readonly onKeyUp?: (note: MidiNote) => void;
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
    private readonly onKeyDown?: (note: MidiNote) => void;
    private readonly onKeyUp?: (note: MidiNote) => void;
    private readonly keyMap = new Map<MidiNote, Key>();
    private readonly selectedKeySet = new Set<MidiNote>();

    constructor(options: VirtualKeyboardOptions = {}) {
        super();

        this.height = options.height ?? 200;
        this.minNote = options.minNote ?? 0;
        this.maxNote = options.maxNote ?? 127;
        this.whiteKeyWidth = options.whiteKeyWidth ?? 32;
        this.blackKeyWidth = Math.ceil(this.whiteKeyWidth * 0.8);
        this.onKeyDown = options.onKeyDown;
        this.onKeyUp = options.onKeyUp;

        this.element = $(`<div class="virtual-keyboard">`).css({
            height: this.height,
        });

        this.layout();
        this.listenPointerEvents();
    }

    private layout() {
        this.element.empty();
        this.keyMap.clear();

        const firstWhiteKeyNote = isWhiteKey(this.minNote) ? this.minNote : this.minNote + 1;
        const firstOctave = Math.floor(firstWhiteKeyNote / 12);
        let x = -calcWhiteIndex(firstWhiteKeyNote) * this.whiteKeyWidth;

        for (let note = firstOctave * 12; note <= this.maxNote; note++) {
            const appendKey = (key: Key) => {
                this.keyMap.set(note, key);
                this.element.append(key.element);
                key.isSelected = this.selectedKeySet.has(note);
            };

            if (isWhiteKey(note)) {
                if (note >= this.minNote) {
                    const text = note % 12 == 0 ? `C${note / 12 - 1}` : "";
                    appendKey(new WhiteKey(new Rect(x, 0, this.whiteKeyWidth, this.height), text));
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

                    appendKey(new BlackKey(new Rect(Math.round(x - this.blackKeyWidth / 2 + (offset * this.blackKeyWidth * 0.1)), 0, this.blackKeyWidth, Math.ceil(this.height * 0.6))));
                }
            }
        }
        this.element.css({
            width: x,
        })
    }

    /**
     * キーの当たり判定。
     * - HACK: 総当たりなので改善の余地有り（本実験ではそこまで追求しない）
     * @param e 
     * @returns 
     */
    private hitTest(e: PointerEvent): MidiNote | undefined {
        const ptOrg = Vec2.fromPointerEvent(e, this.element);
        const pt = new Vec2(ptOrg.x, Math.min(Math.max(ptOrg.y, 0), this.height - 1)); // ドラッグ時に上下に突き抜けないようにクランプ

        let res: MidiNote | undefined;
        for (const [note, key] of this.keyMap.entries()) {
            if (key.rect.isPointInside(pt)) {
                if (!isWhiteKey(note)) {
                    return note;
                }
                res = note;
            }
        }
        return res;
    }

    /** 
     * ポインターイベントを処理します。
     * - マウス左ボタン、タッチに対応
     * - グリッサンドに対応
     * - 選択状態（押下）はここでは処理しません（イベントを発火するのでそれ経由で処理してもらう）。
     */
    private listenPointerEvents(): void {
        const el = this.element[0];

        const pointerIdToKey = new Map<number, MidiNote>();

        // 虫眼鏡が出たりするのを回避します。
        el.addEventListener("touchstart", e => e.preventDefault())

        el.addEventListener("pointerdown", e => {
            e.preventDefault();
            //if (el.hasPointerCapture(e.pointerId)) { return; }
            if (e.pointerType == "button" && e.button != 0) { return; }

            // 左クリックしたままコンテキストメニューを出して左クリックでキャンセルした場合
            const oldNote = pointerIdToKey.get(e.pointerId);
            if (oldNote != null) {
                pointerIdToKey.delete(e.pointerId);
                this.onKeyUp?.(oldNote);
            }

            const note = this.hitTest(e);
            if (note != null) {
                el.setPointerCapture(e.pointerId);
                pointerIdToKey.set(e.pointerId, note);
                this.onKeyDown?.(note);
            }
        });

        el.addEventListener("pointermove", e => {
            e.preventDefault();
            if (el.hasPointerCapture(e.pointerId)) {
                const oldNote = pointerIdToKey.get(e.pointerId);
                const newNote = this.hitTest(e);
                if (oldNote != null && newNote != null && oldNote != newNote) {
                    pointerIdToKey.set(e.pointerId, newNote);
                    this.onKeyUp?.(oldNote);
                    this.onKeyDown?.(newNote);
                }
            }
        });

        const cancel = (e: PointerEvent) => {
            e.preventDefault();
            const note = pointerIdToKey.get(e.pointerId);
            if (note != null) {
                pointerIdToKey.delete(e.pointerId);
                this.onKeyUp?.(note);
            }
        };

        el.addEventListener("lostpointercapture", cancel);
        el.addEventListener("pointercancel",cancel);
    }

    /** 指定したキーが見えるようにスクロールします。 */
    visibleKey(note: MidiNote): void {
        const key = this.keyMap.get(note);
        if (key == null) { return; }
        key.element[0].scrollIntoView({ inline: "center" });
    }

    /** 選択状態を変更します。選択＝押された */
    selectKey(note: MidiNote, isSelected: boolean): void {
        const key = this.keyMap.get(note);
        if (key == null) { return; }

        if (isSelected) {
            this.selectedKeySet.add(note);
        } else {
            this.selectedKeySet.delete(note);
        }
        key.isSelected = isSelected;
    }
}

class Key extends Component {
    constructor(readonly rect: Rect, addClass: string) {
        super();
        this.element = $(`<div>`).addClass(addClass).css({
            ...rect.toCss(),
            "--w": `${rect.width}px`,
        });
    }

    set isSelected(sel: boolean) {
        this.element.toggleClass("selected", sel);
    }
}

class WhiteKey extends Key {
    constructor(rect: Rect, text: string) {
        super(rect, "white-key");
        this.element.attr({
            "data-text": text,
        });
    }
}

class BlackKey extends Key {
    constructor(rect: Rect) {
        super(rect, "black-key");
    }
}