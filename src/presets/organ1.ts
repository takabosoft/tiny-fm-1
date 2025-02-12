import { initPreset } from "./init";
import { Preset } from "./preset";

export const organ1Preset: Preset = {
    name: "Organ 1",
    synthPatch: {
        ...initPreset.synthPatch,
        operatorsParams: [
            {
                frequencyRatio: 2,
                frequencyOffsetHz: -0.6,
                sendDepths: [
                    0,
                    0.9542587685278997,
                    0,
                    0,
                    0,
                    0
                ],
                ampEnvelope: {
                    attackSec: 0,
                    attackShape: 0,
                    decaySec: 0,
                    decayShape: 0,
                    sustain: 1,
                    releaseSec: 0.001,
                    releaseShape: 0
                },
                volume: 0.39,
                pan: -0.21212121212121213
            },
            {
                frequencyRatio: 1,
                frequencyOffsetHz: 0,
                sendDepths: [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                ampEnvelope: {
                    attackSec: 0,
                    attackShape: 0,
                    decaySec: 0,
                    decayShape: 0,
                    sustain: 1,
                    releaseSec: 0.001,
                    releaseShape: 0
                },
                volume: 0.41,
                pan: -0.1919191919191919
            },
            {
                frequencyRatio: 2,
                frequencyOffsetHz: 0.4,
                sendDepths: [
                    0,
                    0,
                    0,
                    1.4254976665663686,
                    0,
                    0
                ],
                ampEnvelope: {
                    attackSec: 0,
                    attackShape: 0,
                    decaySec: 0,
                    decayShape: 0,
                    sustain: 1,
                    releaseSec: 0.001,
                    releaseShape: 0
                },
                volume: 0.2,
                pan: -0.15151515151515152
            },
            {
                frequencyRatio: 1,
                frequencyOffsetHz: 0,
                sendDepths: [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                ampEnvelope: {
                    attackSec: 0,
                    attackShape: 0,
                    decaySec: 0,
                    decayShape: 0,
                    sustain: 1,
                    releaseSec: 0.001,
                    releaseShape: 0
                },
                volume: 0.52,
                pan: 0.2828282828282828
            },
            {
                frequencyRatio: 5.4969,
                frequencyOffsetHz: 2000,
                sendDepths: [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0.8848819307611251
                ],
                ampEnvelope: {
                    attackSec: 0,
                    attackShape: 0,
                    decaySec: 0,
                    decayShape: 0,
                    sustain: 1,
                    releaseSec: 0.001,
                    releaseShape: 0
                },
                volume: 0,
                pan: 0
            },
            {
                frequencyRatio: 2,
                frequencyOffsetHz: 0,
                sendDepths: [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                ampEnvelope: {
                    attackSec: 0,
                    attackShape: 0,
                    decaySec: 0,
                    decayShape: 0,
                    sustain: 1,
                    releaseSec: 0.001,
                    releaseShape: 0
                },
                volume: 0.16,
                pan: 0
            }
        ]
    }
}