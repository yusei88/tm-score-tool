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

## 3. 依存関係をインストール（backend ディレクトリ想定）

```bash
cd backend
yarn install
```

## 4. マイグレーションと起動

```bash
npx prisma migrate dev --name init
yarn dev
```

## 5. テスト

```bash
yarn test
```

<!-- note removed: backend/ scaffold is present in this repository -->
