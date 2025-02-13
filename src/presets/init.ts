import { initEnvelopeParams } from "../synth/envelope";
import { OperatorParams, OperatorsParams } from "../synth/operatorParams";
import { SynthPatch } from "../synth/synthPatch";

export const initOperatorParams: OperatorParams = {
    frequencyRatio: 1,
    frequencyOffsetHz: 0,
    sendDepths: [0, 0, 0, 0, 0, 0],
    ampEnvelope: initEnvelopeParams,
    volume: 0,
    pan: 0,
};

export const initOperatorsParams: OperatorsParams = [
    {
        ...initOperatorParams,
        volume: 1.0
    },
    initOperatorParams,
    initOperatorParams,
    initOperatorParams,
    initOperatorParams,
    initOperatorParams,
];

export const initSynthPatch: SynthPatch = {
    name: "Init",
    operatorsParams: initOperatorsParams,
    bendRange: 2,
    modulationFrequency: 5,
}
