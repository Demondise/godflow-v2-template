# GODFLOW v2 — Project Master Guide

## What Is GODFLOW?
A no-code AI development framework. Six specialized agents build software for you.
Every agent knows its role, its context, and exactly what to do.
Built-in TDD: tests are written before code. Tests define what "done" means.

## The 6 Agents
| Agent | Role | When To Use |
|---|---|---|
| Architect | Plans, coordinates, merges | Start of project, iteration planning, post-review merge |
| Tester | Writes failing tests first | After brief is approved, BEFORE Builder starts |
| Builder | Writes code to pass tests | During each iteration execution |
| Reviewer | Gates quality + test pass | After each builder session |
| Debugger | Fixes bugs | When errors appear |
| Refactor | Cleans up code | Every 5 iterations or when quality degrades |

## How to Start a Session
Open Copilot Chat (or Claude/ChatGPT) and say:
"Load your role from .godflow/agents/[architect/tester/builder/reviewer/debugger/refactor].md"
Then use the relevant prompt from .godflow/prompts/

## The GODFLOW v2 Pipeline (TDD)
```
PLAN → TEST-FIRST → BUILD → REVIEW → USER APPROVE → MERGE → PLAN NEXT
[brief.md]  [tests/]  [draft/]  [review.md]  [you]  [src/]
```

Full pipeline is in .godflow/workflows/03 through 06.

## Session Start Checklist (Every Session)
[ ] 1. Load agent role file
[ ] 2. Load TIER 1: brain/PRINCIPLES.md
[ ] 3. Load iteration brief (build/review) OR brain/HLD.md (planning)
[ ] 4. Load TIER 2/3 only if needed
[ ] 5. Start work

## Workflow Quick Reference
| What to do | Workflow File |
|---|---|
| Start a project | 01_PROJECT_KICKOFF.md |
| Create HLD | 02_HLD_CREATION.md |
| Plan an iteration | 03_ITERATION_PLANNING.md |
| Build an iteration | 04_EXECUTION.md |
| Review an iteration | 05_REVIEW_GATE.md |
| Merge + update brain | 06_CONTEXT_UPDATE.md |

## Folder Reference
| Folder | Purpose |
|---|---|
| .godflow/ | Framework engine |
| brain/ | Living project memory |
| workspace/iterations/I[N]/brief.md | Iteration brief |
| workspace/iterations/I[N]/tests/ | Failing tests written by Tester (per iteration) |
| workspace/iterations/I[N]/tests/TEST_MANIFEST.md | Maps every test to its AC |
| workspace/iterations/I[N]/draft/ | Builder output (in progress) |
| workspace/iterations/I[N]/approved/ | Reviewed + passed work |
| workspace/iterations/I[N]/review.md | Reviewer report |
| workspace/iterations/I[N]/checkpoint.md | Recovery file if Builder hit limit |
| workspace/tests/ | PERMANENT GROWING TEST SUITE (all approved tests) |
| workspace/tests/functional/ | Functional tests — component behavior |
| workspace/tests/integration/ | Integration tests — module boundaries |
| workspace/tests/e2e/ | E2E tests — full user flows |
| workspace/src/ | THE AUTHORITATIVE SOURCE CODE |

## Health Check
Check brain/HEALTH.md to see if the project is on track.
Warning signs are listed there. Investigate any that are true.

## Scaling to Large Projects
For projects with 30,000+ lines / 75+ iterations, apply the Scale Patch:
File: GODFLOW_SCALE_PATCH.md

The Scale Patch adds:
- brain/CODEMAP.md — compact src/ navigation (replaces scanning all of src/)
- brain/modules/ — per-module context files (replaces HLD.md for build sessions)
- brain/contracts/ — frozen interface contracts (prevents integration breaks)
- Module-tagged DECISIONS.md — surfaces old module decisions at the right time
- ITERATIONS.md archiving — keeps the active file lean at any iteration count
- workspace/tests/SUITE_INDEX.md — navigable test suite at 500+ files

Activation: paste GODFLOW_SCALE_PATCH.md into AI → run Option A (new project)
or Option B (existing project in progress).

## Compatible AI Tools
- GitHub Copilot → .github/copilot-instructions.md auto-loads context
- Claude Code → reads files directly, paste agent role to start
- ChatGPT → paste agent role + paste brain/ files manually
- Cursor → reads .github/copilot-instructions.md natively
- Any AI → paste agent role file to activate
