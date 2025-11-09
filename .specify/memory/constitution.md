<!--
Sync Impact Report

- Japanese Language Requirement
- Version change: unknown -> 1.0.0
- Modified/Added principles:
	- Added: I. Modular, library-first components
	- Added: II. API & Real-time Contract Discipline
	- Added: III. Test-First (TDD) — NON-NEGOTIABLE
	- Added: IV. Integration and E2E Testing for contracts
	- Added: V. Simplicity, Observability & Semantic Versioning
- Added sections:
	- Technology & Architecture Constraints
	- Development Workflow & Quality Gates
- Removed sections: none
- Templates requiring updates:
	- .specify/templates/plan-template.md ✅ updated
	- .specify/templates/tasks-template.md ✅ updated
	- .specify/templates/spec-template.md ⚠ checked (no changes needed)
- Follow-up TODOs:
	- RATIFICATION_DATE: TODO(RATIFICATION_DATE): confirm original adoption date
-->

# Terraforming Mars Game Manager Constitution

## Core Principles

### I. Modular, library-first components

All core domain logic MUST be implemented as small, well-documented, independently
testable modules (libraries) that expose clear contracts. Modules MUST not rely on
monolithic application startup to be testable. Rationale: modular code improves
testability, reuse, and reduces coupling between server/client responsibilities.

### II. API & Real-time Contract Discipline

REST APIs and WebSocket (Socket.io) events are the authoritative contracts between
client and server. Contracts MUST be documented, versioned, and have contract
tests (contract tests) that run in CI. Breaking changes to contracts MUST follow
the versioning policy and include migration guidance.

### III. Test-First (TDD) — NON-NEGOTIABLE

Test-Driven Development is mandatory: for all new behavior, a test (unit/integration)
MUST be written first and observed to fail; implementation follows until the test
passes, then refactor. Tests are part of the specification and serve as the
primary guardrail for correctness and future change.

### IV. Integration & E2E testing for contracts

Integration tests that exercise the REST + WebSocket flows and database
interactions MUST be included for changes that affect runtime contracts. E2E
tests (Playwright/Cypress) are required for critical user journeys (game
session lifecycle, multi-player synchronization). Rationale: real-time sync and
state persistence require cross-layer validation.

### V. Simplicity, Observability & Semantic Versioning

Prefer simple, auditable implementations over complex optimizations (YAGNI).
Instrumentation (structured logs, error context) and meaningful metrics SHOULD be
added for server-side components. Release artifacts MUST follow semantic
versioning: MAJOR for incompatible contract changes, MINOR for additive
functionality, PATCH for bugfixes and clarifications.

## Technology & Architecture Constraints

This constitution constrains core technology choices for consistency across the
project. The agreed stack (documented in README.md and docs/) is:

- Server: Node.js (v18+), Express.js, Socket.io
- Persistence: SQLite3 (or JSON snapshotting for ephemeral use)
- Client: Vue.js 3 (Composition API), Vite, Pinia

Project layout MUST follow the repository structure documented in README.md;
server and client code are separated (see src/server, src/client). Any deviation
from this stack or major tooling upgrades MUST be justified in a proposal and
approved via the amendment process.

## Development Workflow & Quality Gates

- All code changes MUST be delivered via Pull Request with at least one approving
    reviewer.
- CI MUST run unit, integration/contract, and lint checks. PRs that add or
    change runtime contracts MUST include or update contract tests and integration
    tests.
- TDD rule: tests for new functionality MUST exist in the repo and fail before
    implementation begins locally (developer checklist). Tests added MUST be kept
    fast and deterministic; long-running E2E tests can be gated separately.
- Code formatters and linters (configured in root package.json) MUST be applied
    before merging.

## Governance

Amendments to this constitution are managed by pull request. An amendment PR
MUST include:

1. The proposed textual change to this constitution.
2. A migration plan for any repository or runtime changes (tests, templates,
   release notes) required by the amendment.
3. CI green and at least one approval from a project maintainer.

Versioning policy:

- MAJOR: incompatible governance/principle removals or changes that break
    contracts or developer expectations.
- MINOR: addition of new principles, new mandatory sections, or material
    expansions of guidance.
- PATCH: editorial changes, clarifications, and typo fixes.

Compliance reviews:

- Major or minor amendments SHOULD be communicated in the project changelog and
    announced to contributors.
- Periodic review: at least once per year the maintainers SHOULD review
    constitution compliance against top-level templates and CI gates.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date | **Last Amended**: 2025-11-09
