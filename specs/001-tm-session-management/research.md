# research.md

## 目的

このドキュメントは `plan.md` の NEEDS CLARIFICATION を解決するための調査結果をまとめます。決定、根拠、検討した代替案を記載します。

---

## 決定一覧

1. 決定: サーバー実装は Node.js 18.x、Express + Socket.io を採用

    - 根拠: プロジェクト憲法で Node.js / Express / Socket.io が標準として示されており、リアルタイムイベントに実績があるため。
    - 代替: Go + WebSocket、Elixir/Phoenix。理由: 学習コスト・既存チームスキルの観点で非優先。

2. 決定: 永続化は PostgreSQL（JSONB を一部利用）

    - 根拠: FR-010, SC-003 により ACID と堅牢なトランザクションが必要。Postgres は CI/運用の既知の選択肢で移行性が高い。
    - 代替: SQLite（軽量）、イベントソーシング（複雑）。SQLite は並行性で制約があり、本番向け要件を満たしにくい。イベントソーシングは将来的に検討可能だが初期導入コストが高い。

3. 決定: ORM は Prisma を採用

    - 根拠: 型安全、開発 DX、Migration サポートが良好。Postgres と相性が良い。
    - 代替: TypeORM, Objection/Knex, raw pg。Prisma はスキーマが明確になりやすく初期開発が速い。

4. 決定: 同時更新の方針はサーバー直列化 + optimistic version check

    - 根拠: 要件で「サーバー直列化」を明記。サーバーは操作を受け取り順序を決めて適用し、state_version を増やす。クライアントは更新に base_version を付与し、不一致時は 409 を返す。
    - 代替: CRDT（複雑かつ過剰）、完全な楽観的マージ（衝突解消が困難）。

5. 決定: テストツールは Jest + Supertest + Socket.io テストハーネス、E2E は Playwright

    - 根拠: TDD を満たすためにユニットと統合（契約）テストが必須。Socket.io の統合は専用ハーネスで実行する。Playwright は重要なユーザージャーニーの E2E に用いる。

6. 決定: CI は GitHub Actions、Postgres サービスを提供し契約テストを走らせる
    - 根拠: リポジトリ標準・広く利用されているワークフロー。

---

## 未解決のリスク（次フェーズで完全化）

- DB スキーマの最適化（JSONB と正規化の境界）は Phase 1 で詳細設計する。
- スケール戦略（Socket スケーリング／Sticky session、RedisPubSub など）は負荷試験で決定する。

---

## まとめ

初期フェーズは Node.js + Express + Socket.io + Postgres + Prisma の組み合わせで進め、TDD を前提に契約テストと統合テストを CI に組み込みます。次は data-model.md と contracts を作成します。
