# quickstart.md

最小構成でローカル開発を始める手順（Postgres を使う想定）。

## 1. Docker で Postgres を起動

```bash
docker run --name tm-pg -e POSTGRES_PASSWORD=pass -p 5432:5432 -d postgres:15
```

## 2. 環境変数（例）

```env
DATABASE_URL=postgresql://postgres:pass@localhost:5432/postgres
PORT=3000
```

ローカルでは `.env` ファイルを使って環境変数を管理してください。例:

```env
POSTGRES_PASSWORD=pass
DATABASE_URL=postgresql://postgres:pass@localhost:5432/postgres
PORT=3000
```

## 3. 依存関係をインストール（backend ディレクトリ想定）

```bash
cd backend
yarn install
```

## 4. マイグレーションと起動

```bash
yarn prisma migrate dev --name init
yarn dev
```

## 5. テスト

```bash
yarn test
```

## シード（サンプルデータ挿入）

ローカルでシードを実行するには `.env` に `DATABASE_URL` を設定した上で次を実行します:

```bash
cd backend
yarn prisma:seed
# もしくは直接 tsprisma を呼ぶ: yarn tsprisma
```

<!-- note removed: backend/ scaffold is present in this repository -->
