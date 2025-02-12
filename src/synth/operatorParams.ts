import { EnvelopeParams } from "./envelope";

/** オペレーターの音色情報の型 */
export interface OperatorParams {
    readonly frequencyRatio: number,
    readonly frequencyOffsetHz: number,
    /** 各オシレーターへどれだけ送るか（受けるほうが一般的かもしれない？） */
    readonly sendDepths: [number, number, number, number, number, number],
    readonly ampEnvelope: EnvelopeParams,
    readonly volume: number,
    readonly pan: number,
}

export type OperatorsParams<T extends OperatorParams = OperatorParams> = [T, T, T, T, T, T];

/** 一部の値をキャッシュするために型を拡張します。 */
export interface OperatorParamsEx extends OperatorParams {
    /** オペレーターとして全く利用していない場合はtrue */
    readonly sleep: boolean;
}

export function convertOperatorParamsToEx(params: OperatorParams): OperatorParamsEx {
    return {
        ...params,
        sleep: params.sendDepths.every(d => d == 0) && params.volume == 0,
    }
}