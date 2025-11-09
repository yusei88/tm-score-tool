# tasks.md

機能: テラフォーミング・マーズ — ゲームセッション管理
仕様: /Users/yusei/work/tm-score-tool/specs/001-tm-session-management/spec.md
計画: /Users/yusei/work/tm-score-tool/specs/001-tm-session-management/plan.md

## 概要

このファイルはフェーズごと（Phase 1..N）に分け、各ユーザーストーリー（US-1..US-5）ごとに独立して実装・検証できるようタスクを分解しています。TDD（テストファースト）方針に従い、まず失敗するテストを追加するタスクを含めます。

---

## フェーズ 1 — セットアップ

- [x] T001 `backend/` にバックエンドのプロジェクト雛形と `package.json` を初期化する
- [x] T002 `backend/src`, `backend/src/adapters`, `backend/src/services`, `backend/src/api`, `backend/src/lib`, `backend/tests/unit`, `backend/tests/integration`, `backend/tests/contract` のディレクトリを作成する
- [x] T003 `backend/package.json` に開発依存とスクリプトを追加する（express, socket.io, prisma, jest, supertest など）
- [x] T004 `.gitignore` を追加し、`backend/README.md` に最小の実行・テスト手順を記載する

## フェーズ 2 — 基盤（ブロッキング前提条件）

- [ ] T005 [P] `backend/prisma/schema.prisma` を作成し、GameSession/Player/TurnState のスキーマを定義する（`data-model.md` と整合）
- [ ] T006 [P] DB クライアントアダプタ `backend/src/adapters/dbClient.ts` を実装する（Prisma クライアント初期化、トランザクション関数をエクスポート）
- [ ] T007 [P] Express サーバーのエントリ `backend/src/index.ts` を作成し、`/healthz` エンドポイントを実装する
- [ ] T008 [P] Socket.io アダプタ `backend/src/adapters/socket.ts` を作成し、サーバにアタッチする関数をエクスポートする
- [ ] T009 [P] GitHub Actions の初期 CI ワークフロー `.github/workflows/ci.yml` を追加し、Postgres サービスでユニット＋統合テストを実行する
- [ ] T010 Prisma マイグレーションとシード用ヘルパー `backend/prisma/seed.ts` を作成する（サンプルセッション/プレイヤーを作成）

---

## フェーズ 3 — ユーザーストーリー（優先順）

### US-1: セッション作成と参加 (P1)

独立検証基準: `POST /sessions` が 201 を返し `session_id` を含むこと。`POST /sessions/{id}/join` が `player_id` を含むプレイヤーオブジェクトを返すこと。契約テストで両方を網羅すること。

- [ ] T011 [US1] 型・インターフェース定義ファイル `backend/src/models/gameSession.ts` を追加する（`data-model.md` に合わせる）
- [ ] T012 [US1] 型・インターフェース定義ファイル `backend/src/models/player.ts` を追加する（`data-model.md` に合わせる）
- [ ] T013 [US1] セッション作成の失敗するユニットテストを `backend/tests/unit/sessionService.test.ts` に追加する（TDD: 新規セッションが永続化され、`state_version` が 1 で始まることを検証）
- [ ] T014 [US1] `backend/src/services/sessionService.ts` を実装する（createSession, getSessionById, persist, state_version のインクリメント）
- [ ] T015 [US1] Express ハンドラ `backend/src/api/sessions.ts` を追加し、`POST /sessions` と `GET /sessions/{id}` を実装する
- [ ] T016 [US1] API ハンドラ `backend/src/api/join.ts` を追加し、`POST /sessions/{id}/join`（Player を作成して player_id を返す）を実装する
- [ ] T017 [US1] 統合／契約テスト `backend/tests/integration/sessions.contract.test.ts` を追加する（Supertest を用いて Express + テスト用 Postgres に対して実行）

並列作業の候補: スキーマ定義後は T005/T006 と並行して T011/T012/T013 を進められます。

### US-2: 資源のリアルタイム管理 (P1)

独立検証基準: 有効な `base_version` での資源更新は適用され `state_version` が増え、クライアントは `state_update` ソケットイベントで新状態を受け取ること。

- [ ] T018 [US2] 資源更新ロジックの失敗するユニットテストを `backend/tests/unit/resourceService.test.ts` に追加する（負値拒否、stale base_version 拒否を検証）
- [ ] T019 [US2] `backend/src/services/resourceService.ts` を実装する（変更適用、非負バリデーション、base_version による楽観的検証）
- [ ] T020 [US2] HTTP クライアント用の POST エンドポイント `backend/src/api/resources.ts` を追加する（ペイロードに base_version を含む）
- [ ] T021 [US2] WebSocket ハンドラ `backend/src/adapters/socketHandlers/resourcesHandler.ts` を実装し、`update_resources`（base_version, delta）を受け取り `state_update` をセッションルームにブロードキャストする
- [ ] T022 [US2] 統合テスト `backend/tests/integration/resource_sync.test.ts` を追加する（socket.io テストハーネスでサーバ適用とブロードキャストを検証）

### US-3: スコア計算とリーダーボード (P1)

独立検証基準: `scoreCalculator` が既知のテストベクタに対して決定的な合計を返すこと。リーダーボードエンドポイントが合計でソートされたプレイヤー一覧を返すこと。

