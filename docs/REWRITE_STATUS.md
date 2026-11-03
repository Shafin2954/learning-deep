# Rewrite status (handoff file)

Keep this file current so any session can pick up where the last one stopped.

## Quality bar ("v3" / August standard)

A chapter is at the bar when it: follows CLAUDE.md exactly; is ~300–480 lines of interleaved
derivation + runnable code; every `python` block (including Solution blocks) is followed by an
`output` block produced by `tools/fill_outputs.py`; and `python3 tools/fill_outputs.py <file> --check`
reports 0 mismatches. Depth target: the best reference for the topic (CS229/231n/224n/285, d2l.ai,
ESL/ISLR, Bishop, Murphy PML 1–2, Sutton & Barto, BDA3, Kleppmann, original papers).

## Tooling

- `tools/fill_outputs.py <chapter.mdx>` — runs all python blocks in one namespace (like the page's
  kernel session) and writes real stdout into the output blocks. `--check` verifies without writing.

## Plan (agreed 2026-11-03)

1. Finish recommender-systems and bayesian-ml.
2. **Repair pass** over the 14 June courses: fix crashing code and regenerate real outputs with
   `tools/fill_outputs.py`, adjusting prose only where it contradicts the real numbers.
3. **Deep rewrite** of core courses in this order: math-optimization, probability-statistics,
   classical-ml, deep-learning-foundations, sequence-transformers, nlp-llms; then the rest.

Audit (2026-11-03): 181 June teaching chapters checked — 0 pass `--check`, 63 crash.

Style rule added for all new/rewritten chapters: intuition first — each section opens in plain
language (problem + core idea + concrete example) before symbols; every symbol defined in words.

## Status by course

| # | Course | Status |
|---|---|---|
| 1 | python-for-data-work | June v2 — needs upgrade to bar |
| 2 | math-optimization | June v2 — needs upgrade |
| 3 | probability-statistics | June v2 — needs upgrade |
| 4 | data-wrangling-eda | June v2 — needs upgrade |
| 5 | classical-ml | June v2 — needs upgrade |
| 6 | time-series-forecasting | June v2 — needs upgrade |
| 7 | deep-learning-foundations | June v2 — needs upgrade |
| 8 | cnns-computer-vision | June v2 — needs upgrade |
| 9 | sequence-transformers | June v2 — needs upgrade |
| 10 | generative-models | June v2 — needs upgrade |
| 11 | modern-architectures | June v2 — needs upgrade |
| 12 | nlp-llms | June v2 — needs upgrade |
| 13 | reinforcement-learning | June v2 — needs upgrade |
| 14 | graph-ml | June v2 — needs upgrade |
| 15 | recommender-systems | ch. 1–7 at bar; ch. 8–11, capstone, INDEX, registration in progress |
| 16 | bayesian-ml | in progress (13 teaching chapters + capstone; adds a model-checking chapter beyond PLAN) |
| 17 | eval-tuning | at bar (Aug) |
| 18 | competition-ml | at bar (Aug) |
| 19 | system-design | at bar (Aug) |
| 20 | mlops | at bar (Aug) |

Fast-track courses (`foundations-for-llm`, `bengali-llm`, `tabular-kaggle`) are frozen.
