class MyProcessor extends AudioWorkletProcessor {
    private phase: number = 0;
    private frequency: number = 440; // サイン波の周波数（Hz）

    constructor() {
        super();
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
        const output = outputs[0]; // 1つの出力チャネル

        // 各フレームごとにサイン波を生成
        for (let i = 0; i < output[0].length; i++) {
            this.phase += this.frequency / sampleRate; // 波形の位相を進める
            if (this.phase >= 1) this.phase -= 1; // 位相が1を超えたら0に戻す

            // サイン波の計算
            output[0][i] = Math.sin(this.phase * 2 * Math.PI);
        }

        return true;
    }
}

registerProcessor("MyProcessor", MyProcessor);