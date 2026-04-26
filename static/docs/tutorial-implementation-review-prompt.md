# Tutorial Implementation Review Prompt

Use this prompt after each tutorial cleanup branch or before opening a pull request.

```text
Review the current branch against main for the tutorial website cleanup work.

Act as a senior reviewer. Prioritize correctness, regressions, broken learner experience, and missing tests. Do not focus on style unless it creates a real maintenance or user-facing problem.

Review these areas:

1. Template and routing correctness
   - Verify every published tutorial and chapter route renders.
   - Check that standalone chapter pages were migrated safely to shared shells.
   - Look for missing Jinja blocks, broken inheritance, duplicated assets, or missing static files.
   - Confirm legacy route redirects still work.

2. Quiz behavior
   - Verify both quiz styles still work:
     - `checkAnswer(this, true/false)`
     - `checkAnswer(questionNumber, correctOption)`
   - Confirm data-correct quizzes initialize once and show the correct answer.
   - Check that repeated or obvious filler distractors were removed.

3. Formula and content correctness
   - Check formulas for mathematical accuracy and consistent variable definitions.
   - Confirm RAG formulas do not imply false equality between non-RAG and RAG distributions.
   - Confirm hybrid retrieval alpha semantics match the formula, examples, and implementation.
   - Recalculate any worked numeric examples.

4. Dynamic content and visual assets
   - Check for broken image, CSS, or JavaScript references.
   - If a real visualization is not implemented yet, verify the page uses a clear placeholder block instead of a broken image.
   - Confirm interactive demos do not reference missing DOM elements or overwritten global functions.

5. Tests and maintainability
   - Run focused tutorial tests.
   - Ensure tests cover routes, internal links, static assets, and shared shell usage.
   - Check for generated files, `.DS_Store`, or `__pycache__` files accidentally staged.

Commands to run:

python -m pytest tests/test_tutorial_quality.py
git diff --check
git status --short

Return findings first, ordered by severity. For each finding, include:

- Severity: High, Medium, or Low
- File path
- Problem
- Why it matters
- Suggested fix

If there are no blocking findings, say that clearly and list residual risks or manual QA still recommended.
```

