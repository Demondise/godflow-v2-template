# Prompt: Plan Next Iteration
Load role: .godflow/agents/architect.md
Read (TIER 1): brain/PRINCIPLES.md
Run Planning Session Start Ritual first:
  1. Read + resolve brain/OPEN_QUESTIONS.md
  2. Read brain/DECISIONS.md (last 10 entries)
  3. Read brain/ITERATIONS.md summary
  4. Read brain/CODEMAP.md — Pending Changes Register
     → If any files listed as Pending: note as FILE CONFLICT RISK in brief Technical Notes
  5. Pipeline Conflict Check (only if Pipeline Mode is active and this is I[N+1]):
     → Load workspace/iterations/I[N]/MANIFEST.md (if it exists)
     → Compare I[N]'s file list against this iteration's planned file list
     → For each conflict: choose Sequence / Depend / Separate Scope
     → Document resolution in brief Technical Notes as PIPELINE NOTE

Current Status: [DESCRIBE WHERE WE ARE]
Next Priority: [WHAT TO FOCUS ON]

Create Iteration Brief using .godflow/templates/ITERATION_BRIEF.md
  → Use the correct iteration ID format (I[N], I[N]a, I[N]-HOTFIX-[module], etc.)
Save as workspace/iterations/I[N]/brief.md
Run Iteration Size Check — split if over limits.
Update brain/ITERATIONS.md with new iteration row (include Type and Parent columns).
Update brain/CODEMAP.md Pending Changes Register with any files this iteration will modify.
