# Tutorial Migration Review Prompt

Use this prompt after each canonical tutorial migration branch and before opening or merging a PR.

```text
Review the current tutorial migration branch against origin/main.

Act as a senior reviewer. Prioritize regressions, lost content, broken navigation, incorrect concepts, weak explanations, and tests that overstate readiness. Do not focus on cosmetic preferences unless they affect the learner experience.

Check these areas:

1. Git and workflow
   - Confirm all previous completed branches were committed and pushed.
   - Confirm the current work is not sitting uncommitted on main.
   - Confirm generated files such as .DS_Store and __pycache__ are not staged.

2. Template and routing
   - Verify all published tutorial routes render.
   - Verify chaptered tutorials use the canonical chapter shell.
   - Verify single-page tutorials and course indexes preserve their unique content flow.
   - Check that removed legacy templates are not referenced by routes or includes.

3. Content preservation
   - Compare migrated pages against the prior structure.
   - Confirm no chapter, section, formula, code sample, lab, quiz, or important explanation was silently dropped.
   - Confirm canonical navigation reflects real section IDs rather than flattening every chapter into generic sections.

4. Concept correctness and explanation depth
   - Validate the core claims and mental model for each changed tutorial.
   - Check formulas for correct notation, variables, assumptions, and interpretation.
   - Mark incomplete examples honestly instead of presenting stubs as production-ready code.
   - Confirm quizzes test understanding and do not disable multi-question flows after one answer.

5. QA
   - Run `python -m pytest tests/test_tutorial_quality.py`.
   - Run `git diff --check`.
   - Review browser behavior for representative chaptered and single-page tutorials.

Return findings first, ordered by severity. For each finding include:

- Severity: High, Medium, Low
- File path
- Problem
- Why it matters
- Suggested fix

If no blocking findings remain, say that clearly and list any residual follow-up work.
```

