import { convertOperatorParamsToEx, OperatorParams, OperatorParamsEx, OperatorsParams } from "./operatorParams";

export interface SynthPatch<TOperatorParams extends OperatorParams = OperatorParams> {
    readonly operatorsParams: OperatorsParams<TOperatorParams>;
}

export type SynthPatchEx = SynthPatch<OperatorParamsEx>;

export function convertSynthPatchToEx(patch: SynthPatch): SynthPatchEx {
    return {
        operatorsParams: [
            convertOperatorParamsToEx(patch.operatorsParams[0]),
            convertOperatorParamsToEx(patch.operatorsParams[1]),
            convertOperatorParamsToEx(patch.operatorsParams[2]),
            convertOperatorParamsToEx(patch.operatorsParams[3]),
            convertOperatorParamsToEx(patch.operatorsParams[4]),
            convertOperatorParamsToEx(patch.operatorsParams[5]),
        ]
    }
}