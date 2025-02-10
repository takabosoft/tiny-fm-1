export interface EnvelopeParams {
    /** 音の立ち上がり速度（秒） */
    readonly attackSec: number;
    /** アタックのスロープ（0で直線, プラスで初速ゆっくり マイナスで初速早い） */
    readonly attackSlope: number;
    /** アタック後にサスティン音量に向かう時間（秒） */
    readonly decaySec: number;
    readonly decaySlope: number;
    /** ディケイ後保持する音量 0.0～1.0 */
    readonly sustain: number;
    /** ノートオフ後から0へ向かう長さ */
    readonly releaseSec: number;
    readonly releaseSlope: number;
}

export const initEnvelopeParams: EnvelopeParams = {
    attackSec: 0,
    attackSlope: 0,
    decaySec: 0,
    decaySlope: 0,
    sustain: 1,
    releaseSec: 0.01,
    releaseSlope: 0,
};

function interpolateCore(t: number, slope: number): number {
    if (slope === 0) { return t; }

    if (slope > 0) {
        return Math.pow(t, 1 + slope);
    } else {
        return 1 - Math.pow(1 - t, 1 - slope);
    }
}

export function interpolate(t1Sec: number, v1: number, t2Sec: number, v2: number, slope: number, curSec: number): number | undefined {
    if (curSec < t1Sec || curSec > t2Sec) { return undefined; }
    const deltaT = (curSec - t1Sec) / (t2Sec - t1Sec);
    const alpha = interpolateCore(deltaT, slope);
    return v1 * (1 - alpha) + v2 * alpha;
}

export function calcEnvelope(params: EnvelopeParams, curSec: number, noteOffSec: number | undefined): number | undefined {
    if (noteOffSec != null && curSec >= noteOffSec) {
        const t1Sec = noteOffSec;
        const v1 = calcEnvelope(params, noteOffSec, undefined) ?? 0;
        const t2Sec = t1Sec + params.releaseSec;
        const v2 = 0;
        return interpolate(t1Sec, v1, t2Sec, v2, params.releaseSlope, curSec);
    }

    if (curSec < params.attackSec) {
        // アタック
        const t1Sec = 0;
        const v1 = 0;
        const t2Sec = params.attackSec;
        const v2 = 1;

        return interpolate(t1Sec, v1, t2Sec, v2, params.attackSlope, curSec);
    } else if (curSec < params.attackSec + params.decaySec) {
        // ディケイ
        const t1Sec = params.attackSec;
        const v1 = 1;
        const t2Sec = params.attackSec + params.decaySec;
        const v2 = params.sustain;
        return interpolate(t1Sec, v1, t2Sec, v2, params.decaySlope, curSec);
    } else {
        return params.sustain;
    }
}