# data-model.md

## エンティティ一覧

1. GameSession

    - session_id: uuid (PK)
    - owner_id: uuid (player_id of owner)
    - status: enum {pending, in_progress, finished}
    - current_generation: integer
    - state_version: integer (monotonic increment)
    - global_metrics: JSONB {oxygen: number, temperature: number, ocean: number}
    - created_at, updated_at: timestamps

2. Player

    - player_id: uuid (サーバー発行, セッション間で持続)
    - session_id: uuid (FK)
    - display_name: string (1-32 chars)
    - resources: JSONB {mc, steel, titanium, plants, energy, heat} (integers >= 0)
    - TR: integer
    - milestones: JSONB (array of milestone ids)
    - awards: JSONB (array of award ids)
    - connected: boolean
    - created_at, updated_at

3. TurnState

    - id: uuid
    - session_id: uuid (FK)
    - current_player_id: uuid
    - turn_order: JSONB (array of player_ids)
    - passed_flags: JSONB (map player_id => boolean)

4. Score (derived / materialized view)

    - player_id: uuid
    - breakdown: JSONB {TR, awards, milestones, cards}
    - total: integer

5. PersistentEvent / Snapshot (optional)
    - id, session_id, event_type, payload (JSONB), created_at
    - snapshot: session state blob for fast restore

## バリデーションルール（主要）

- display_name: required, 1-32 文字、制御文字禁止
- resources.*: integer、>= 0（負値は明示的に拒否する）
- サーバー側の扱い:
    - HTTP リクエストで負値が含まれる場合、サーバーは 400 Bad Request を返し、どのフィールドが無効かを示すバリデーションエラーを返すこと（例: {"error": "validation", "details": {"resources.megaCredits": "must be >= 0"}}）。
    - WebSocket ペイロードで負値が検出された場合、サーバーはエラーイベント（例: {"type": "validation_error", "message": "resource values must be non-negative", "details": {...}}）を返し、その更新を無視すること。
    - サーバーは不正ペイロードをログに記録し、監査用メトリクス（例: invalid_payload_count）を増加させること。
- state_version: 更新毎に +1。クライアントは base_version を送る（HTTP/WS payload に含める）。

## 状態遷移（概要）

- pending -> in_progress: 全員集合 or ゲーム開始アクション
- in_progress -> finished: global_metrics が閾値を満たす

## DB モデル実装ノート

- JSONB は柔軟性を提供しつつ、主要検索（session_id, player_id）を正規化／インデックス化する。
- スコアは頻繁に読まれるため materialized view / キャッシュを用いる検討。
