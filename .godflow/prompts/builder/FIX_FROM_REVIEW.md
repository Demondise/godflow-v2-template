# Prompt: Fix From Review (Builder Fix Session)
Load role: .godflow/agents/builder.md
Read (TIER 1): brain/PRINCIPLES.md
Read: workspace/iterations/[ITERATION-ID]/brief.md
Read: workspace/iterations/[ITERATION-ID]/review.md  ← FAIL items are here
Load: workspace/iterations/[ITERATION-ID]/draft/     ← your previous work to fix

Fix ONLY the items listed as FAIL in review.md. Do not change PASS items.
Output updated files to workspace/iterations/[ITERATION-ID]/draft/ (overwrite).
Update MANIFEST.md if file line counts changed.
When done: output "✅ FIX COMPLETE — [N] FAIL items addressed. Ready for Reviewer."
