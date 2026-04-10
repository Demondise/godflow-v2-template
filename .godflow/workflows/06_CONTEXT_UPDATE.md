# Workflow 06 — Context Update & Merge

1. Load Architect Agent
2. Load TIER 1: brain/PRINCIPLES.md
3. Merge approved/ → src/:
   a. Load workspace/iterations/I[N]/approved/ + workspace/src/ + MANIFEST.md
   b. Run MANIFEST v2 Pre-Merge Checklist (when File System v2 active):
      - [ ] All CREATE files: src/ destination does NOT already exist
      - [ ] All UPDATE files: src/ destination DOES exist
      - [ ] All DELETE files: file exists in src/ and has no remaining importers
      - [ ] No path conflicts with any other in-progress iteration
   c. CREATE files → place at correct src/ path
   d. UPDATE files → replace entire src/ file with the approved/ version (not a patch)
   e. DELETE files → remove from src/
   f. Confirm no conflicts with existing src/ files
4. Copy approved tests to permanent suite:
   workspace/iterations/I[N]/tests/functional/* → workspace/tests/functional/
   workspace/iterations/I[N]/tests/integration/* → workspace/tests/integration/
   workspace/iterations/I[N]/tests/e2e/* → workspace/tests/e2e/
4b. Update workspace/tests/SUITE_INDEX.md — add one row per test file just copied to
   workspace/tests/, with columns:
   | Test File | Module | Type | Iteration | Flow Covered | Mock Level | Status |
   Do not remove existing rows. Mark removed features as DEPRECATED (do not delete).
   This is Architect's responsibility during merge (not Tester's).
5. Update brain/CODEMAP.md:
   - For every CREATE in MANIFEST.md → add new row (Created = I[N], Last Modified = I[N], Status = Active)
   - For every UPDATE in MANIFEST.md → set Last Modified = I[N], Modified By = role that wrote it
   - For every DELETE in MANIFEST.md → set Status = Deleted, add note
   - Remove merged files from the Pending Changes Register
   - Update total file count in the CODEMAP header
5b. Update brain/ITERATIONS.md → status = COMPLETE (include Type and Parent if not already set)
6. Log any decisions made this iteration to brain/DECISIONS.md
7. Resolve addressed OPEN_QUESTIONS.md items
8. Update brain/HLD.md if architecture changed
9. Update brain/HEALTH.md metrics (iteration counts, first-pass rate, etc.)
10. Post-merge conflict check: If Pipeline Mode is active and I[N+1] is at Builder or
    later — compare this merge's MANIFEST.md file list against I[N+1]'s draft/ files.
    If any file in this merge's UPDATE list also appears in I[N+1]'s draft/:
    → Notify user: "I[N+1] draft/[file] was written against the OLD version of [file].
      I[N] has now merged changes to [file]. I[N+1] Builder must reload src/[file] and
      update draft/[file] before Reviewer runs."
    → Give I[N+1] Builder a targeted refresh prompt for the conflicting files only.
11. If Team Awareness is active: tell Conductor "Update project status" to get the PROJECT_STATUS.md update prompt
12. Git commit — run in terminal:
    git add workspace/src/ brain/ workspace/tests/ workspace/iterations/I[N]/
    git commit -m "I[N]: [iteration title] — PASS"
    git tag I[N]-complete
    → This creates a recovery checkpoint. If any future merge breaks something,
      git checkout I[N]-complete restores the last known good state.
    → If git is not set up: git init → git add -A → git commit -m "I[N]: [title] — PASS" → git tag I[N]-complete
13. Return to Workflow 03 for next iteration (tell Conductor "Merge done")
