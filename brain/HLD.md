# High Level Design — Agent Builder for GitHub Copilot
> Status: [x] Draft [ ] Approved | Last Updated: 2026-04-09 | Version: 1.2

## Architecture Overview

```
VS Code Extension Host (Node.js)
├── Extension Entry Point (extension.ts)
│   ├── Registers commands (openAgentBuilder, etc.)
│   ├── Manages WebviewPanel lifecycle
│   └── Provides ExtensionContext (globalState, workspace FS)
│
└── WebviewPanel (sandboxed browser context)
    ├── React UI (AgentBuilder · TemplateGallery · AgentLibrary · PreviewPanel)
    ├── State Layer (Zustand)
    └── Services
        ├── ExportService  → postMessage → Extension Host → writes file to workspace
        ├── StorageService → postMessage → Extension Host → reads/writes globalState
        └── TemplateService (bundled static data, no host needed)

Message Bus (postMessage / onMessage)
  Webview ──► Extension Host : { command, payload }
  Extension Host ──► Webview : { command, payload }
```

**Key VS Code APIs used:**
- `vscode.window.createWebviewPanel` — hosts the React UI
- `ExtensionContext.globalState` — persists agent library across sessions
- `vscode.workspace.fs` — writes exported `.md` files directly into the open workspace
- `vscode.commands.registerCommand` — palette entry points

## Tech Stack

| Layer | Technology | Reasoning |
|---|---|---|
| Extension Host | TypeScript + VS Code Extension API | Required for VS Code integration |
| Webview UI | React + TypeScript | Component model fits form-heavy UI; runs inside WebviewPanel |
| Styling | Tailwind CSS | Rapid UI; works in webview context |
| State | Zustand | Lightweight for single-user SPA in webview |
| Persistence | `ExtensionContext.globalState` | VS Code-managed; survives extension reloads |
| Build | Vite (webview) + esbuild (extension host) | Standard VS Code extension build split |
| Export | `vscode.workspace.fs` via postMessage | Writes directly to workspace; no browser File API needed |

## Core Modules

| Module | Layer | Responsibility |
|---|---|---|
| **extension.ts** | Host | Entry point; registers commands; owns WebviewPanel |
| **AgentBuilder** | Webview | Multi-step form: role → scope → instructions → constraints → context |
| **TemplateGallery** | Webview | Browse and load 5+ pre-built agent presets |
| **AgentLibrary** | Webview | CRUD list (create, read, update, delete, duplicate) + JSON import/export |
| **PreviewPanel** | Webview | Live-rendered output of the generated agent file |
| **ExportService** | Webview → Host | Formats agent to chosen file type; host writes file to workspace |
| **ShareService** | Webview → Host | Serialises full library to `.json`; imports/merges received `.json` |
| **StorageService** | Webview → Host | Reads/writes agent library via postMessage → globalState |
| **TemplateService** | Webview | Loads bundled template definitions |

## Data Model

**Agent** (persisted in `globalState`; also exportable via ShareService)
```
{
  id: string (uuid)
  name: string
  role: string               // "You are a senior code reviewer..."
  scope: string              // Files, modules, or areas the agent covers
  systemInstructions: string // Core behaviour rules
  constraints: string[]      // What the agent must never do
  contextBlocks: string[]    // Attached standards, style guides, etc.
  exportFormat: "md" | "prompt.md" | "instructions.md"  // chosen at export
  templateId?: string        // Source template if derived
  createdAt: ISO8601
  updatedAt: ISO8601
}
```

**LibraryExport** (team-sharing file — plain JSON)
```
{
  exportedAt: ISO8601
  exportedBy: string         // optional label (e.g. team name)
  agents: Agent[]
}
```

**Template** (bundled, read-only)
```
{
  id: string
  name: string               // "Code Reviewer", "Test Writer", etc.
  category: string           // review | testing | debug | docs | refactor
  defaultRole: string
  defaultInstructions: string
  defaultConstraints: string[]
}
```

## Key User Flows

1. **Build from scratch** — Open palette → "Agent Builder: New Agent" → fill form → preview → export to `.github/`
2. **Use a template** — Open TemplateGallery → select preset → form auto-fills → customise → export
3. **Save and reuse** — Build agent → save to library → open later → edit → re-export
4. **Manage library** — Open AgentLibrary → duplicate / rename / delete agents
5. **Export** — Click Export in PreviewPanel → file written directly to workspace `.github/copilot-instructions.md`

## Integration Points

| System | How | Direction |
|---|---|---|
| VS Code Command Palette | Registered commands via `vscode.commands.registerCommand` | In |
| Workspace file system | `vscode.workspace.fs.writeFile` via Extension Host | Out |
| `ExtensionContext.globalState` | JSON-serialised Agent array | In / Out |
| Bundled templates | Static TypeScript constants in extension bundle | In (read-only) |
| Library JSON file (team sharing) | `vscode.workspace.fs` read/write of `.json` export file | In / Out |

## Security Considerations

- Webview runs in a sandboxed iframe — no direct Node.js or file system access from React
- All host-side operations (file write, globalState) go through the postMessage bus; commands are validated in the host before execution
- User-authored text in PreviewPanel escaped to prevent XSS inside the webview
- Content Security Policy set on WebviewPanel to restrict script sources
- No external network calls; no token or credential exposure

## Open Architecture Questions

> All questions resolved. See brain/OPEN_QUESTIONS.md for full log.
