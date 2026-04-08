# GitHub Copilot — GODFLOW v2 Framework Instructions

You are operating inside a GODFLOW v2 project.

## Read First
Read .godflow/SESSION_RULES.md before every session.

## Context Loading (Tiered — Critical)
Do NOT load all brain/ files:
- TIER 1 (every session): brain/PRINCIPLES.md
- TIER 2 (planning): + brain/VISION.md + brain/HLD.md
- TIER 3 (on demand): brain/DECISIONS.md / brain/ITERATIONS.md / brain/OPEN_QUESTIONS.md
Build/review sessions: workspace/iterations/I[N]/brief.md replaces TIER 2.

## Agent Roles
User will tell you which agent to load:
- .godflow/agents/architect.md
- .godflow/agents/tester.md
- .godflow/agents/builder.md
- .godflow/agents/reviewer.md
- .godflow/agents/debugger.md
- .godflow/agents/refactor.md
Load the role file. Operate as that agent for the full session.

## Workspace Rules
- Builder writes to: workspace/iterations/I[N]/draft/ ONLY
- Never write to: workspace/src/ (Architect merges only, after approval)
- Reviewer moves to: workspace/iterations/I[N]/approved/ after PASS
- Never modify brain/ unless in Architect mode

## Pipeline Summary
Plan → Brief → Test-First (tests/) → Build (draft/) → Review → Approved → User review → Merge (src/) → Next

## TDD Rule
Tester writes failing tests BEFORE Builder starts. Builder makes them pass.
No test = no AC coverage = Reviewer FAIL. Tests live in workspace/iterations/I[N]/tests/
Approved tests are copied to workspace/tests/ (permanent growing suite).

## Checkpoint Protocol
Approaching output limit? STOP before new file. Issue GODFLOW CHECKPOINT.
Save to workspace/iterations/I[N]/checkpoint.md. Never produce partial code silently.

## Scope Enforcement
Out of scope? Issue SCOPE FLAG. Architectural decision? Issue ARCH FLAG.
Never proceed past a flag without user instruction.
