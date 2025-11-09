---
description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are REQUIRED and follow the
Test-Driven Development (TDD) rule defined in the constitution: tests for new
functionality MUST be written first and observed to fail before implementation
begins. All feature plans MUST include which tests (unit, integration/contract,
E2E) will be added or updated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

````markdown
---
description: "機能実装のためのタスクリストテンプレート"
---

# タスク: [機能名]

**入力**: `/specs/[###-feature-name]/` 配下の設計ドキュメント
**前提**: plan.md（必須）、spec.md（ユーザーストーリー必須）、research.md、data-model.md、contracts/

**テスト**: 以下の例はテストタスクを含みます。テストは必須で、憲法にある TDD 規約に従います：新しい機能のテストはまず作成して失敗させ、その後実装でグリーンにすること。全ての機能プランは追加または更新するテスト（ユニット／統合・契約／E2E）を明記する必要があります。

**構成**: タスクはユーザーストーリーごとにグループ化し、各ストーリーが独立して実装・検証できるようにします。

## 形式: `[ID] [P?] [Story] 説明`

- **[P]**: 並列化可能（異なるファイルで依存がないこと）
- **[Story]**: そのタスクが属するユーザーストーリー（例: US1, US2, US3）
- 説明には必ず正確なファイルパスを含めてください

## パスの慣例

- **単一プロジェクト**: `src/`, `tests/`（リポジトリルート）
- **Web アプリ**: `backend/src/`, `frontend/src/`
- **モバイル**: `api/src/`, `ios/src/` または `android/src/`
- 下記のパス例は単一プロジェクトを想定しています。`plan.md` の構成に応じて調整してください。

<!--
  ============================================================================
  重要: 下にあるサンプルタスクは説明用です。/speckit.tasks コマンドは必ず以下に基づいて
  実際のタスクに差し替えます：
  - spec.md のユーザーストーリー（優先度 P1,P2,P3...）
  - plan.md の要件
  - data-model.md のエンティティ
  - contracts/ のエンドポイント

  タスクはユーザーストーリーごとに整理され、各ストーリーが:
  - 独立して実装可能
  - 独立してテスト可能
  - MVP として提供可能

  生成された tasks.md にサンプルタスクを残さないでください。
  ============================================================================
-->

## フェーズ 1: セットアップ（共通インフラ）

**目的**: プロジェクト初期化と基本構造の作成

- [ ] T001 実装計画に従ってプロジェクト構造を作成する
- [ ] T002 [言語/フレームワーク] プロジェクトを初期化して依存関係を追加する
- [ ] T003 [P] リンターとフォーマッタを設定する

---

## フェーズ 2: 基盤（ブロッキング前提）

**目的**: すべてのユーザーストーリー実装前に完了すべきコアインフラ

**⚠️ 重要**: このフェーズが完了するまでユーザーストーリー作業は開始できません

例（プロジェクトに応じて調整）:

- [ ] T004 データベーススキーマとマイグレーションのフレームワークを設定する
- [ ] T005 [P] 認証／認可フレームワークを実装する
- [ ] T006 [P] API ルーティングとミドルウェア構成をセットアップする
- [ ] T007 全ストーリーで使う基本モデル／エンティティを作成する
- [ ] T008 エラーハンドリングとロギング基盤を設定する
- [ ] T009 環境設定管理をセットアップする

**チェックポイント**: 基盤が整い次第、ユーザーストーリー実装を並行して開始できます

---

## フェーズ 3: ユーザーストーリー 1 - [タイトル] (優先度: P1) 🎯 MVP

**ゴール**: [このストーリーで提供する機能の簡潔な説明]

**独立検証**: [このストーリーが単独で動作することを検証する方法]

### ユーザーストーリー 1 のテスト（任意）

> **注記: まずテストを作成し、失敗することを確認してください**

- [ ] T010 [P] [US1] 契約テスト: `tests/contract/test_[name].py` にエンドポイントの契約テストを追加
- [ ] T011 [P] [US1] 統合テスト: `tests/integration/test_[name].py` にユーザージャーニーの統合テストを追加

### 実装タスク（ユーザーストーリー 1）

- [ ] T012 [P] [US1] `src/models/[entity1].py` に Entity1 モデルを作成
- [ ] T013 [P] [US1] `src/models/[entity2].py` に Entity2 モデルを作成
- [ ] T014 [US1] `src/services/[service].py` に Service を実装（T012, T013 に依存）
- [ ] T015 [US1] `src/[location]/[file].py` にエンドポイント／機能を実装
- [ ] T016 [US1] バリデーションとエラーハンドリングを追加
- [ ] T017 [US1] ログ出力を追加

**チェックポイント**: この時点でユーザーストーリー 1 は独立して動作・検証できるはずです

---

## フェーズ 4: ユーザーストーリー 2 - [タイトル] (優先度: P2)

（同様の構成で各ストーリーを定義）

---

## フェーズ N: 仕上げ & 横断的対応

**目的**: 複数ストーリーにまたがる改善

- [ ] TXXX [P] ドキュメント更新（`docs/`）
- [ ] TXXX コードのクリーンアップとリファクタ
- [ ] TXXX 全体のパフォーマンス最適化
- [ ] TXXX [P] 追加のユニットテスト（必要に応じて）
- [ ] TXXX セキュリティ強化
- [ ] TXXX `quickstart.md` の検証

---

## 依存関係と実行順

### フェーズ間の依存

- **セットアップ（Phase 1）**: 依存なし。直ちに開始可能
- **基盤（Phase 2）**: セットアップ完了後。全てのユーザーストーリーをブロック
- **ユーザーストーリー（Phase 3+）**: 基盤完了後に開始可能。並行実装も可
- **仕上げ（最終フェーズ）**: すべての対象ストーリー完了後

### ユーザーストーリー間の依存

- **User Story 1 (P1)**: 基盤完了後に開始可能
- **User Story 2 (P2)**: 基盤完了後に開始可能（US1 と統合する場合あり）
- **User Story 3 (P3)**: 同上

### 各ストーリー内の順序

- テスト（含む場合）はまず作成し失敗させる
- モデル → サービス → エンドポイント → 統合 の順で実装
- ストーリーは完了を確認してから次へ進む

### 並列化の機会

- [P] 指定のタスクは並列実行可能
- フェーズ 2 完了後は複数チームで並列実装が可能

---

## 実装戦略

### MVP 優先

1. セットアップを完了する
2. 基盤を完了する（CRITICAL）
3. ユーザーストーリー 1 を完了させる
4. 検証してデプロイ／デモする（MVP）

### 増分デリバリ

（略 - 上と同様の方針）

---

## 注意事項

- [P] タスク = 異なるファイル、依存なし
- [Story] ラベルはトレーサビリティのために必須
- 各ストーリーは独立して実装・検証できること
- テストは失敗から実装へ（TDD）
- 各タスク・論理的なグループごとにコミットする

