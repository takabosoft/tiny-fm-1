import { Rect } from "../geometries/rect";
import { Vec2 } from "../geometries/vec2";
import { highLightColor } from "../synth/const";
import { calcEnvelope, EnvelopeParams } from "../synth/envelope";
import { Component } from "./component";

const size = new Vec2(170, 48);

/** エンベロープの形をプレビューするコンポーネントです。 */
export class EnvelopePreview extends Component {
    constructor() {
        super();
        this.element = $(`<svg width="${size.x}" height="${size.y}">`).css({
            "margin-left": "8px",
            "overflow": "hidden",
        });

        this.render({
            attackSec: 1,
            attackShape: 0,
            decaySec: 1,
            decayShape: 0,
            sustain: 0.8,
            releaseSec: 1,
            releaseShape: 0,
        });
    }

    render(envParams: EnvelopeParams): void {
        this.element.empty();
        const svg = this.element[0] as unknown as SVGSVGElement;
        
        const padding = 2;
        const rc = new Rect(padding, padding, size.x - padding * 2, size.y - padding); // 下だけギリギリにする
        const sustainSec = 1; // 適当
        const noteOffSec = envParams.attackSec + envParams.decaySec + sustainSec;
        const totalSec = noteOffSec + envParams.releaseSec;
        
        let d = `M${rc.x} ${rc.bottom}`;
        for (let i = 0; i < rc.width; i++) {
            const sec = i * totalSec / (rc.width - 1);
            const x = rc.x + i;
            const y = rc.bottom - rc.height * (calcEnvelope(envParams, sec, noteOffSec) ?? 0)
            d += `L${x} ${y}`;
        }
        //d += `L${rc.right} ${rc.bottom}`;

        const path = $(document.createElementNS("http://www.w3.org/2000/svg", "path")).attr({
            "stroke": highLightColor,
            "stroke-width": 2,
            "stroke-linejoin": "round",
            "fill": "#4088D988",
            d
        })
        this.element.append(path);
    }
}