# Iterations Log

## Summary
| ID | Type | Parent | Title | Status | Attempts | Date Started | Date Completed |
|---|---|---|---|---|---|---|---|
| I1 | Standard | — | Extension Scaffold + Webview Form + Live Preview | COMPLETE | 1 | 2026-04-09 | 2026-04-10 |
| I2 | Standard | — | Agent Persistence (Zustand + postMessage bus + globalState) | PLANNED | 0 | 2026-04-10 | — |

## Type Key
- Standard  → Normal iteration
- SPLIT     → Original iteration that was divided (children are I[N]a, I[N]b)
- FIX       → Retry of a failed iteration (same brief, different attempt)
- HOTFIX    → Targets a specific bug in an already-merged module
- REFACTOR  → Cleanup only — no new features
- DESIGN    → Architecture-only work (brain/ updates, no code)

## Iteration Details

### I1 — Extension Scaffold + Webview Form + Live Preview
**Type:** Standard
**Parent:** —
**Status:** COMPLETE
**Attempts:** 1
**Brief:** workspace/iterations/I1/brief.md
**Review Verdict:** PASS (first-pass)
**Date Completed:** 2026-04-10
**Notes:** First iteration. Establishes extension scaffolding, React webview, three-field form, and live markdown preview. No postMessage bus, persistence, or export in scope. Merged 9 files (8 source + 1 Tester-mandated vitest.config.ts).

### I2 — Agent Persistence (Zustand + postMessage bus + globalState)
**Type:** Standard
**Parent:** —
**Status:** PLANNED
**Attempts:** 0
**Brief:** workspace/iterations/I2/brief.md
**Date Started:** 2026-04-10
**Notes:** Introduces `src/types.ts` (shared Agent type + typed message unions), Zustand store (replaces useState in App.tsx), `StorageService` webview bridge, `handleHostMessage` named export in extension.ts with typed command switch, `globalState` persistence under key `agentBuilder.agents`, singleton WebviewPanel guard, and tech-debt cleanup (tsconfig types, package.json publisher). 8 files (3 CREATE, 5 UPDATE). No UI library view — CRUD list deferred to I4. No export — deferred to I3.
