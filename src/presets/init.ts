import { initEnvelopeParams } from "../synth/envelope";
import { OperatorParams, OperatorsParams } from "../synth/operatorParams";
import { Preset } from "./preset";

const operatorParams: OperatorParams = {
    frequencyRatio: 1,
    frequencyOffsetHz: 0,
    sendDepths: [0, 0, 0, 0, 0, 0],
    ampEnvelope: initEnvelopeParams,
    volume: 0,
    pan: 0,
};

export const initOperatorsParams: OperatorsParams = [
    {
        ...operatorParams,
        volume: 1.0
    },
    operatorParams,
    operatorParams,
    operatorParams,
    operatorParams,
    operatorParams,
];

export const initPreset: Preset = {
    name: "Init",
    synthPatch: {
        operatorsParams: initOperatorsParams,
        bendRange: 2,
        modulationFrequency: 5,
    }
}