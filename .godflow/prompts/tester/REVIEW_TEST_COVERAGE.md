# Prompt: Review Test Coverage
Load role: .godflow/agents/tester.md
Read: workspace/iterations/[ITERATION-ID]/brief.md
Read: workspace/iterations/[ITERATION-ID]/tests/TEST_MANIFEST.md
Read: workspace/iterations/[ITERATION-ID]/draft/

Coverage check:
1. Every AC in the brief has at least one test in TEST_MANIFEST.md
2. Every test is runnable (no pseudocode, no empty stubs)
3. Test assertions match the AC intent
4. Integration tests cover the module boundaries defined in the brief

Coverage Report:
| AC# | AC Text | Test File(s) | Coverage Status |
|---|---|---|---|
| AC1 | [text] | [file] | ✅ COVERED |
| AC2 | [text] | — | ❌ MISSING |

Verdict: COVERAGE COMPLETE / COVERAGE GAPS FOUND
If gaps: "Builder must add missing tests before review can proceed: [list]"
