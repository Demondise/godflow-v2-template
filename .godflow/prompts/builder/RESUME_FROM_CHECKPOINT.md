# Prompt: Resume From Checkpoint
Load role: .godflow/agents/builder.md
Read (TIER 1): brain/PRINCIPLES.md
Read: workspace/iterations/[ITERATION-ID]/brief.md

Context file loading (priority order):
- If workspace/iterations/[ITERATION-ID]/session_handoff.md exists: load it INSTEAD
  of checkpoint.md (session_handoff.md is more recent and has fuller context).
- If checkpoint.md also exists: load both — session_handoff.md takes priority for
  file completion status. checkpoint.md provides the original CHECKPOINT list.
- If only checkpoint.md exists: load it as normal.

## CHECKPOINT RESUME VERIFICATION (run before writing anything)

Step 1 — Load the checkpoint/session_handoff file → get the list of "COMPLETE" files.

Step 2 — For each file listed as COMPLETE, verify ALL of the following:
  A. File PHYSICALLY EXISTS in workspace/iterations/[ITERATION-ID]/draft/
     → If missing: mark INCOMPLETE, add to rebuild list.
  B. File is NOT empty (0 bytes)
     → If empty: mark INCOMPLETE.
  C. File is syntactically complete (not truncated):
     → Code file: ends with a valid closing brace / proper EOF
     → JSON: parses without error
     → Markdown: does not end mid-sentence
     → If truncated: mark INCOMPLETE.
  D. File is NOT a stub:
     → Signs of stub: only comments, only TODO placeholders, function signatures with no body
     → If stub: mark INCOMPLETE.

Step 3 — Output a CHECKPOINT RESUME VERIFICATION REPORT before writing anything:

```
CHECKPOINT RESUME VERIFICATION
────────────────────────────────
✅ VERIFIED COMPLETE (will skip):
  draft/[file] — [N] lines, syntactically valid

⚠️ LISTED AS COMPLETE BUT NEEDS REBUILD:
  draft/[file] — [reason: MISSING / EMPTY / TRUNCATED / STUB]

FILES STILL TO BUILD (from brief, not yet attempted):
  [list]

TOTAL REMAINING WORK: [N] files
────────────────────────────────
```

Step 4 — Rebuild INCOMPLETE files first (in order), then continue with remaining files.

---

Before continuing with remaining files, briefly scan VERIFIED COMPLETE draft/ files for
their exported APIs/functions — you need this context to implement the remaining files
correctly. Do not rewrite — just read for context.

Do NOT rewrite files that passed CHECKPOINT RESUME VERIFICATION.
Complete any INCOMPLETE/PARTIAL files first.
Continue with all REMAINING files from the brief.
Add output to workspace/iterations/[ITERATION-ID]/draft/ (same folder).
Update MANIFEST.md with newly completed files.
When done: output "✅ RESUME COMPLETE — All files in draft/. Ready for Reviewer."
