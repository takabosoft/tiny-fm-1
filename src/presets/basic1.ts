import { SynthPatch } from "../synth/synthPatch";
import { initOperatorParams, initSynthPatch } from "./init";

export const basic1SynthPatch: SynthPatch = {
    ...initSynthPatch,
    name: "Basic 1",
    operatorsParams: [
        {
            ...initOperatorParams,
            volume: 1,
        },
        {
            ...initOperatorParams,
            frequencyRatio: 3,
            sendDepths: [1, 0, 0, 0, 0, 0],
        },
        initOperatorParams,
        initOperatorParams,
        initOperatorParams,
        initOperatorParams,
    ]
}