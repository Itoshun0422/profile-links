# 🚀 Profile Links - セットアップガイド

このガイドに従って、あなたのプロフィールリンク集をGitHub Pagesに公開しましょう！

## 📋 目次

1. [事前準備](#事前準備)
2. [プロジェクトのセットアップ](#プロジェクトのセットアップ)
3. [情報のカスタマイズ](#情報のカスタマイズ)
4. [GitHub Pagesへのデプロイ](#github-pagesへのデプロイ)
5. [QRコードの作成](#qrコードの作成)

## 事前準備

必要なもの：
- GitHubアカウント
- Node.js（v18以上）
- Git

### Node.jsのインストール確認

ターミナルで以下を実行：

```bash
node --version
npm --version
```

インストールされていない場合は [nodejs.org](https://nodejs.org/) からダウンロードしてください。

## プロジェクトのセットアップ

### 1. GitHubで新しいリポジトリを作成

1. [GitHub](https://github.com)にログイン
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名を入力（例：`profile-links`）
4. Publicを選択
5. 「Create repository」をクリック

### 2. プロジェクトファイルを配置

ダウンロードした `profile-links-project` フォルダの中身を、お好きな場所に配置します。

### 3. ターミナルでプロジェクトディレクトリへ移動

```bash
cd path/to/profile-links-project
```

### 4. 依存関係のインストール

```bash
npm install
```

### 5. ローカルで確認

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いて確認できます。

## 情報のカスタマイズ

### プロフィール情報の編集

`src/ProfileLinks.jsx` を開いて、以下の箇所を編集します：

```javascript
const profile = {
  name: "あなたの名前",  // ← ここを変更
  title: "あなたの肩書き",  // ← ここを変更
  avatar: "プロフィール画像のURL",  // ← ここを変更
  bio: "あなたの自己紹介文",  // ← ここを変更
};
```

### プロフィール画像の準備

以下のいずれかの方法で画像URLを取得：

1. **Unsplash（フリー素材）**
   - [Unsplash](https://unsplash.com/)で画像を探す
   - 画像を開いて右クリック→「画像アドレスをコピー」

2. **自分の画像をアップロード**
   - [Imgur](https://imgur.com/)などにアップロード
   - 画像URLをコピー

### リンクの編集

```javascript
const links = [
  {
    title: "Portfolio",  // ← リンクのタイトル
    url: "https://example.com/portfolio",  // ← リンク先URL
    icon: "🎨",  // ← アイコン（絵文字）
    gradient: "from-blue-900 to-indigo-800"  // ← グラデーション
  },
  // 以下、必要に応じて追加・削除
];
```

### リンクの追加例

```javascript
{
  title: "YouTube",
  url: "https://youtube.com/@yourchannel",
  icon: "📺",
  gradient: "from-red-900 to-pink-800"
},
```

### 絵文字の探し方

[Emojipedia](https://emojipedia.org/) で検索して、好きな絵文字をコピー＆ペーストできます。

## GitHub Pagesへのデプロイ

### 方法1: GitHub Actions（推奨・自動デプロイ）

#### ステップ1: 設定ファイルの編集

`vite.config.js` を開いて、`base` をあなたのリポジトリ名に変更：

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/あなたのリポジトリ名/',  // ← ここを変更
})
```

例：リポジトリ名が `my-profile` なら `/my-profile/`

#### ステップ2: Gitの初期化とプッシュ

```bash
# Gitの初期化
git init

# すべてのファイルをステージング
git add .

# コミット
git commit -m "Initial commit"

# リモートリポジトリを追加（GitHubで作成したリポジトリのURL）
git remote add origin https://github.com/あなたのユーザー名/あなたのリポジトリ名.git

# mainブランチに名前変更（必要に応じて）
git branch -M main

# プッシュ
git push -u origin main
```

#### ステップ3: GitHub Pagesの設定

1. GitHubのリポジトリページへ移動
2. 「Settings」タブをクリック
3. 左メニューの「Pages」をクリック
4. **Source** を「GitHub Actions」に変更
5. 自動的にデプロイが開始されます

#### ステップ4: デプロイの確認

1. 「Actions」タブでデプロイの進行状況を確認
2. 完了したら、URLが表示されます：
   `https://あなたのユーザー名.github.io/あなたのリポジトリ名/`

### 方法2: gh-pagesコマンド（手動デプロイ）

#### ステップ1: package.jsonの編集

`package.json` の `homepage` を編集：

```json
"homepage": "https://あなたのユーザー名.github.io/あなたのリポジトリ名"
```

#### ステップ2: デプロイ

```bash
# 初回のみGitの設定
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/あなたのユーザー名/あなたのリポジトリ名.git
git push -u origin main

# デプロイ実行
npm run deploy
```

## QRコードの作成

サイトが公開されたら、QRコードを作成しましょう。

### おすすめQRコード作成サービス

1. **QRコード作成【無料】**
   - URL: https://www.cman.jp/QRcode/
   - 高解像度対応
   - 色のカスタマイズ可能

2. **QR Code Generator**
   - URL: https://www.qr-code-generator.com/
   - デザインQRコード作成可能

3. **QRのススメ**
   - URL: https://qr.quel.jp/
   - シンプルで使いやすい

### 名刺印刷のポイント

- **解像度**: 300dpi以上を推奨
- **サイズ**: 2cm × 2cm 程度が読み取りやすい
- **余白**: QRコードの周囲に余白を確保
- **色**: 高コントラストを保つ（紺の名刺なら白背景のQRコード）

## 🎨 カスタマイズのヒント

### 色の変更

紺以外の色に変更したい場合、Tailwindの色クラスを変更：

```javascript
// 紫系
gradient: "from-purple-900 to-pink-800"

// 緑系
gradient: "from-emerald-900 to-teal-800"

// 赤系
gradient: "from-rose-900 to-red-800"
```

### アニメーション速度の調整

```javascript
// 遅くする
className="transition-all duration-1000"  // 1秒

// 速くする
className="transition-all duration-300"  // 0.3秒
```

## トラブルシューティング

### デプロイ後に404エラーが出る

`vite.config.js` の `base` 設定を確認してください。

### 画像が表示されない

画像URLが正しいか、HTTPSで始まっているか確認してください。

### ローカルで動くが本番で動かない

ブラウザのコンソールでエラーを確認し、パスの問題がないかチェックしてください。

## 📞 サポート

問題が解決しない場合は、GitHubのIssuesで質問してください。

## 🎉 完成！

お疲れ様でした！これで名刺に載せられる素敵なプロフィールリンク集が完成しました。
