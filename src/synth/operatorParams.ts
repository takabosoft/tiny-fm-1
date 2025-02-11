import { EnvelopeParams } from "./envelope";

/** オペレーターの音色情報の型 */
export interface OperatorParams {
    readonly frequencyRatio: number,
    readonly frequencyOffsetHz: number,
    /** 各オシレーターへどれだけ送るか（受けるほうが一般的かもしれない？） */
    readonly sendDepths: readonly number[],
    readonly ampEnvelope: EnvelopeParams,
    readonly volume: number,
    readonly pan: number,
}