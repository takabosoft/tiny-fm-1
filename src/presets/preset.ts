import { SynthPatch } from "../synth/synthPatch";

export interface Preset {
    readonly name: string;
    readonly synthPatch: SynthPatch;
}