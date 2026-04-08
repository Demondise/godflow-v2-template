# Iteration Brief

## Iteration ID
I[NUMBER] — [SHORT TITLE]
> Previous attempt: N/A | v2 | v3

## Goal
[One sentence]

## Status
[ ] Planned → [ ] In Progress → [ ] Fail#1 → [ ] Fail#2 → [ ] Complete → [ ] Reviewed

## Scope — What IS Included
-
-

## Out of Scope
-
-

## Acceptance Criteria (Specific and Testable)
BAD: "Code should work" | GOOD: "POST /api/users returns {id, email} with 201 status"
- [ ]
- [ ]
- [ ]

## Architectural Decisions Already Made (Builder Does NOT Decide These)
- Decision: [what] | Logged: [date in DECISIONS.md]

## Dependencies (Files from workspace/src/ This Iteration Needs)
- Depends on: [file/module] for [reason]

## Files To Create or Modify
Standard format:
| File (relative to draft/) | Action | Approx Lines | Maps to src/ |
|---|---|---|---|
| [filename] | CREATE | ~[N] | [src/path] |

File System v2 format (when "File system v2 on"):
| draft/ file | src/ destination | Operation | Last touched in | Notes |
|---|---|---|---|---|
| draft/[file] | src/[path] | CREATE | — | New file |
| draft/[file] | src/[path] | UPDATE | I[N] | [what changes] |
| — | src/[path] | DELETE | I[N] | [reason for deletion] |

## Test Requirements (For Tester Agent)
> Tester writes these tests BEFORE Builder starts.
| AC# | Test Type | Test File | Notes |
|---|---|---|---|
| AC1 | Functional | [module.feature.test.ext] | |
| AC2 | Integration | [mod-a.mod-b.integration.test.ext] | |
| AC3 | E2E | [flow-name.e2e.test.ext] | |

## Technical Notes (For Builder)
[Implementation guidance, patterns, APIs]

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|

## Iteration Size Check
- [ ] Total files: [N] ≤ 8
- [ ] Total estimated lines: [N] ≤ 400
- [ ] Max lines in any single file: [N] ≤ 200
- [ ] Scope: ONE feature or module
- [ ] If any fails → SPLIT into I[N]a + I[N]b

## Definition of Done
✅ All AC checked | ✅ Reviewer PASS | ✅ User approved | ✅ Architect merged to src/
