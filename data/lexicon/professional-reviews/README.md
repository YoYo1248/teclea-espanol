# Professional review records

Only validated, immutable JSONL batches belong in this directory. Generate a blank CSV sample, have a real reviewer complete it, then run `npm run lexicon:import-professional-review -- --input <completed.csv>`. Inspect the staged JSONL before copying it here under a dated batch filename.

Do not add the blank sample, self-review, inferred approval, or records without a reviewer name, role and ISO review date. A review only counts while its saved content digest still matches the current canonical card; later content changes keep the old record as stale history rather than silently inheriting approval.
