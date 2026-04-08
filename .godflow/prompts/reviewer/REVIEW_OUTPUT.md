# Prompt: Review Iteration Output
Load role: .godflow/agents/reviewer.md
Read (TIER 1): brain/PRINCIPLES.md
Read: workspace/iterations/[ITERATION-ID]/brief.md
Load: workspace/iterations/[ITERATION-ID]/draft/ + MANIFEST.md

Run Pre-Review Checklist first.
Follow Verdict Decision Tree exactly.
Save report as workspace/iterations/[ITERATION-ID]/review.md
If PASS/PASS WITH NOTES: move draft/ contents to approved/
