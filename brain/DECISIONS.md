# Decision Log
> Append-only. Never delete or modify past entries.
> READ: Architect reads last 10 entries at start of EVERY planning session.
> If new decision contradicts old one, new supersedes — note clearly.

| Date | Decision | Reasoning | Made By | Still Active? |
|---|---|---|---|---|
| 2026-04-09 | Tech stack: React + TypeScript + Vite SPA | No backend needed for v1 (single-user, local-only); fastest path to working UI | Architect | Yes |
| 2026-04-09 | Persistence: localStorage only | Zero infra cost; v1 is single-user; team sync is out of scope | Architect | Yes |
| 2026-04-09 | State management: Zustand | Lightweight enough for a single-user SPA; avoids Redux complexity | Architect | Yes |
| 2026-04-09 | Export target: GitHub `.github/copilot-instructions.md` format | Primary format Copilot reads for workspace instructions; exact multi-format support deferred to OPEN_QUESTIONS | Architect | Yes |
| 2026-04-09 | Delivery: VS Code Webview Extension (not standalone web app) | Working in VS Code; full IDE integration; web app has fragile UX and no access to workspace file system | User | Yes |
| 2026-04-09 | Export formats: `.md` primary + `.prompt.md` + `.instructions.md` | All are valid GitHub Copilot file types; `.md` is most readable; format selected per agent at export time | User | Yes |
| 2026-04-09 | Team sharing: JSON library export/import file (SUPERSEDES "localStorage only") | Simpler than a backend; teams share a `.json` dump of the library; import merges into recipient's globalState | User | Yes |
| 2026-04-10 | Tailwind 4.x via `@tailwindcss/vite` (no postcss config) | Keeps file count minimal — no `tailwind.config.js` or `postcss.config.js` needed | Architect (I1) | Yes |
| 2026-04-10 | Single `tsconfig.json` covers extension host only; Vite compiles webview TypeScript independently | Avoids a second tsconfig for I1 scope; project references deferred | Architect (I1) | Yes |
| 2026-04-10 | `useState` used in I1 webview; Zustand deferred to I2 | I1 has a single component with no shared state — Zustand overkill for this scope | Architect (I1) | Yes |
| 2026-04-10 | Named export pattern for unit-testable functions (`getWebviewContent`, `formatAgentPreview`) | Enables isolated unit testing without live VS Code instance or UI render | Architect (I1) | Yes |
| 2026-04-10 | CSP nonce threading: `default-src 'none'; script-src 'nonce-${n}'; style-src ${cspSource};` + matching `<script nonce>` attribute | Canonical XSS-safe pattern; the nonce must appear in both CSP and script tag | Architect (I1) | Yes |
| 2026-04-10 | Webview `<pre>{string}</pre>` for raw markdown preview (no `dangerouslySetInnerHTML`) | React auto-escapes text children — XSS-safe by default for I1 | Architect (I1) | Yes |
| 2026-04-10 | Test infrastructure files (e.g., `vitest.config.ts`, `tests/setup.ts`) do NOT count against the iteration source file budget | I1 Tester mandated `vitest.config.ts` after brief was written; future briefs should clarify this up front | Architect (I1 retro) | Yes |
