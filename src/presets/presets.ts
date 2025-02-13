import { SynthPatch } from "../synth/synthPatch";
import { basic1SynthPatch } from "./basic1";
import { initSynthPatch } from "./init";
import { organ1SynthPatch } from "./organ1";

export const presets: readonly SynthPatch[] = [
    initSynthPatch,
    basic1SynthPatch,
    organ1SynthPatch,
]