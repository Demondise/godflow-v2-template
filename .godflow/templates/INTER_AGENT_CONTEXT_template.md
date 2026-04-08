# Inter-Agent Context — I[N]: [Iteration Title]
> This file is written by each agent and read by the next.
> Do not skip writing your section. This is how decisions travel between sessions.

---

## ARCHITECT → TESTER
> Written by: Architect, at the end of planning session
> Read by: Tester, before writing any tests

### AC Interpretations
[For any AC that could be interpreted multiple ways, write the intended interpretation here]
Example: "AC2 — 'loads within 2 seconds' means wall-clock time on the test machine, not server CPU time"

### Known Technical Constraints
[Things the Tester should know about the architecture that affect how tests should be written]
Example: "Auth module returns JWT tokens — tests should not mock token validation, test real JWT behavior"

### Decisions Made During Planning
[Any decision made during planning that isn't fully captured in brief.md]
Example: "Username login was discussed but deferred to I[N+2] — tests should only cover email login for now"

### Risky ACs (Tester watch these closely)
[ACs that are complex, have edge cases, or that the Architect is uncertain about]

---

## TESTER → BUILDER
> Written by: Tester, at the end of test-writing session
> Read by: Builder, before writing any code

### Implementation Assumptions Baked Into Tests
Format:
- File: [test file]
  Assumes: [exact function signature / return shape / API endpoint]
  Why: [why this assumption was made]

### ACs With Ambiguous Interpretation
[How the Tester interpreted any ambiguous AC — Builder must implement to match]

### Test Environment Requirements
[What needs to be running for tests to pass]
Example: "E2E tests require a running server on port 3000 and a seeded test database"

### RED FLAGS — Things to Watch During Build
[Anything tricky the Tester noticed during test-writing]

---

## BUILDER → REVIEWER
> Written by: Builder, before writing MANIFEST.md
> Read by: Reviewer, before starting the review checklist

### Non-Obvious Implementation Decisions
Format:
- File: [filename]
  Decision: [what was done]
  Reason: [why]
  Alternative considered: [what else was possible]

### Edge Cases Handled (Not in Brief)
[Edge cases handled during implementation that weren't in the ACs — these are PASS items, not out-of-scope flags]

### Known Limitations Accepted
[Things intentionally incomplete — Reviewer logs as WARNING not FAIL]
Example: "Email validation uses regex only — full RFC validation planned for I[N+1]"

### Deviations From Tests
[If any test assumption from TESTER → BUILDER couldn't be met — explain why]
Example: "login() now returns { token, user, expiresAt, refreshToken } — added refreshToken which tests don't cover"
→ Reviewer: flag test coverage gap, not a failure

### Files That Need Extra Review Attention
[Complex or risky files where the Builder is less confident]

---

## REVIEWER → NEXT ARCHITECT
> Written by: Reviewer, at the end of the review session
> Read by: Architect, at the START of planning for I[N+1] (before anything else)

### Patterns Established This Iteration
[New patterns future iterations should follow for consistency]
Example: "All async handlers now use the withErrorBoundary() wrapper — use this in all future handlers"

### Technical Debt Spotted (Not Blocking)
Format:
- File: [filename]
  Issue: [what was noticed]
  Severity: LOW / MEDIUM
  Recommended: [when to address it]

### Forward Suggestions for I[N+1]
[What the Reviewer recommends the next iteration should include or avoid]
These are not requirements — they are informed suggestions from having just reviewed the code.

### PRINCIPLES.md Drift
[Any code drifting from PRINCIPLES.md — even if it passes review]
Example: "Error messages in auth.js are user-facing strings hardcoded in JS — should be in a constants file per PRINCIPLES.md P4"
→ Architect: consider adding this to I[N+1] brief

### Brain/ Update Recommendations
[Specific suggestions for what should be updated in brain/ after merge]
Example: "HLD.md section 3.2 is now outdated — auth module structure changed significantly"
