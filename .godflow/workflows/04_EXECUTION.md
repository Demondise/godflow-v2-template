# Workflow 04 — Execution (TDD)

## STEP A — Test-First (Tester Agent)
1. Load Tester Agent
2. Load TIER 1: brain/PRINCIPLES.md + workspace/iterations/I[N]/brief.md
3. Reference workspace/src/ and workspace/tests/ (read-only)
4. Use prompt: .godflow/prompts/tester/WRITE_TESTS.md
5. If TEST FLAG issued → resolve untestable AC with Architect before continuing
6. Tester writes failing tests to workspace/iterations/I[N]/tests/
7. Tester creates workspace/iterations/I[N]/tests/TEST_MANIFEST.md
8. Wait for: "✅ TESTS WRITTEN — Builder may proceed."

## STEP B — Build (Builder Agent)
1. Load Builder Agent
2. Load TIER 1: brain/PRINCIPLES.md + workspace/iterations/I[N]/brief.md
3. Also read: workspace/iterations/I[N]/tests/TEST_MANIFEST.md (tests to make pass)
4. Reference workspace/src/ (read-only)
5. Use prompt: .godflow/prompts/builder/EXECUTE_ITERATION.md
6. Builder runs Pre-Work Scope Checklist
7. If SCOPE FLAG issued → resolve with user before continuing
8. If ARCH FLAG issued → resolve with Architect before continuing
9. Builder writes to workspace/iterations/I[N]/draft/
10. If CHECKPOINT issued:
    a. Save checkpoint to workspace/iterations/I[N]/checkpoint.md
    b. Start new session
    c. Use prompt: .godflow/prompts/builder/RESUME_FROM_CHECKPOINT.md
    d. Continue until RESUME COMPLETE signal
11. Builder outputs MANIFEST.md + Change Log
12. Proceed to Workflow 05 — Review Gate
