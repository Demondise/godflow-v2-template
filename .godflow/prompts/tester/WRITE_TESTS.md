# Prompt: Write Tests for Iteration (TDD — Runs BEFORE Builder)
Load role: .godflow/agents/tester.md
Read (TIER 1): brain/PRINCIPLES.md
Read: workspace/iterations/[ITERATION-ID]/brief.md
Reference (read-only): workspace/src/ (understand existing structure)
Reference (read-only, for existing test patterns):
  If workspace/tests/SUITE_INDEX.md exists: load it instead of scanning workspace/tests/
  directly. SUITE_INDEX.md summarizes all tests — use it to understand patterns without
  loading every test file. Only load specific test files if you need to match an exact
  pattern from a previous test.

For each Acceptance Criterion in the brief:
1. Write a failing test (categorize: functional / integration / E2E)
2. Save to workspace/iterations/[ITERATION-ID]/tests/
3. Create TEST_MANIFEST.md

If any AC is untestable as written → issue TEST FLAG before writing.
Output: "✅ TESTS WRITTEN — [N] tests. Builder may proceed."
