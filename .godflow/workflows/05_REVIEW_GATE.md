# Workflow 05 — Review Gate (TDD)

1. Load Reviewer Agent
2. Load TIER 1: brain/PRINCIPLES.md + workspace/iterations/I[N]/brief.md
3. Load: workspace/iterations/I[N]/draft/ + MANIFEST.md
4. Also load: workspace/iterations/I[N]/tests/TEST_MANIFEST.md
5. Use prompt: .godflow/prompts/reviewer/REVIEW_OUTPUT.md
6. Reviewer runs Pre-Review Checklist
7. Reviewer follows Verdict Decision Tree including TEST COVERAGE GATE (Step 6):
   - Run: do all tests in TEST_MANIFEST.md pass against draft/ code?
   - Any test still failing → FAIL (log exact failing tests in FAIL report)
   - Any AC without a test in TEST_MANIFEST.md → FAIL (coverage gap)
   - All tests pass → continue to PASS/PASS WITH NOTES decision

IF INCOMPLETE:
  → Check for checkpoint.md
  → Run Workflow 04 (resume from checkpoint)

IF FAIL #1:
  → Save review.md with fix brief
  → Back to Workflow 04 (Builder reads fix brief)
  → Re-review after fix

IF FAIL #2:
  → Reviewer escalates to Architect
  → Architect reads brief + both review.md reports
  → Architect writes revised brief or splits iteration
  → Back to Workflow 04 with revised brief (fail count reset)

IF FAIL #3:
  → User decision: ABORT / DESCOPE / REDESIGN

IF PASS or PASS WITH NOTES:
  → Reviewer moves draft/ → approved/
  → Reviewer saves review.md
  → Run tests locally:
    cd workspace/iterations/I[N]/tests && npm test (or project equivalent)
    [ ] All tests pass → tell Conductor "Tests passed" → continue to User Review
    [ ] Tests fail → tell Conductor "Tests failed: [error]" → routes back to Builder
  → User Review (only after tests pass):
    [ ] Output matches expectation?
    [ ] Output feels complete?
    [ ] Any concerns Reviewer missed?
  → If user approves: Proceed to Workflow 06
  → If user rejects: Architect treats as FAIL, writes fix brief
