import { initOperatorParams, initPreset } from "./init";
import { Preset } from "./preset";

export const basic1Preset: Preset = {
    name: "Basic 1",
    synthPatch: {
        ...initPreset.synthPatch,
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
}