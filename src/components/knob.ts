import { Vec2 } from "../geometries/vec2";
import { highLightColor } from "./const";
import { Component } from "./component";
import { blurActiveElement } from "../uiUtils";

/** つまみ */
export class Knob extends Component {
    private readonly bottomSpaceDeg = 45;
    private readonly lineLen = 10;
    private readonly strokeWidth = 4;
    private readonly beginDeg = 270 - this.bottomSpaceDeg;
    private readonly endDeg = this.beginDeg - 360 + this.bottomSpaceDeg * 2;
    private readonly svg: JQuery;
    private readonly arcPath: JQuery<SVGPathElement>;

    constructor(
        private readonly size = 70,
        private readonly min: number,
        private readonly max: number,
        private _value: number,
        private readonly resetValue: number,
        private readonly centerValue: number | undefined,
        private readonly onInput: (newVal: number) => void,
    ) {
        super();
        this._value = this.clampValue(this._value);
        this.svg = $(`<svg width="${this.size}" height="${this.size}">`);

        this.appendPath("rgba(0, 0, 0, 0.08)", this.strokeWidth, this.buildPathArcD(this.min, this.max));
        this.arcPath = this.appendPath(highLightColor, this.strokeWidth, "");

        this.appendValueLine(this.min);
        this.appendValueLine(this.max);
        if (centerValue != null) {
            this.appendValueLine(centerValue);
        }

        this.element = $(`<div class="knob">`).append(
            this.svg,
            $(`<div>`).append(`<div>`),
        );
        this.updateKnobAngle();
        this.listenPointerEvents();
    }

    get value() { return this._value; }
    set value(v: number) {
        v = this.clampValue(v);
        if (this._value != v) {
            this._value = v;
            this.updateKnobAngle();
        }
    }

    /** つまみ本体の回転反映および円弧の更新をします。 */
    private updateKnobAngle(): void {
        this.element.css({
            "--angle": `${-this.valueToDeg(this._value) + 90}deg`,
        });
        if (this.centerValue != null) {
            if (this._value < this.centerValue) {
                this.arcPath.attr("d", this.buildPathArcD(this._value, this.centerValue));
            } else {
                this.arcPath.attr("d", this.buildPathArcD(this.centerValue, this._value));
            }
        } else {
            this.arcPath.attr("d", this.buildPathArcD(this.min, this._value))
        }
    }

    private clampValue(val: number): number {
        return Math.max(Math.min(val, this.max), this.min);
    }

    /** 時計回り */
    private buildPathArcD(startVal: number, endVal: number): string {
        const radius = this.size / 2 - this.lineLen / 2;
        const pt1 = this.calcValuePos(startVal, radius);
        const pt2 = this.calcValuePos(endVal, radius);
        const isLarge = (this.valueToDeg(startVal) - this.valueToDeg(endVal)) > 180;
        return `M${pt1.x} ${pt1.y} A${radius} ${radius} 0 ${isLarge ? 1 : 0} 1 ${pt2.x} ${pt2.y}`;
    }

    private appendPath(stroke: string, strokeWidth: number, d: string): JQuery<SVGPathElement> {
        const path = $(document.createElementNS("http://www.w3.org/2000/svg", "path")).attr({
            stroke,
            "stroke-width": strokeWidth,
            fill: "none",
            d,
        });
        this.svg.append(path);
        return path;
    }

    private appendValueLine(val: number): void {
        const pt1 = this.calcValuePos(val, this.size / 2);
        const pt2 = this.calcValuePos(val, this.size / 2 - this.lineLen);
        this.appendPath("#333", 1, `M${pt1.x} ${pt1.y} L${pt2.x} ${pt2.y}`);
    }

    private calcValuePos(val: number, radius: number): Vec2 {
        const deg = this.valueToDeg(val);
        const rad = deg * Math.PI / 180;
        return new Vec2(this.size / 2 + Math.cos(rad) * radius, this.size / 2 - Math.sin(rad) * radius);
    }

    private valueToDeg(val: number): number {
        const a = (this.clampValue(val) - this.min) / (this.max - this.min);
        return this.beginDeg * (1 - a) + this.endDeg * a;
    }

    private listenPointerEvents(): void {
        const el = this.element[0];

        let dragPointerId: number | undefined = undefined;
        let oldValue = 0;
        let dragStartY = 0;
        let lastPointerDownTimeStamp: number | undefined = undefined;

        const changeValue = (v: number) => {
            const newValue = this.clampValue(v);
            if (this._value != newValue) {
                this._value = newValue;
                this.updateKnobAngle();
                this.onInput(newValue);
            }
        }

        // 虫眼鏡が出たりするのを回避します。
        el.addEventListener("touchstart", e => e.preventDefault())

        el.addEventListener("pointerdown", e => {
            e.preventDefault();
            blurActiveElement();

            if (dragPointerId != null) { return; }
            if (e.pointerType == "button" && e.button != 0) { return; }

            // ダブルクリック検出
            if (lastPointerDownTimeStamp != null && e.timeStamp - lastPointerDownTimeStamp < 200) {
                changeValue(this.resetValue);
                return;
            }

            el.setPointerCapture(e.pointerId);
            dragPointerId = e.pointerId;
            oldValue = this._value;
            dragStartY = e.clientY;
            lastPointerDownTimeStamp = e.timeStamp;
        });

        el.addEventListener("pointermove", e => {
            e.preventDefault();
            if (el.hasPointerCapture(e.pointerId) && e.pointerId == dragPointerId) {
                changeValue(oldValue + (dragStartY - e.clientY) * (this.max - this.min) / 180);
            }
        });

        const cancel = (e: PointerEvent) => {
            e.preventDefault();
            if (e.pointerId == dragPointerId) {
                dragPointerId = undefined;
            }
        };

        el.addEventListener("lostpointercapture", cancel);
        el.addEventListener("pointercancel", cancel);
    }
}
