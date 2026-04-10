# Project Principles
> ALL agents follow these in ALL sessions. No exceptions.
> Last Updated: 2026-04-09

## Code Principles
1. All React components must be under 150 lines — extract sub-components if over
2. All TypeScript functions must be under 50 lines — extract helpers if over
3. No inline styles — use Tailwind CSS utility classes only
4. No hardcoded UI strings — define labels in a constants file
5. No `any` type in TypeScript — use explicit types or `unknown` with type guards
6. All async functions must be explicitly typed and awaited — no floating promises

## Architecture Principles
1. Webview and Extension Host are strictly separated — React code never calls VS Code APIs directly
2. All cross-boundary communication goes through the postMessage bus — no direct DOM or Node access across the boundary
3. All shared and persistent UI state lives in Zustand — no `useState` for data that crosses components
4. Only the Extension Host reads or writes `globalState` or the file system — never the webview
5. All incoming postMessage commands are validated on the Extension Host side before execution
6. TemplateService operates entirely within the webview on bundled static data — no host round-trip needed

## Workflow Principles
1. Agents read this file before every session
2. No agent goes out of iteration scope without user approval
3. All major decisions logged to DECISIONS.md
4. Builder uses SCOPE FLAG before adding anything out of scope
5. Architect reads PROJECT_STATUS.md before every planning session and updates it after every merge
6. Builder reads the full Iteration Brief before writing any code — acceptance criteria are non-negotiable

## Quality Principles
1. No feature is complete without error handling for all failure paths (file write fail, empty workspace, malformed state)
2. No exported file can be written without a confirmed open workspace — surface a clear error if workspace is missing
3. All postMessage command handlers must include a `default` case that logs a warning for unknown commands
4. No component renders untrusted user-authored content without escaping — prevent XSS inside the webview
5. Agent CRUD operations must update the `updatedAt` ISO8601 timestamp on every write
6. No iteration is complete if its acceptance criteria are not all verifiably met

## Project-Specific Rules (VS Code Extension)
1. The WebviewPanel Content Security Policy must never be weakened — `unsafe-inline` and `unsafe-eval` are forbidden
2. All extension commands must be declared in `package.json` under `contributes.commands` — unregistered commands will not appear in the palette
3. `vscode.workspace.fs` is async — always `await` file operations and explicitly handle `FileNotFound` and permission errors
4. Vite builds the webview bundle; esbuild builds the extension host — never mix build targets or import host modules from webview code
5. `globalState` stores the Agent array as a JSON-serialised string — always `JSON.parse` on read and `JSON.stringify` on write; never assume it contains typed objects
6. UUIDs for Agent `id` must be generated in the webview before the save message is sent — the host does not generate IDs
