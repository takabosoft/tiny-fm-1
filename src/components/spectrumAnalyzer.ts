import { Vec2 } from "../geometries/vec2";
import { Component } from "./component";

const canvasSize = new Vec2(200, 50);

export class SpectrumAnalyzer extends Component {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly dataArray: Uint8Array;

    constructor(private readonly analyserNode: AnalyserNode) {
        super();
        this.element = $(`<canvas class="spectrum-analyzer" width="${canvasSize.x}" height="${canvasSize.y}"}>`);
        this.dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
        const canvas = this.element[0] as HTMLCanvasElement;
        this.ctx = canvas.getContext("2d")!;

        requestAnimationFrame(() => this.render());
    }

    private render(): void {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, canvasSize.x, canvasSize.y);

        this.analyserNode.getByteFrequencyData(this.dataArray);

        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgb(255, 255, 255)";

        ctx.beginPath();

        const sliceWidth = (canvasSize.x * 1.0) / this.dataArray.length;
        let x = 0;

        for (let i = 0; i < this.dataArray.length; i++) {
            const v = this.dataArray[i] / 255.0;
            const y = canvasSize.y + 1 - (v * canvasSize.y);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        ctx.stroke();

        requestAnimationFrame(() => this.render());
    }
}