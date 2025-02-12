import { midiInManager } from "../midi/midiInManager";
import { basic1Preset } from "../presets/basic1";
import { initPreset } from "../presets/init";
import { oscCount } from "../synth/const";
import { MidiNote } from "../synth/synthMessage";
import { SynthPatch } from "../synth/synthPatch";
import { SynthProcessorWrapper } from "../synth/synthProcessorWrapper";
import { Component } from "./component";
import { HeaderPanel } from "./headerPanel";
import { KeyboardPanel } from "./keyboardPanel";
import { OperatorPanel } from "./operatorPanel";
import { VirtualKeyboard } from "./virtualKeyboard";

export class SynthBody extends Component {
    private readonly synthProcessor: SynthProcessorWrapper;
    private readonly keyNoteDefaultMap = new Map<string, MidiNote>([
        // 白鍵（C3 ~ B3）
        ["z", MidiNote.C3], ["x", MidiNote.D3], ["c", MidiNote.E3],
        ["v", MidiNote.F3], ["b", MidiNote.G3], ["n", MidiNote.A3],
        ["m", MidiNote.B3],

        // 黒鍵（C#3 ~ A#3）
        ["s", MidiNote.C_SHARP_3], ["d", MidiNote.D_SHARP_3],
        ["g", MidiNote.F_SHARP_3], ["h", MidiNote.G_SHARP_3],
        ["j", MidiNote.A_SHARP_3],

        // 高いオクターブ（C4 ~ E4）
        [",", MidiNote.C4], [".", MidiNote.D4], ["/", MidiNote.E4],

        // 黒鍵（C#4 ~ D#4）
        ["l", MidiNote.C_SHARP_4], [";", MidiNote.D_SHARP_4],
    ]);
    /** MIDI ON状態のノートをここで管理します。PCキーボード・マウスなど複数デバイスからありえない入力状態になるのを防ぎます。 */
    private readonly midiNoteOnSet = new Set<MidiNote>();
    /** PCキーボード情報 */
    private readonly pcKeyNoteStateMap = new Map<string, MidiNote>();
    private readonly headerPanel: HeaderPanel;
    private readonly operatorPanels: OperatorPanel[] = [];
    private readonly keyboardPanel: KeyboardPanel;
    private pcKeyOctaveShift = 1;

    constructor(audioContext: AudioContext) {
        super();
        this.synthProcessor = new SynthProcessorWrapper(audioContext);

        const analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 1024;  // FFTサイズの設定
        const masterGainNode = audioContext.createGain();
        
        // ノードを直列接続
        this.synthProcessor.node.connect(analyserNode);
        analyserNode.connect(masterGainNode);
        masterGainNode.connect(audioContext.destination);
        
        for (let i = 0; i < oscCount; i++) {
            this.operatorPanels.push(new OperatorPanel(i, () => this.changePatch(this.synthPatch, false)));
        }
        this.keyboardPanel = new KeyboardPanel(this.synthProcessor, new VirtualKeyboard({
            height: 150,
            onKeyDown: note => this.noteOn(note),
            onKeyUp: note => this.noteOff(note),
        }), () => this.changePatch(this.synthPatch, false));

        this.headerPanel = new HeaderPanel(this.synthProcessor, masterGainNode, analyserNode, preset => this.changePatch(preset.synthPatch));

        this.element = $(`<div class="synth-body">`).append(
            this.headerPanel.element,
            this.operatorPanels.map(p => p.element),
            this.keyboardPanel.element,
        );

        midiInManager.onChangeCurDevice = () => this.allNoteOff();
        midiInManager.onNoteOn = note => this.noteOn(note);
        midiInManager.onNoteOff = note => this.noteOff(note);
        midiInManager.onPitchBend = bend => {
            this.synthProcessor.pitchBend = bend;
            this.keyboardPanel.pitchBend = bend;
        };
        midiInManager.onModulation = mod => {
            this.synthProcessor.modulation = mod;
            this.keyboardPanel.modulation = mod;
        };
        this.listenPCKeyboard();

        // 初期状態
        this.changePatch(basic1Preset.synthPatch);
        this.headerPanel.presetSelector.selectByName(basic1Preset.name);
    }

    private get synthPatch(): SynthPatch {
        return {
            operatorsParams: [
                this.operatorPanels[0].operatorParams,
                this.operatorPanels[1].operatorParams,
                this.operatorPanels[2].operatorParams,
                this.operatorPanels[3].operatorParams,
                this.operatorPanels[4].operatorParams,
                this.operatorPanels[5].operatorParams,
            ],
            bendRange: this.keyboardPanel.bendRange,
            modulationFrequency: this.keyboardPanel.modulationFreq,
        }
    }

    /** パッチを変更します。プロセッサに情報を送り、UIも更新します。 */
    private changePatch(newPatch: SynthPatch, updateUI = true): void {
        this.synthProcessor.patch = newPatch;
        if (updateUI) {
            for (let i = 0; i < oscCount; i++) {
                this.operatorPanels[i].operatorParams = newPatch.operatorsParams[i];
            }
            this.keyboardPanel.bendRange = newPatch.bendRange;
            this.keyboardPanel.modulationFreq = newPatch.modulationFrequency;
        }
    }

    private noteOn(note: MidiNote): void {
        if (this.midiNoteOnSet.has(note)) { return; }
        this.midiNoteOnSet.add(note);
        this.synthProcessor?.noteOn(note);
        this.keyboardPanel.virtualKeyboard.selectKey(note, true);
    }

    private noteOff(note: MidiNote): void {
        if (!this.midiNoteOnSet.has(note)) { return; }
        this.midiNoteOnSet.delete(note);
        this.synthProcessor?.noteOff(note);
        this.keyboardPanel.virtualKeyboard.selectKey(note, false);
    }

    /**
     * すべてのノートをオフにします。
     * - MIDI入力デバイスを切り替えるときにノートオンが残る可能性があるため
     */
    private allNoteOff(): void {
        [...this.midiNoteOnSet].forEach(n => this.noteOff(n));
    }

    /** PCキーボードイベントを監視します。 */
    private listenPCKeyboard(): void {
        document.addEventListener("keydown", e => {
            if (this.pcKeyNoteStateMap.has(e.key)) { return; } // キーボード連打阻止
            let note = this.keyNoteDefaultMap.get(e.key);
            if (note != null) {
                note += this.pcKeyOctaveShift * 12;
                if (note >= 0 && note <= 127) {
                    this.noteOn(note);
                    this.pcKeyNoteStateMap.set(e.key, note); // キーボードを押すときと離すときでNote#が変わる場合があり得るので保持しておく
                }
            }
        });

        document.addEventListener("keyup", e => {
            const note = this.pcKeyNoteStateMap.get(e.key);
            if (note != null) {
                this.noteOff(note);
                this.pcKeyNoteStateMap.delete(e.key);
            }
        });
    }

    /** スクロール */
    scrollVirtualKeyboard(): void {
        this.keyboardPanel.scrollVirtualKeyboard();
    }
}