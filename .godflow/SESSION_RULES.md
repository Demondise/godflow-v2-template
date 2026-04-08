# SESSION RULES v2 — Token, Context & Pipeline Management

## Context Window & Output Limits
| Model | Context Window | Output Per Response |
|---|---|---|
| GitHub Copilot (GPT-4o) | ~128K tokens | ~4K–8K tokens |
| Claude Sonnet/Opus | ~200K tokens | ~8K–16K tokens |
| ChatGPT-4o | ~128K tokens | ~4K–8K tokens |
Rule: 1,000 tokens ≈ 750 words ≈ 50–80 lines of code

## Rule 1 — Tiered Context Loading
| Tier | Files | When |
|---|---|---|
| TIER 1 | brain/PRINCIPLES.md | Every session |
| TIER 1 | workspace/iterations/I[N]/brief.md | Build and review sessions |
| TIER 2 | brain/VISION.md + brain/HLD.md | Planning sessions only |
| TIER 3 | brain/DECISIONS.md | Last 10 entries, planning only |
| TIER 3 | brain/OPEN_QUESTIONS.md | Planning only |
| TIER 3 | brain/ITERATIONS.md | Summary table only, planning only |

Token cost guide:
- PRINCIPLES.md: ~500–1,000 tokens
- HLD.md: ~1,000–3,000 tokens (keep lean)
- DECISIONS.md: ~2,000–5,000 tokens (load last 10 only)

## Rule 2 — Iteration Size Limits (v2)
| Metric | Limit |
|---|---|
| New files per iteration | Max 8 |
| Total new lines | Max 400 |
| Lines in any single file | Max 200 |
| Scope | One feature or module |

If over limits → Architect MUST split: I[N] → I[N]a + I[N]b

## Rule 3 — Checkpoint Protocol
If approaching output limit:
- STOP before starting a new file
- Complete current file if 80%+ done, then stop
- Save checkpoint to workspace/iterations/I[N]/checkpoint.md:

⚠️ GODFLOW CHECKPOINT
Iteration: [ID]
Completed: [COMPLETE files list]
Remaining: [files not started]
Partial: [file + where it stopped]
Next Session: Load [agent role] + PRINCIPLES.md + brief.md + this checkpoint

## Checkpoint Recovery Process
1. Save checkpoint to workspace/iterations/I[N]/checkpoint.md
2. New session: Load Builder + PRINCIPLES.md + brief.md + checkpoint.md
3. Do NOT rewrite COMPLETE files
4. Complete any PARTIAL file first
5. Continue with REMAINING files
6. Output RESUME COMPLETE signal when done
7. Reviewer reviews full draft/ folder (not just resumed portion)

## Rule 4 — Session Freshness
Signs of a stale session:
- AI ignores PRINCIPLES.md rules
- Responses get shorter/vaguer
- AI guesses instead of following the brief

Max exchanges before refresh:
| Agent | Max Exchanges |
|---|---|
| Architect | 15–20 |
| Tester | 3–5 |
| Builder | 5–8 |
| Reviewer | 3–5 |
| Debugger | 8–12 |

Signal to user when stale: "SESSION REFRESH RECOMMENDED — start new session with Tier 1 context."

## Rule 5 — brain/ File Size Limits
| File | Max Size | Action If Exceeded |
|---|---|---|
| PRINCIPLES.md | ~500 words | Remove outdated rules |
| HLD.md | ~1,000 words | Move detail to spec files |
| DECISIONS.md | Unlimited | Load last 10 entries only |
| ITERATIONS.md | Unlimited | Load summary table only |
| OPEN_QUESTIONS.md | Active items only | Archive resolved items |

## Quick Reference
START: Load role → TIER 1 → add TIER 2/3 only if needed
DURING: SCOPE FLAG if out of scope → ARCH FLAG if architectural → CHECKPOINT if limit hit
END: All files COMPLETE → MANIFEST.md written → CHANGE LOG written
