# CODEMAP — Source Code Navigation Map
> Updated: 2026-04-10 | Last Iteration: I1 | Total files: 9 | Total estimated lines: ~200

## src/ File Registry

| File | Purpose | Created | Last Modified | Modified By | Status | Notes |
|---|---|---|---|---|---|---|
| package.json | Extension manifest, scripts, devDependencies | I1 | I1 | Builder | Active | Declares `agentBuilder.open` command |
| tsconfig.json | Extension host TypeScript config | I1 | I1 | Builder | Active | Covers only src/extension.ts; webview built by Vite |
| vite.config.ts | Webview bundler config (IIFE lib mode) | I1 | I1 | Builder | Active | @vitejs/plugin-react + @tailwindcss/vite |
| vitest.config.ts | Test runner config | I1 | I1 | Builder | Active | Includes ../tests/**; excludes e2e |
| src/extension.ts | Extension entry — registers command, creates WebviewPanel, exports getWebviewContent | I1 | I1 | Builder | Active | Named export `getWebviewContent` for CSP unit testing |
| src/webview/constants.ts | User-visible label and section heading string constants | I1 | I1 | Builder | Active | 7 exported constants |
| src/webview/App.tsx | React form + live preview; exports formatAgentPreview | I1 | I1 | Builder | Active | useState (Zustand deferred to I2) |
| src/webview/index.tsx | React 18 root mount | I1 | I1 | Builder | Active | Imports index.css |
| src/webview/index.css | Tailwind 4 entry (`@import "tailwindcss"`) | I1 | I1 | Builder | Active | Compiled by @tailwindcss/vite |

## Status Key
- Active   → File exists in src/, in current use
- Deleted  → File was removed in a later iteration (kept for audit trail)
- Pending  → File has changes in an in-progress iteration's draft/ (not yet merged)

## Pending Changes Register
> Files currently being modified by an in-progress iteration
> Updated by Architect at the start of every planning session

| File | Being modified by | Expected merge |
|---|---|---|
| src/types.ts | I2 (CREATE) | After I2 review PASS |
| src/webview/storageService.ts | I2 (CREATE) | After I2 review PASS |
| src/webview/store.ts | I2 (CREATE) | After I2 review PASS |
| src/extension.ts | I2 (UPDATE) | After I2 review PASS |
| src/webview/App.tsx | I2 (UPDATE) | After I2 review PASS |
| src/webview/constants.ts | I2 (UPDATE) | After I2 review PASS |
| package.json | I2 (UPDATE) | After I2 review PASS |
| tsconfig.json | I2 (UPDATE) | After I2 review PASS |

## Module Index (quick lookup)
| Module | Files | Created | Last touched |
|---|---|---|---|
| Extension Host | src/extension.ts | I1 | I1 |
| Webview UI | src/webview/App.tsx, src/webview/index.tsx, src/webview/index.css, src/webview/constants.ts | I1 | I1 |
| Build/Config | package.json, tsconfig.json, vite.config.ts, vitest.config.ts | I1 | I1 |

---

## How to Maintain This File

### After every merge (Architect — Workflow 06):
1. For every CREATE in MANIFEST.md → add new row: Created = I[N], Last Modified = I[N]
2. For every UPDATE in MANIFEST.md → update `Last Modified` and `Modified By`
3. For every DELETE in MANIFEST.md → set Status = Deleted, add deletion note
4. Remove merged files from the Pending Changes Register
5. Update total file count and estimated lines in the header

### Before every planning session (Architect Planning Ritual — Step 0):
1. Read Pending Changes Register — are any files being modified by an in-progress iteration?
2. If yes → note as "FILE CONFLICT RISK" items in the new brief's Technical Notes
3. If no → proceed normally

### Builder reads CODEMAP to determine Operation type:
- Status = Active, exists in CODEMAP → Operation = UPDATE. Load current src/ file.
- Not in CODEMAP → Operation = CREATE. Write from scratch.
- Status = Pending (another iteration working on it) → FLAG to Architect before building.
