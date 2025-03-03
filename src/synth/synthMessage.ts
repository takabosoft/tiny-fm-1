import { SynthPatch } from "./synthPatch";

export const enum MidiNote {
    C_MINUS_1 = 0,  // C-1
    C_SHARP_MINUS_1,
    D_MINUS_1,
    D_SHARP_MINUS_1,
    E_MINUS_1,
    F_MINUS_1,
    F_SHARP_MINUS_1,
    G_MINUS_1,
    G_SHARP_MINUS_1,
    A_MINUS_1,
    A_SHARP_MINUS_1,
    B_MINUS_1,
    C0,
    C_SHARP_0,
    D0,
    D_SHARP_0,
    E0,
    F0,
    F_SHARP_0,
    G0,
    G_SHARP_0,
    A0,
    A_SHARP_0,
    B0,
    C1,
    C_SHARP_1,
    D1,
    D_SHARP_1,
    E1,
    F1,
    F_SHARP_1,
    G1,
    G_SHARP_1,
    A1,
    A_SHARP_1,
    B1,
    C2,
    C_SHARP_2,
    D2,
    D_SHARP_2,
    E2,
    F2,
    F_SHARP_2,
    G2,
    G_SHARP_2,
    A2,
    A_SHARP_2,
    B2,
    C3,
    C_SHARP_3,
    D3,
    D_SHARP_3,
    E3,
    F3,
    F_SHARP_3,
    G3,
    G_SHARP_3,
    A3,
    A_SHARP_3,
    B3,
    C4, // Middle C (C4)
    C_SHARP_4,
    D4,
    D_SHARP_4,
    E4,
    F4,
    F_SHARP_4,
    G4,
    G_SHARP_4,
    A4, // 440Hz
    A_SHARP_4,
    B4,
    C5,
    C_SHARP_5,
    D5,
    D_SHARP_5,
    E5,
    F5,
    F_SHARP_5,
    G5,
    G_SHARP_5,
    A5,
    A_SHARP_5,
    B5,
    C6,
    C_SHARP_6,
    D6,
    D_SHARP_6,
    E6,
    F6,
    F_SHARP_6,
    G6,
    G_SHARP_6,
    A6,
    A_SHARP_6,
    B6,
    C7,
    C_SHARP_7,
    D7,
    D_SHARP_7,
    E7,
    F7,
    F_SHARP_7,
    G7,
    G_SHARP_7,
    A7,
    A_SHARP_7,
    B7,
    C8,
    C_SHARP_8,
    D8,
    D_SHARP_8,
    E8,
    F8,
    F_SHARP_8,
    G8,
    G_SHARP_8,
    A8,
    A_SHARP_8,
    B8,
    C9,
    C_SHARP_9,
    D9,
    D_SHARP_9,
    E9,
    F9,
    F_SHARP_9,
    G9
}

export interface NoteOnMessage {
    readonly type: "NoteOn";
    readonly note: MidiNote;
}

export interface NoteOffMessage {
    readonly type: "NoteOff";
    readonly note: MidiNote;
}

export interface PatchMessage {
    readonly type: "Patch";
    readonly patch: SynthPatch;
}

export interface PolyphonyMessage {
    readonly type: "Polyphony";
    readonly polyphony: number;
}

export interface PitchBendMessage {
    readonly type: "PitchBend";
    readonly pitchBend: number;
}

export interface ModulationMessage {
    readonly type: "Modulation";
    readonly modulation: number;
}

export type SynthMessage = NoteOnMessage | NoteOffMessage | PatchMessage | PolyphonyMessage | PitchBendMessage | ModulationMessage;
