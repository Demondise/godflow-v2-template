# Project Status — Agent Builder for GitHub Copilot
> Last updated: 2026-04-10 (post-I1 merge)
> Current phase: MVP
> Phase completion: ~10% toward MVP

---

## What We Are Building
Agent Builder for GitHub Copilot is a VS Code extension that lets developers define, save, and export purpose-built Copilot agent configurations — replacing the repetitive context-setting work required before every AI-assisted task. Users build agents through a form-driven UI, choose from pre-built templates, and export valid configuration files directly into their GitHub repo. The result is a personal library of reusable, task-specific Copilot agents that deliver consistent, expert-level assistance without prompting from scratch every time.

---

## Current Phase — What "Done" Means

Phase: MVP

Phase goal: A developer can open the extension, build a Copilot agent (from scratch or from a template), preview the generated output, save it to their library, and export it as a working `.github/copilot-instructions.md` file — all within VS Code, with no external dependencies, covering at least 5 pre-built templates and full CRUD on the agent library.

Constraints for this phase (all agents follow these):
1. No backend, server, or external API calls — all functionality runs within VS Code (extension host + webview only)
2. No multi-user or team collaboration features — single-user, local library only (ShareService deferred)
3. Webview UI only — no VS Code TreeView, StatusBar, or native panel implementations
4. No Copilot API integration — output is static file generation only; no live session control
5. No authentication or credential handling of any kind

---

## What Is Already Built
> Updated after every merge.

| Module | Status | Built in | What it does |
|---|---|---|---|
| Extension scaffold + Webview form + Live preview | ✅ Complete | I1 | Extension entry point, WebviewPanel with CSP, 3-field React form (Name/Role/System Instructions), live markdown preview rendered in `<pre>` |

Module status key:
✅ Complete — in src/, tested, merged
🔄 In Progress — current iteration
⏳ Planned — in roadmap, not started
❌ Deferred — was planned, moved to later phase
🚫 Out of Scope — explicitly excluded from this phase

---

## What's Coming Next

I2: Agent Persistence — StorageService + globalState + postMessage bus + Zustand + full `Agent` type (id, createdAt, updatedAt)
I3: Agent Export — ExportService + `vscode.workspace.fs` writes to `.github/copilot-instructions.md`
I4: Agent Library — CRUD list view (read, update, delete, duplicate)

---

## Key Architecture Decisions
> Updated by Architect after every merge. Full history in brain/DECISIONS.md.

- Tailwind 4.x via `@tailwindcss/vite` (no postcss config) — I1
- Single `tsconfig.json` covers extension host only; Vite compiles webview TypeScript independently — I1
- Named export pattern for unit-testable functions (`getWebviewContent`, `formatAgentPreview`) — I1
- CSP nonce threading: `default-src 'none'; script-src 'nonce-${n}'; style-src ${cspSource};` + matching `<script nonce>` attribute — I1
- Webview `<pre>{string}</pre>` for raw markdown preview (no `dangerouslySetInnerHTML`) — I1
- `useState` used in I1; Zustand deferred to I2 when shared state first appears

---

## Known Issues and Active Technical Debt

| Issue | Severity | Introduced | Plan |
|---|---|---|---|
| `tsconfig.json` `"types": ["node"]` does not list `"vscode"` — works in practice but non-standard | Low | I1 | Add `"vscode"` to types array in I2 |
| No singleton WebviewPanel guard — multiple `agentBuilder.open` invocations create duplicate panels | Low | I1 | Add panel tracking + `panel.reveal()` in I2 |
| `index.tsx` silently fails if `#root` is missing (guard swallows mount errors) | Low | I1 | Add `console.error` fallback in I2 |
| `vitest.config.ts` default environment is `node`; integration tests need per-file jsdom pragma | Low | I1 | Consider switching default to `jsdom` in I2 |
| `package.json` missing `publisher` field — required for `vsce package` | Low | I1 | Add placeholder in I2 (blocks I3/packaging) |

---

## Deferred Features (Do Not Implement Yet)

- Real-time Copilot API integration or live session control
- Multi-user / team collaboration and agent sharing (ShareService)
- Public marketplace for agents
- Support for non-GitHub AI coding assistants (Cursor, Codeium, etc.)
- Automated git push or deployment of exported agent files

---

## Recent Changes (Last 3 Iterations)

- **I1 (merged 2026-04-10):** Extension scaffold + React webview + 3-field form + live markdown preview. First-pass review PASS. 9 files added (~200 lines). Test suite bootstrapped (4 functional, 1 integration, 1 e2e).
