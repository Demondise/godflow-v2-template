# CODEMAP — Source Code Navigation Map
> Updated: — | Date: — | Total files: 0 | Total estimated lines: 0

## src/ File Registry

| File | Purpose | Created | Last Modified | Modified By | Status | Notes |
|---|---|---|---|---|---|---|
| | | | | | | |

## Status Key
- Active   → File exists in src/, in current use
- Deleted  → File was removed in a later iteration (kept for audit trail)
- Pending  → File has changes in an in-progress iteration's draft/ (not yet merged)

## Pending Changes Register
> Files currently being modified by an in-progress iteration
> Updated by Architect at the start of every planning session

| File | Being modified by | Expected merge |
|---|---|---|
| | | |

## Module Index (quick lookup)
| Module | Files | Created | Last touched |
|---|---|---|---|
| | | | |

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
