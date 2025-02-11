import { OperatorParams } from "../synth/operatorParams";

export type OperatorsParams<T extends OperatorParams = OperatorParams> = [T, T, T, T, T, T];

export interface Preset {
    readonly name: string;
    readonly operatorsParams: OperatorsParams;
}