- [ ] T023 [US3] スコア計算のユニットテストを `backend/tests/unit/scoreCalculator.test.ts` に追加する（仕様 SC-004 のテストベクタを使用）
- [ ] T024 [US3] `backend/src/lib/scoreCalculator.ts` を実装する（内訳と合計の計算）
- [ ] T025 [US3] セッションのリーダーボードを返すエンドポイント `backend/src/api/leaderboard.ts` を追加する
- [ ] T026 [US3] 統合テスト `backend/tests/integration/leaderboard.contract.test.ts` を追加する（TR/資源変更に応じたリーダーボード更新を検証）

### US-4: ターン／世代管理 (P2)

独立検証基準: プレイヤーのターン終了で `current_player_id` が正しく遷移し、全員がパスしたら生産フェーズに移行すること。

- [ ] T027 [US4] ターン管理のユニットテストを `backend/tests/unit/turnManager.test.ts` に追加する（ターン終了、パスフラグ、世代進行を検証）
- [ ] T028 [US4] `backend/src/services/turnManager.ts` を実装する（current player、turn order、passed flags、世代進行）
- [ ] T029 [US4] API ハンドラ `backend/src/api/turns.ts` を追加し、`POST /sessions/{id}/end-turn` と `POST /sessions/{id}/pass` を実装する
- [ ] T030 [US4] 統合テスト `backend/tests/integration/turn_flow.test.ts` を追加する（複数プレイヤーのターン進行を検証）

### US-5: 再接続と状態復元 (P2)

独立検証基準: 切断→再接続のテストでクライアントが最新状態を受け取り、同じ `player_id` を維持すること。DB のスナップショット/復元が検証されること。

- [ ] T031 [US5] スナップショット/復元のユニットテストを `backend/tests/unit/snapshot.test.ts` に追加する（セッション状態の永続化と再読み込みを検証）
- [ ] T032 [US5] スナップショット保存/復元ヘルパー `backend/src/adapters/snapshot.ts` を実装する（スナップショット blob とイベント履歴のオプション保存）
- [ ] T033 [US5] ソケット再接続ハンドラ `backend/src/adapters/socketHandlers/reconnectHandler.ts` を実装し、接続時に最新状態を取得して `state_update` を送信する
- [ ] T034 [US5] 統合テスト `backend/tests/integration/reconnect.test.ts` を追加する（切断と再接続をシミュレートし、状態復元を検証）

---

## 最終フェーズ — 仕上げ & 横断懸念

- [ ] T035 `specs/001-tm-session-management/contracts/openapi.yaml` を完全なスキーマと例で更新する
- [ ] T036 契約テスト実行スクリプト `backend/tests/contract/run_contracts.sh` と CI ジョブステップを追加する
- [ ] T037 CI バッジとドキュメントを `specs/001-tm-session-management/quickstart.md` とトップレベル README に追記する
- [ ] T038 可観測性チェックリストを文書化し、`backend/src/lib/logger.ts` に基本的な構造化ログを追加する

---

## 依存関係（ストーリー完了順）

- 基盤フェーズ（Phase 1 & 2: T001..T010）は、ストーリー実装タスク（T011+）より先に完了する必要があります
- US-1 (T011..T017) は、一部の US-2/US-3 の統合テストが永続化されたセッションを前提とするため先行する必要があります。ただしサービス実装は並行可能です。
- US-2 と US-3 は主に独立しており、Foundational 完了後に並行して進められます。
- US-4 と US-5 はコアのセッション/プレイヤー永続化とソケット基盤に依存するため、US-1 の完了後にスケジュールすることを推奨します。

## 並列実行例

- 例 A（並列）：T005, T006, T011, T012, T013 はスキーマ設計後に並列で進められます
- 例 B（並列）：T019（resourceService）と T024（scoreCalculator）は DB アダプタに依存するが相互依存はなく並行実装可能です

## 集計・要約

- 合計タスク数: 38
- ストーリー別タスク数:
  - US-1: 7 件 (T011..T017)
  - US-2: 5 件 (T018..T022)
  - US-3: 4 件 (T023..T026)
  - US-4: 4 件 (T027..T030)
  - US-5: 4 件 (T031..T034)
  - セットアップ/基盤/仕上げ: 14 件 (T001..T010, T035..T038)
- 並列化の可能性: 複数あり（上記参照）
- 推奨 MVP: US-1（セッション作成/参加）＋最小限の永続化＋ソケット基盤（T001..T017、加えて T005/T006/T008）

## 実装戦略

- MVP 優先: まず US-1 を完成させ、in-memory のフォールバックを用意しておきつつテストは Postgres を用いる。次に US-2（資源同期）と US-3（スコア）を順次追加する。サービスは小さく分離しテスト容易性を保つ。
- TDD: 各実装タスクに対してまず該当のユニットテスト（失敗する状態）を追加し、実装でグリーンにしてから統合/契約テストを追加するワークフローを徹底する。

## 検証

- すべてのタスクはチェックリスト形式（ID とファイルパス）に従っています。希望であれば、トップ優先の失敗テスト `T013` を作成するか、`T001..T004` 相当のバックエンド雛形をスキャフォールドして作業を開始します。
