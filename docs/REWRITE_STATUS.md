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
| 1 | python-for-data-work | repaired (real outputs) — deep rewrite pending |
| 2 | math-optimization | repaired — deep rewrite pending (priority 1) |
| 3 | probability-statistics | June v2 — needs upgrade |
| 4 | data-wrangling-eda | repaired — deep rewrite pending |
| 5 | classical-ml | June v2 — needs upgrade |
| 6 | time-series-forecasting | repaired — deep rewrite pending |
| 7 | deep-learning-foundations | June v2 — needs upgrade |
| 8 | cnns-computer-vision | repaired — deep rewrite pending |
| 9 | sequence-transformers | June v2 — needs upgrade |
| 10 | generative-models | repaired — deep rewrite pending |
| 11 | modern-architectures | repaired — deep rewrite pending |
| 12 | nlp-llms | June v2 — needs upgrade |
| 13 | reinforcement-learning | June v2 — needs upgrade |
| 14 | graph-ml | June v2 — needs upgrade |
| 15 | recommender-systems | DONE at bar, registered |
| 16 | bayesian-ml | DONE at bar, registered (ch. 1–6 predate the intuition-first rule; ch. 4–6 exceed 1000 lines — candidates to split) |
| 17 | eval-tuning | at bar (Aug) |
| 18 | competition-ml | at bar (Aug) |
| 19 | system-design | at bar (Aug) |
| 20 | mlops | at bar (Aug) |

Repairs in progress (Nov 3): probability-statistics, classical-ml, deep-learning-foundations, graph-ml, reinforcement-learning. Remaining: sequence-transformers, nlp-llms.

Fast-track courses (`foundations-for-llm`, `bengali-llm`, `tabular-kaggle`) are frozen.
