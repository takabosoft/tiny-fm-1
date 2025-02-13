import { masterVolumeDefault, polyphonyDefault } from "./components/const";

const key = "tine-fm-1";

/** 増やす場合は`undefinable`にすること */
interface TinyFM1LocalStorageParams {
    readonly midiInName: string;
    readonly masterVol: number;
    readonly polyphony: number;
}

class TinyFM1LocalStorage {
    private _midiInName = "";
    private _masterVol = masterVolumeDefault;
    private _polyphony = polyphonyDefault;

    constructor() {
        this.load();
    }

    get midiInName() { return this._midiInName; }
    set midiInName(name: string) {
        this._midiInName = name;
        this.save();
    }

    get masterVolume() { return this._masterVol; }
    set masterVolume(vol: number) {
        this._masterVol = vol;
        this.save();
    }

    get polyphony() { return this._polyphony; }
    set polyphony(poly: number) {
        this._polyphony = poly;
        this.save();
    }

    /** セッションストレージから読み込みます。 */
    private load() {
        try {
            const jsonStr = localStorage.getItem(key);
            if (jsonStr == null) { return; }
            const params = JSON.parse(jsonStr) as TinyFM1LocalStorageParams;
            if (params == null) { return; }
            this._midiInName = params.midiInName;
            this._masterVol = params.masterVol;
            this._polyphony = params.polyphony;
        } catch (e) {
            console.error(e);
        }
    }

    private save() {
        const obj: TinyFM1LocalStorageParams = {
            midiInName: this._midiInName,
            masterVol: this._masterVol,
            polyphony: this._polyphony,
        };
        try {
            localStorage.setItem(key, JSON.stringify(obj));
        } catch (e) {
            console.error(e);
        }
    }
}

export const tinyFM1LocalStorage = new TinyFM1LocalStorage();