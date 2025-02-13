import { initOperatorParams, initSynthPatch } from './presets/init';
import { OperatorParams } from './synth/operatorParams';
import { SynthPatch } from './synth/synthPatch';

declare const pako: typeof import('pako');

function compressToBase64URI(input: string): string {
    const compressed = pako.deflate(input);
    return encodeURIComponent(btoa(String.fromCharCode(...compressed)));
}

function decompressFromBase64URI(base64URI: string): string {
    const binaryString = atob(decodeURIComponent(base64URI));
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }
    return pako.inflate(byteArray, { to: "string" });
}

export function buildPatchURL(synthPath: SynthPatch): string | undefined {
    try {
        const patchStr = compressToBase64URI(JSON.stringify(synthPath));
        const url = new URL(location.origin + location.pathname);
        url.searchParams.append("patch", patchStr);
        url.searchParams.append("v", "1");
        return url.toString();
    } catch (e) {
        alert(e);
    }
}

/** パッチを現在のURLへ保存します。 */
export function savePatchToCurrentURL(synthPath: SynthPatch): void {
    const url = buildPatchURL(synthPath);
    if (url != null) {
        history.pushState(null, "", url);
    }
}

function safeParseString(val: any, def: string): string {
    return (typeof val === "string") ? val : def;
}

function safeParseNumber(val: any, def: number): number {
    return ((typeof val === "number") && !isNaN(val)) ? val : def;
}

function safeParseOperatorParams(dirtyParams: OperatorParams): OperatorParams {
    return {
        frequencyRatio: safeParseNumber(dirtyParams.frequencyRatio, initOperatorParams.frequencyRatio),
        frequencyOffsetHz: safeParseNumber(dirtyParams.frequencyOffsetHz, initOperatorParams.frequencyOffsetHz),
        sendDepths: [
            safeParseNumber(dirtyParams.sendDepths[0], initOperatorParams.sendDepths[0]),
            safeParseNumber(dirtyParams.sendDepths[1], initOperatorParams.sendDepths[1]),
            safeParseNumber(dirtyParams.sendDepths[2], initOperatorParams.sendDepths[2]),
            safeParseNumber(dirtyParams.sendDepths[3], initOperatorParams.sendDepths[3]),
            safeParseNumber(dirtyParams.sendDepths[4], initOperatorParams.sendDepths[4]),
            safeParseNumber(dirtyParams.sendDepths[5], initOperatorParams.sendDepths[5]),
        ],
        ampEnvelope: {
            attackSec: safeParseNumber(dirtyParams.ampEnvelope.attackSec, initOperatorParams.ampEnvelope.attackSec),
            attackShape: safeParseNumber(dirtyParams.ampEnvelope.attackShape, initOperatorParams.ampEnvelope.attackShape),
            decaySec: safeParseNumber(dirtyParams.ampEnvelope.decaySec, initOperatorParams.ampEnvelope.decaySec),
            decayShape: safeParseNumber(dirtyParams.ampEnvelope.decayShape, initOperatorParams.ampEnvelope.decayShape),
            sustain: safeParseNumber(dirtyParams.ampEnvelope.sustain, initOperatorParams.ampEnvelope.sustain),
            releaseSec: safeParseNumber(dirtyParams.ampEnvelope.releaseSec, initOperatorParams.ampEnvelope.releaseSec),
            releaseShape: safeParseNumber(dirtyParams.ampEnvelope.releaseShape, initOperatorParams.ampEnvelope.releaseShape),
        },
        volume: safeParseNumber(dirtyParams.volume, initOperatorParams.volume),
        pan: safeParseNumber(dirtyParams.pan, initOperatorParams.pan),
    }
}

/** 
 * パッチ用のJSONを安全にパースします。
 * - あくまで型の一致までです。値の上限下限はあとでチェックする想定です。
 */
function safeParseSynthPatchJson(synthPatchJson: string): SynthPatch {
    const dirtyPatch = JSON.parse(synthPatchJson) as SynthPatch; // 危険なas
    return {
        name: safeParseString(dirtyPatch.name, initSynthPatch.name),
        operatorsParams: [
            safeParseOperatorParams(dirtyPatch.operatorsParams[0]),
            safeParseOperatorParams(dirtyPatch.operatorsParams[1]),
            safeParseOperatorParams(dirtyPatch.operatorsParams[2]),
            safeParseOperatorParams(dirtyPatch.operatorsParams[3]),
            safeParseOperatorParams(dirtyPatch.operatorsParams[4]),
            safeParseOperatorParams(dirtyPatch.operatorsParams[5]),
        ],
        bendRange: safeParseNumber(dirtyPatch.bendRange, initSynthPatch.bendRange),
        modulationFrequency: safeParseNumber(dirtyPatch.modulationFrequency, initSynthPatch.modulationFrequency),
    }
}

/**
 * 現在のURLからパッチデータを取得します。構造は安全にしますが、値範囲はここでは確認しません。
 * @returns 取得できない場合はundefinedです。
 */
export function loadPatchFromCurrentURL(): SynthPatch | undefined {
    try {
        const url = new URL(location.href);
        const params = url.searchParams;
        if (params.get("v") != "1") { return undefined; }
        const patchStr = params.get("patch");
        if (patchStr == null || patchStr.length == 0) { return undefined; }
        const jsonStr = decompressFromBase64URI(patchStr);
        return safeParseSynthPatchJson(jsonStr);
    } catch (e) {
        alert(e);
    }
    return undefined;
}