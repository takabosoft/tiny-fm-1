import { midiInManager } from "../midi/midiInManager";
import { basic1SynthPatch } from "../presets/basic1";
import { operatorCount } from "../synth/operatorParams";
import { MidiNote } from "../synth/synthMessage";
import { SynthPatch } from "../synth/synthPatch";
import { SynthProcessorWrapper } from "../synth/synthProcessorWrapper";
import { buildPatchURL, loadPatchFromCurrentURL, savePatchToCurrentURL } from "../synthPatchSaver";
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

        for (let i = 0; i < operatorCount; i++) {
            this.operatorPanels.push(new OperatorPanel(i, () => this.synthProcessor.patch = this.synthPatch));
        }
        this.keyboardPanel = new KeyboardPanel(this.synthProcessor, new VirtualKeyboard({
            height: 150,
            onKeyDown: note => this.noteOn(note),
            onKeyUp: note => this.noteOff(note),
        }), () => this.synthProcessor.patch = this.synthPatch);

        this.headerPanel = new HeaderPanel(this.synthProcessor, masterGainNode, analyserNode, newPatch => {
            this.updateUIFromSynthPatch(newPatch);
            this.synthProcessor.patch = this.synthPatch;
        }, () => savePatchToCurrentURL(this.synthPatch), () => this.sharePatchToX());

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
        this.initializeSynthPatch();
    }

    /** UIからパッチ情報を作成します。値はクランプされています。 */
    private get synthPatch(): SynthPatch {
        return {
            name: this.headerPanel.patchNameInput.name,
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

    /** 最初のパッチを準備し、UIやプロセッサへ送ります。 */
    private initializeSynthPatch(): void {
        const loadPatch = loadPatchFromCurrentURL();
        if (loadPatch != null) {
            // ロードしたパッチは構造は正常だが、値が異常な可能性があるため、UIへ反映（ここでクランプされる）し、そこからシンセパッチを作り直してプロセッサへ送ります。
            this.updateUIFromSynthPatch(loadPatch);
            this.synthProcessor.patch = this.synthPatch;
        } else {
            const patch = basic1SynthPatch;
            this.synthProcessor.patch = patch;
            this.updateUIFromSynthPatch(patch);
        }
    }

    /** パッチの内容をUIへ反映します。各UIで値はクランプされます。 */
    private updateUIFromSynthPatch(newPatch: SynthPatch): void {
        this.headerPanel.patchNameInput.name = newPatch.name;
        for (let i = 0; i < operatorCount; i++) {
            this.operatorPanels[i].operatorParams = newPatch.operatorsParams[i];
        }
        this.keyboardPanel.bendRange = newPatch.bendRange;
        this.keyboardPanel.modulationFreq = newPatch.modulationFrequency;
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
            if (e.target instanceof HTMLInputElement) { return; } // Inputでの発動を阻止
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

    /** パッチURLをXへ投稿 */
    private sharePatchToX(): void {
        const patchUrl = buildPatchURL(this.synthPatch);
        if (patchUrl == null) { return; }
        const url = new URL("https://x.com/intent/post");
        url.searchParams.append("text", `#tiny_fm_1 ${this.headerPanel.patchNameInput.name}`);
        url.searchParams.append("url", patchUrl);
        window.open(url.toString(), "_blank");
    }

    /** スクロール */
    scrollVirtualKeyboard(): void {
        this.keyboardPanel.scrollVirtualKeyboard();
    }
}