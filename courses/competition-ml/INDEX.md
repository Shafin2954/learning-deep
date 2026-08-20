# Applied / Competition ML

Course 18 of 20. The Kaggle toolkit, made systematic. Not a bag of tricks — a sequence of
decisions with a measurement attached to each: what the metric rewards, whether your validation
resembles the test set, which feature blocks pay, how to encode a high-cardinality column without
memorising the labels, how to combine models without fooling yourself, and how to ship a file that
is what you think it is.

## Chapters

1. Reading a competition: metric, leak risk, CV design
2. Building a CV that matches the leaderboard
3. EDA to fast baselines
4. Feature engineering patterns that pay off
5. Target encoding without leakage
6. Handling magic and anonymized features
7. Ensembling: blending versus stacking
8. Rank blending and weighted blends
9. Pseudo-labeling done safely
10. Adversarial validation: train and test drift
11. Hill-climbing the ensemble
12. Reproducibility, seeds, and submission hygiene
13. Writing the solution report (+ Under the Trench)
14. Capstone: a full competition, end to end

## What each chapter builds

| Chapter | You build |
|---|---|
| 1 | a metric-family classifier, a four-family leak audit, and an automatic CV recommendation |
| 2 | the Hanley-McNeil AUC standard error, a CV-versus-LB diagnostic, and an inverse-variance selection rule |
| 3 | a decision-oriented data profile, a four-rung baseline ladder, and a generated first-hour memo |
| 4 | group aggregations, deviations, frequency encoding, causal lags, and a greedy block selector |
| 5 | naive, leave-one-out, out-of-fold and smoothed encoders, plus a leak-proof sklearn transformer |
| 6 | a column-kind classifier, exact-relationship finder, and a hidden-entity-key search |
| 7 | an out-of-fold prediction matrix, weighted blends, and stacking with the in-fold leak demonstrated |
| 8 | four blend spaces, four weight fitters, and shrinkage toward uniform |
| 9 | fold-safe pseudo-labeling with soft labels and a decision rule that says no |
| 10 | an adversarial classifier, per-feature drift, density-ratio weights, and a test-like validation set |
| 11 | Caruana greedy ensemble selection, bagged, with honest cross-validated scoring |
| 12 | seed-noise measurement, seed averaging, a submission validator, and a prediction-hash manifest |
| 13 | a report generator, a claims linter, and an ablation consistency check |

## How to study this course

Every chapter runs, and several of them end with a result that contradicts what competition
folklore says. Rank averaging does not rescue a weak member. Pseudo-labeling loses you score
unless labels are genuinely scarce. Hill climbing barely overfits. Importance weighting usually
costs more variance than it removes bias. In every case the demonstration is in the output above
the prose — read the numbers first and try to predict the explanation.

Three habits the course is built around:

- **Measure the noise before you believe the gain.** Fold-seed spread, model-seed spread,
  leaderboard resolution: all three are computable, and a change smaller than any of them is not a
  change.
- **Anything fitted on labels is refitted inside the fold.** Encoders, selectors, pseudo-labels,
  blend weights, thresholds. This one rule prevents most competition disasters.
- **The last mile is data handling, not modelling.** Merge on the key, validate the file, hash the
  predictions, write the report.

## Prerequisites

Comfortable Python and scikit-learn. The course leans on Evaluation, Tuning & Interpretability
(course 17) for metrics, cross-validation pitfalls and honest comparison — chapters 2, 5, 8 and 12
of that course are the direct prerequisites — but every technique used here is re-derived rather
than assumed.

## Environment note

Everything runs on NumPy, pandas, scikit-learn and SciPy, all in `environment/requirements.txt`.
Model banks in the ensembling chapters are simulated where a real one would only add training
time; the algorithms are the real ones.

## Reference

Caruana et al. (2004) for greedy ensemble selection; Micci-Barreca (2001) for target-encoding
smoothing; the Kaggle competition write-ups of the IEEE-CIS Fraud and Santander Customer
Transaction competitions for the anonymised-feature techniques in chapter 6.
