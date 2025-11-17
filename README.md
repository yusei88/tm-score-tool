# Terraforming Mars Game Manager

テラフォーミング・マーズボードゲームのデジタル管理システム

## 概要

このプロジェクトは、テラフォーミング・マーズボードゲームのプレイヤースコア、資源、ターン進行を追跡し、ゲームセッションを効率的に管理するためのサーバー・クライアントアプリケーションです。

## 技術スタック

### サーバーサイド

- Node.js (v18+)
- Express.js (RESTful API)
- Socket.io (WebSocket 通信)
- PostgreSQL (データ永続化)

### クライアントサイド

- Vue.js 3 (Composition API)
- Vite (ビルドツール)
- Pinia (状態管理)
- Socket.io Client

## プロジェクト構造

```code
src
├── server/                 # サーバーサイドアプリケーション
│   ├── src/
│   │   ├── models/        # データモデル
│   │   ├── services/      # ビジネスロジック
│   │   ├── repositories/  # データアクセス層
│   │   ├── routes/        # API ルート
│   │   ├── websocket/     # WebSocket ハンドラー
│   │   └── index.js       # エントリーポイント
│   └── tests/             # サーバーテスト
├── client/                # クライアントサイドアプリケーション
│   ├── src/
│   │   ├── components/    # Vue コンポーネント
│   │   ├── views/         # ページビュー
│   │   ├── stores/        # Pinia ストア
│   │   ├── services/      # API サービス
│   │   └── main.js        # エントリーポイント
│   └── tests/             # クライアントテスト
├── package.json           # ルートパッケージ設定
├── docker-compose-yml     # サーバー・クライアント・DBをまとめて起動する設定
└── Dockerfile             # docker設定

```

## セットアップ

### 前提条件

- Node.js v18 以上
- npm または yarn

### インストール

1. 依存関係のインストール:

```bash
npm run install:all
```

2. 開発サーバーの起動:

```bash
npm run dev
```

これにより、以下が起動します:

- サーバー: <http://localhost:3001>
- クライアント: <http://localhost:3000>

### 個別実行

サーバーのみ:

```bash
npm run dev:server
```

クライアントのみ:

```bash
npm run dev:client
```

## 開発

### テスト実行

```bash
npm test
```

### コードフォーマット

```bash
npm run format
```

### リント

```bash
npm run lint
```

## 機能

- ゲームセッション管理
- プレイヤー資源追跡
- スコア計算とランキング
- ターン管理
- リアルタイム同期
- ゲーム状態の永続化
