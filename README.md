# TinyFM1

FM音源の理解を深めるためにブラウザ上で動作する簡易的なソフトウェアシンセサイザーを開発しました。
こちらで動作します。
https://takabosoft.github.io/tiny-fm-1/

* 6オペレーターを搭載
* 各オペレーターにアンプリチュードエンベロープを搭載
* ステレオ対応
* MIDIデバイス入力に対応
* PCキーボードからの入力に対応（ZXC...）
* スペクトラムアナライザー搭載
* プリセット機能（※ただし音色はまだ無い）
* オープンソースなのでカスタマイズ仕放題
* 音色シェア機能（URLパラメーターに音色情報を付与）

### 動作環境

* Windows + Chrome + フルハイモニタ
* その他環境では未検証（スマホではおそらくスペック不足）

### 雑記

* 今のところWaveTableは使わずMath.sinでサイン波を生成していますが、今後重く感じて来たら置き換えるかもしれません。
* 信号処理はほぼ初めて実装したのでいろいろ間違ってたら教えてください。
