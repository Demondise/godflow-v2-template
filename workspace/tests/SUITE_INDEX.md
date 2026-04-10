# Test Suite Index
> This file is the master index of ALL tests ever written across all iterations.
> Updated by Architect during Workflow 06 merge (Step 4b) — one row per test file copied to workspace/tests/.
> Read by Release Validator as TIER 1 — must exist and be current before any validation run.

| Test File | Module | Type | Iteration | Flow Covered | Mock Level | Status |
|---|---|---|---|---|---|---|
| functional/extension.csp.test.ts | extension.ts | Functional | I1 | CSP nonce threading in `getWebviewContent` — CSP meta contains `nonce-`, matching `<script nonce>` attribute, no `unsafe-inline`/`unsafe-eval`, `style.css` link present | HIGH (mocks `vscode` module) | ACTIVE |
| functional/formatAgentPreview.test.ts | webview/App.tsx | Functional | I1 | `formatAgentPreview` pure-function output for empty, partial, and full form states (strict markdown format) | NONE | ACTIVE |
| functional/static.labels.test.ts | webview/App.tsx, webview/constants.ts | Functional | I1 | Static analysis — no hardcoded English label strings in JSX; all labels sourced from constants.ts | NONE | ACTIVE |
| functional/static.types.test.ts | src/**/*.ts, *.tsx | Functional | I1 | Static analysis — no `: any`, `as any`, or `@ts-ignore` in source files | NONE | ACTIVE |
| integration/app.form.integration.test.tsx | webview/App.tsx | Integration | I1 | React form render, three-field input, live preview update on change, `<pre>` element, XSS-safe text rendering | LOW (jsdom + React Testing Library) | ACTIVE |
| e2e/agent-builder.open.e2e.test.ts | extension.ts | E2E | I1 | `agentBuilder.open` command registers and opens WebviewPanel in real VS Code instance | NONE | ACTIVE |

Test types: Functional / Integration / E2E
Mock Level: NONE / LOW / HIGH (HIGH = test mocks most dependencies — Release Validator flags as WARNING)
Status: ACTIVE / DEPRECATED (if the feature was removed or redesigned)
