# Probability, Statistics & Inference

The mathematical pillar that everything else in ML stands on. Not a survey — every result
is derived, simulated, and connected to what you'll actually do with it in a model or
competition. Bayesian and frequentist perspectives are both given their due.

Pitched at: solid calculus and linear algebra, first exposure to probability may be rusty.
No statistics prerequisites assumed.

---

## Chapters

**Part 1 — Foundations of probability**
1. Probability axioms, conditional probability, and Bayes' theorem ●
2. Random variables, expectation, variance, and moments
3. Discrete distributions: Bernoulli → Poisson ●
4. Continuous distributions: Normal, Exponential, Gamma, Beta ●
5. Joint distributions, marginals, covariance, and correlation ●

**Part 2 — Tools**
6. MGF / PGF / CGF — what they buy you ●
7. Limit theorems: LLN and CLT (simulated) ●
8. Sampling distributions and standard error ●

**Part 3 — Inference**
9. Estimation: MLE & MAP from scratch ●
10. Confidence intervals & the bootstrap ●
11. Hypothesis testing, p-values, power, effect size ●
12. Multiple testing & false discovery rate ●

**Part 4 — ML-facing statistics**
13. Bias–variance decomposition (simulated) ●
14. Cross-validation theory: k-fold, stratified, group, time-series ●
15. Probability calibration & reliability curves ●

**Part 5 — Bayesian view**
16. Bayesian inference: priors, posteriors, conjugacy ●
   *(Under the Trench section here)*

**Capstone** — inference toolkit from scratch + rigorous real-data analysis.

`●` = ships runnable code.

---

## Study notes

- Ch. 1–5 are the bedrock. Spend extra time on ch. 5 (joint distributions) — dependence
  and independence are the most misunderstood concepts in the whole curriculum.
- Ch. 9 (MLE) is load-bearing for everything in deep learning: cross-entropy loss *is*
  negative log-likelihood under an MLE lens.
- Ch. 13–14 (bias-variance, CV) appear again in Course 5 (Classical ML) and Course 4
  (Data Wrangling). Read them here for the theoretical basis.
- Ch. 16 (Bayesian) is a preview of Course 16 (Bayesian & Probabilistic ML). The conjugate
  models here are the simplest cases — the full MCMC/VI treatment comes later.

## Prerequisites

Calculus (integration, differentiation), basic linear algebra (vectors, matrices). The
`tabular-kaggle` fast-track or equivalent ML exposure is helpful but not required.

## Reference anchors

DeGroot & Schervish, *Probability and Statistics* (4th ed.) — the rigorous foundations.
Casella & Berger, *Statistical Inference* (2nd ed.) — the graduate reference.
All code is independent of those texts; content is written for this course and this audience.
