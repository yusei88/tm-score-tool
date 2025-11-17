# Implementation Plan: テラフォーミング・マーズ — ゲームセッション管理

**Branch**: `001-tm-session-management` | **Date**: 2025-11-09 | **Spec**: `/specs/001-tm-session-management/spec.md`
**Input**: Feature specification from `/specs/001-tm-session-management/spec.md`

## Summary

この実装プランは `spec.md` に定義されたゲームセッション管理機能（セッション作成、匿名参加、資源同期、スコア計算、ターン管理、再接続復元）をサーバーサイド中心に実装するための設計・検討記録です。

主要アプローチ: Node.js (Express) + Socket.io によるリアルタイム同期を基本とし、永続化は PostgreSQL を採用、データアクセスは Prisma を用いた型安全な ORM レイヤで行います。サーバー側で直列化された操作順序を担保し、state_version（整数）による楽観的ロック検証で stale 更新を拒否します。契約（REST / WebSocket）は OpenAPI とイベント定義で明確にし、契約テスト + 統合テストを CI に組み込みます。

## Technical Context

**Language/Version**: Node.js 18.x (LTS)  
**Primary Dependencies**: Express.js, Socket.io, Prisma (ORM), pg (Postgres client), Jest, Supertest, Playwright  
**Package manager**: Yarn (latest, preferred)  
**Storage**: PostgreSQL (primary persistent store) with JSONB columns for flexible per-session state where appropriate  
**Testing**: Jest (unit), Supertest (HTTP integration), custom Socket.io test harness (integration/contract), Playwright (E2E critical flows)  
**Target Platform**: Dockerized Linux server (cloud deployment target), developers use macOS for local dev  
**Project Type**: Web application (backend + optional frontend client)  
**Performance Goals**: Session creation < 5s (SC-001); 95% of resource/score updates reflected to clients within 1s (SC-002); persistence/recovery success >= 99% (SC-003). Server processing target: <200ms p95 for single update handling (network excluded).  
**Constraints**: Typical max players per session = 6; ensure idempotent update APIs and optimistic version checks (HTTP 409 on mismatch); CI must provide PostgreSQL test service (container) for contract/integration tests.  
**Scale/Scope**: Expected tens to low hundreds of concurrent sessions in initial deployment; design for horizontal scale via stateless API + shared DB and sticky socket routing if needed.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The following gates are derived from the project constitution and MUST be
verified before research/design proceeds:

- TDD: このプランは TDD に従います。Phase 0/1 で各新機能に対するテストプラン（ユニット + 統合/契約テスト）を記述します。テストはまず失敗する状態で追加し、その後実装でグリーンにします。
- Contract coverage: REST エンドポイントと WebSocket イベントは OpenAPI とイベント定義で記述し、統合テスト（Supertest + Socket.io テスト）で契約を検証します。E2E（Playwright）は重要ユーザージャーニー（セッション作成〜開始〜再接続など）をカバーします。
- Modularity: コアドメイン（セッション管理、スコア計算、ターン管理、永続化）は小さなライブラリ/サービス層として分離します（例: `src/services/sessionService`, `src/lib/scoreCalculator`）。公共インターフェースを明示し、単体テストを充実させます。
- CI considerations: CI (GitHub Actions) は PostgreSQL サービスを用意し、ユニット + 統合（契約）テストを実行します。E2E はオプショングループに分け、短い契約テストはプルリクの必須ゲートとします。期待実行時間: ユニット+統合 ~ < 2 分（初期目標）、E2E 別ゲートで ~5-10 分。

  - Secrets: CI 用のデータベース接続情報は GitHub Secrets で管理します。ローカル開発では `.env` を使って `DATABASE_URL` / `POSTGRES_PASSWORD` 等を管理してください。

- Quality gate: 各タスクの実行後、リポジトリ内に「ビルド／型エラー」や「テスト失敗」を引き起こしているファイルがないかを自動または手動で確認すること。
- Error handling: もしエラーが発生しているファイルがある場合は、そのエラーを解消してから当該タスクを完了済み（[X]）にマークすること。タスク完了の判断は、ビルド（tsc）、ユニットテスト（Jest）、および重要な静的チェックがすべてグリーンであることをもって行う。

Constitution divergence / exceptions:

- Storage choice: constitution の Technology section mentions SQLite3 as an allowed option, but the feature spec explicitly requires PostgreSQL (ACID, transactions) for game persistence and recovery guarantees. This is a conscious deviation: PostgreSQL is chosen because of stronger transactional guarantees and concurrent write behavior required by FR-010 / SC-003. Migration plan: keep an abstracted persistence layer (`src/adapters/db/*`) so switching to SQLite for lightweight local dev or snapshot storage is feasible; CI will run Postgres for authoritative tests.

If any gate cannot be satisfied, the plan will document an exception rationale and a migration plan to reach compliance.

## Project Structure

### Documentation (this feature)

```text
specs/001-tm-session-management/
├── plan.md              # This file (filled)
├── research.md          # Phase 0 output (created)
├── data-model.md        # Phase 1 output (created)
├── quickstart.md        # Phase 1 output (created)
├── contracts/           # Phase 1 output (created)
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── adapters/        # DB adapters, socket adapters
│   ├── services/        # sessionService, scoreCalculator, turnManager
│   ├── api/             # Express route handlers
│   └── lib/             # shared utilities
└── tests/
  ├── unit/
  ├── integration/
  └── contract/

frontend/ (optional)
├── src/
│   ├── components/
│   └── services/        # socket client, api client
└── tests/
```

**Structure Decision**: Web application with backend first (server-managed state + WebSocket). Frontend is separate and optional for this plan; API contracts will be produced for frontend integration.

## Complexity Tracking

| Violation                                                | Why Needed                                                                                                                            | Simpler Alternative Rejected Because                                                                                                                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PostgreSQL instead of SQLite (constitution lists SQLite) | ACID transactions and stronger concurrent write guarantees required for accurate game state persistence and recovery (FR-010, SC-003) | SQLite is acceptable for ephemeral dev but lacks production-grade concurrency and transactional features for multi-player real-time sessions. Abstraction layer planned to allow local SQLite in dev. |
