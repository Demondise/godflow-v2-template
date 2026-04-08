# Prompt: Full System Validation
> Use this prompt to run the Release Validator for a full release gate, milestone check, or pre-launch audit.

Load role: .godflow/agents/release_validator.md

Load TIER 1 (always):
- brain/PRINCIPLES.md
- brain/VISION.md
- workspace/tests/SUITE_INDEX.md

Load TIER 2 (choose one based on project mode):
- If NOT scale mode: workspace/src/ (load all files directly)
  Note: If src/ exceeds ~100 files or ~10,000 lines, use the context limit mitigation
  protocol in Rule 7 — load last-5-iteration files first, then per-module.
- If scale mode: brain/CODEMAP.md
- If scale mode: brain/modules/ (all module files)
- If scale mode: brain/contracts/ (all interface contracts)

Load TIER 3 (for context):
- brain/ITERATIONS.md
- brain/OPEN_QUESTIONS.md
- brain/HEALTH.md

Run all 6 validation steps. Do not skip any.
Write workspace/RELEASE_REPORT.md with the full verdict.

Validation type: [MILESTONE CHECK / RELEASE GATE / PRE-LAUNCH AUDIT]
