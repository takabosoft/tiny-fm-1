import { convertOperatorParamsToEx, OperatorParams, OperatorParamsEx, OperatorsParams } from "./operatorParams";

export interface SynthPatch<TOperatorParams extends OperatorParams = OperatorParams> {
    readonly name: string;
    readonly operatorsParams: OperatorsParams<TOperatorParams>;
    readonly bendRange: number;
    readonly modulationFrequency: number;
}

export type SynthPatchEx = SynthPatch<OperatorParamsEx>;

export function convertSynthPatchToEx(patch: SynthPatch): SynthPatchEx {
    return {
        name: patch.name,
        operatorsParams: [
            convertOperatorParamsToEx(patch.operatorsParams[0]),
            convertOperatorParamsToEx(patch.operatorsParams[1]),
            convertOperatorParamsToEx(patch.operatorsParams[2]),
            convertOperatorParamsToEx(patch.operatorsParams[3]),
            convertOperatorParamsToEx(patch.operatorsParams[4]),
            convertOperatorParamsToEx(patch.operatorsParams[5]),
        ],
        bendRange: patch.bendRange,
        modulationFrequency: patch.modulationFrequency,
    }
}
