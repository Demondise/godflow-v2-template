# Open Questions
> ARCH = architectural (Architect answers) | IMPL = implementation (add to next brief) | BLOCKED = needs user input
> Architect reviews this at start of EVERY planning session.

| Date | Question | Category | Raised By | Status | Resolved In | Resolution |
|---|---|---|---|---|---|---|
| 2026-04-09 | Should delivery be a VS Code Webview Extension instead of a standalone web app? | ARCH | Architect | Resolved | HLD v1.1 | VS Code Webview Extension — full IDE integration, no standalone web app |
| 2026-04-09 | Which GitHub Copilot file formats must be supported? (`copilot-instructions.md` only, or also `.prompt.md` / `.instructions.md`?) | ARCH | Architect | Resolved | HLD v1.2 | Primary export is `.md` (readable). Also support `.prompt.md` and `.instructions.md`. Format chosen per agent type at export time. |
| 2026-04-09 | Should AgentLibrary support JSON import/export for portability beyond localStorage? | ARCH | Architect | Resolved | HLD v1.2 | Yes — export entire library as a single `.json` file; import merges into existing library. This is the team-sharing mechanism (no backend needed). |
| 2026-04-09 | Does `tsconfig.json` with `"types": ["node"]` correctly resolve `@types/vscode` for extension.ts? | IMPL | Builder (I1) | Resolved 2026-04-10 | I1 | Verified during I1 review — resolves correctly in practice. Tracked as low-severity tech debt; add `"vscode"` to `types` array in I2 for explicitness. |
| 2026-04-09 | `vitest.config.ts` was added as a 9th file beyond I1's 8-file limit — should test infrastructure count against the iteration source file budget? | ARCH | Builder (I1) | Resolved 2026-04-10 | I1 | Architect retro-approved. Decision: test infrastructure files (vitest.config.ts, tests/setup.ts, etc.) do NOT count against the source file budget. Logged in DECISIONS.md. |
| 2026-04-10 | `src/webview/index.tsx` silently swallows mount errors when `#root` is missing (I1 Reviewer tech-debt #3). | IMPL | Reviewer (I1) | Open | I3 | Deferred from I2 to stay at 8-file limit. Fix: add `console.error('Mount failed: #root not found')` in the else branch. Track for I3 brief. |
| 2026-04-10 | `vitest.config.ts` default environment is `node` — integration tests require per-file `// @vitest-environment jsdom` pragma (I1 Reviewer tech-debt #4). | IMPL | Reviewer (I1) | Open | TBD | Low priority. Consider switching default to `jsdom` with per-file override for extension host tests in a future iteration. |
