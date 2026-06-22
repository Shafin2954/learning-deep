# Tabular / Classical-ML Kaggle Track

Your historical home turf (churn, heart disease, boosting ensembles), built to the same
from-scratch depth as the LLM track. This covers PLAN.md **Course 5 (Classical ML)** +
**Course 18 (Competition ML)**, focused for tabular Kaggle.

Two deliverables:
1. **GLOSSARY.md** — every term you'll meet on Kaggle, defined in depth, nothing missed.
   Read it once end-to-end, then use it as a reference. Organized by category.
2. **The chapters below** — concept → example → try-it → exercise, building the models
   and the competition craft by hand.

## Chapters

**Part 1 — Tabular foundations**
1. The tabular problem & the Kaggle workflow
2. Linear & logistic regression (your first baseline) ●
3. Regularization: Ridge, Lasso, ElasticNet ●

**Part 2 — Trees & ensembles**
4. Decision trees from scratch ●
5. Bagging & Random Forests (and OOB) ●
6. **Gradient boosting from scratch** — the big one ●
7. XGBoost / LightGBM / CatBoost, deeply ●

**Part 3 — Features (where tabular comps are won)**
8. EDA for tabular data ●
9. Feature engineering: numeric, categorical, datetime, aggregations ●
10. Categorical & **target encoding without leakage** ●
11. Feature selection (and null importance) ●

**Part 4 — Validation & competition craft**
12. Cross-validation & a CV you can trust ●
13. Data leakage & adversarial validation ●
14. Metrics & optimizing to the metric ●
15. Hyperparameter tuning with Optuna ●

**Part 5 — Winning**
16. Ensembling: blending & stacking ●
17. Pseudo-labeling & advanced tricks ●
18. The competition workflow (a full-comp plan)

**Capstone** — build a GBM from scratch that matches LightGBM, then run a full
competition pipeline end to end (no AI). 

`●` = ships runnable code.

## Shared with the LLM track (already written — they transfer directly)

These foundations chapters are model-agnostic and apply to tabular Kaggle as-is:
- **F1–F3** (linear layers, gradients, loss/MLE) underpin regression.
- **F4** (optimizers) underpins gradient-based models.
- **F6** (regularization, overfitting U-curve) is universal.
- **F14** (metrics, cross-validation, calibration) — the same discipline.
- **F15** (leakage, validation strategy, adversarial validation) — the same discipline.

So this track focuses on what's *tabular-specific*: trees, boosting, tabular features,
encoding, and the competition craft around them.

## Reference anchors

ISLR / ESL (classical ML), the official XGBoost / LightGBM / CatBoost docs (parameter
semantics), and standard Kaggle competition practice. Terms are defined in our own
words in GLOSSARY.md.
