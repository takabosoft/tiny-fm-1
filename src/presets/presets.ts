import { basic1Preset } from "./basic1";
import { initPreset } from "./init";
import { organ1Preset } from "./organ1";
import { Preset } from "./preset";

export const presets: readonly Preset[] = [
    initPreset,
    basic1Preset,
    organ1Preset
]