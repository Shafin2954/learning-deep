# Evaluation, Tuning & Interpretability

Course 17 of 20. The course about *believing your numbers*. Everything here sits between "the
model trained" and "we shipped it": which metric answers your question, where the threshold
belongs, whether the probabilities mean anything, how to search hyperparameters without fooling
yourself, what the model actually used, where it fails, and how to compare two candidates
honestly.

## Chapters

1. Classification metrics: precision, recall, F1, ROC vs PR
2. Regression and ranking metrics
3. Threshold selection and cost-sensitive decisions
4. Probability calibration (Platt, isotonic)
5. Cross-validation pitfalls in practice
6. Hyperparameter search: grid, random, Bayesian
7. Optuna: samplers, pruners, multi-objective
8. Feature importance: permutation, gain, drop-column
9. SHAP: theory and reading the plots
10. Partial dependence, ICE, and surrogate models
11. Error analysis as a discipline
12. Experiment tracking: what to log and why (+ Under the Trench)
13. Capstone: evaluation and tuning harness

## What each chapter builds

| Chapter | You build |
|---|---|
| 1 | a confusion matrix from scratch, a threshold sweep, and a bootstrap CI on any metric |
| 2 | MAE/RMSE/RMSLE/pinball loss, and P@k, AP, NDCG, MRR from their definitions |
| 3 | the analytic cost-optimal threshold, a constrained variant, and three-way triage |
| 4 | reliability curves, ECE and Brier, Platt scaling, and isotonic regression via PAVA |
| 5 | leak, group, time and tuning-bias demonstrations, plus a grouped-temporal splitter |
| 6 | a random-search budget calculator, a Gaussian process with expected improvement, successive halving |
| 7 | an Optuna study with a conditional space, a median pruner, and an NSGA-II Pareto front |
| 8 | permutation, grouped-permutation and drop-column importance, and a shadow-feature selector |
| 9 | exact Shapley values by brute force, checked against TreeSHAP, and reason codes that reconcile |
| 10 | partial dependence, ICE, centred ICE, ALE, and a surrogate with a fidelity gate |
| 11 | an automatic slice finder ranked by headroom, with a computed cause and an action per slice |
| 12 | a run store with fingerprints, and a corrected paired test that vetoes on slice regressions |

## How to study this course

Every chapter runs, and most of them are built around a demonstration that goes *against*
intuition: a model that scores above chance on pure noise, a discount whose effect is zero on
average and large for everyone, twenty identical models with a clear leaderboard winner. Read the
output before the prose that follows it and try to predict what happened.

Three habits the course is built around:

- **A number without its uncertainty is not a result.** Fold spreads, bootstrap intervals, and
  the corrected paired test all exist to answer one question: is this difference real?
- **Aggregate metrics hide the thing you need to know.** Slice, bin, group by segment, and plot
  the individual curves before you trust the average of anything.
- **Say which question you are answering.** Gain, permutation, drop-column, SHAP, PDP and ALE
  give different answers because they are different questions — and each one is right for its own.

## Prerequisites

You should be comfortable training a scikit-learn model and reading Python. Chapter 4 leans on
the probability material from course 3, and chapter 6's Bayesian-optimization section uses the
linear-algebra and Gaussian machinery from course 2, but both are derived here from scratch.

## Environment note

Chapters 7 and 9 use `optuna` and `shap`, both in `environment/requirements.txt`. Every study is
seeded and every SHAP explainer is given an explicit background sample, so the outputs on this
page are reproducible rather than merely plausible.

## Reference

Provost and Fawcett, *Data Science for Business*, for the cost-sensitive framing; Molnar,
*Interpretable Machine Learning*, for the attribution methods; Nadeau and Bengio (2003) for the
corrected resampled t-test; Bergstra and Bengio (2012) for random search; Lundberg and Lee (2017)
for SHAP.
