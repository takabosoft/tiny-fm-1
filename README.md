# TinyFM1

FM音源の理解を深めるためにブラウザ上で動作する簡易的なFMシンセサイザーを開発しました。  
こちらで動作します。  
https://takabosoft.github.io/tiny-fm-1/

* 6オペレーターを搭載
* 各オペレーターにアンプリチュードエンベロープを搭載
* ステレオ対応
* MIDIデバイス入力に対応
* PCキーボードからの入力に対応（ZXC...）
* スペクトラムアナライザー搭載
* プリセット機能（※ただし音色はまだ無い）
* 音色シェア機能（URLパラメーターに音色情報を付与）
* オープンソースなのでカスタマイズ仕放題

### 動作環境

* Windows + Chrome + フルハイモニター
* その他環境では未検証（スマホではおそらくスペック不足）

### 雑記

* レイテンシーはブラウザによって自動調節されますが、ブラウザを再起動すると短くなるようです。
* 今のところWaveTableは使わずMath.sinでサイン波を生成していますが、今後重く感じて来たら置き換えるかもしれません。
* 信号処理はほぼ初めて実装したのでいろいろ間違ってたら教えてください。

### ソースビルド方法

VSCode + node.jp + npmで動作します。

#### 各ライブラリをインストール（一度のみ）

```
npm install
```

#### 開発時

開発時はバンドラーによる監視とローカルWebサーバーを立ち上げます。

```
npx webpack -w
```

```
npx live-server docs
```

なおIPでアクセスする場合（LAN内の他の端末で試すなどする場合）はHTTPSで接続しないと`audioWorklet.addModule`が動作しません。

SCSSは拡張機能で[Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=glenn2223.live-sass)を利用します。

#### リリース時

```
npx webpack --mode=production
```
