# Classical Machine Learning

The ESL core — every model with its math and a runnable example. Every algorithm is derived
from first principles (loss, gradient, geometry), implemented in NumPy, and verified against
sklearn. No black-box APIs without knowing what's inside.

Pitched at: solid Python + linear algebra, wants to understand what sklearn is doing and why.
The tabular-kaggle fast-track covers many of these topics at competition depth; this course
covers the theory and derivations underneath.

**In plain words:** this course teaches the standard machine-learning models by building each
one yourself and checking it against the library version. Chapters 1–5 set up the rules of the
game — what a loss is, why training error lies, and how linear, logistic, and other generalized
linear models fit a weighted sum of features. Chapters 6–9 cover models that classify by
similarity or probability (k-NN, Naive Bayes, LDA/QDA) and by the widest margin (SVMs and
kernels). Chapters 10–13 grow decision trees and combine many of them into random forests and
boosted ensembles, ending with XGBoost, LightGBM, and CatBoost. Chapters 14–16 drop the labels
entirely: clustering with k-Means, mixtures, density, hierarchies, and graphs, then squeezing
data into fewer dimensions with PCA, t-SNE, and UMAP; the capstone (ch. 17) has you rebuild the
key algorithms from scratch.

---

## Chapters

**Part 1 — Setup & Linear Models**
1. The supervised learning setup: loss, risk, generalization ●
2. Linear regression: normal equations & gradient descent ●
3. Regularization: Ridge, Lasso, Elastic Net (geometry) ●
4. Logistic regression: sigmoid/softmax, cross-entropy, gradient ●
5. Generalized linear models: exponential family & link functions

**Part 2 — Similarity & Probabilistic Models**
6. k-Nearest Neighbors & the curse of dimensionality ●
7. Naive Bayes: Gaussian, Multinomial, Bernoulli ●
8. Linear & Quadratic Discriminant Analysis ●

**Part 3 — Margin & Tree Models**
9. SVMs & the kernel trick ●
10. Decision trees: impurity, splits, pruning, CART ●
11. Bagging & Random Forests ●
12. Boosting: AdaBoost → gradient boosting (functional gradient) ●
13. XGBoost / LightGBM / CatBoost deeply ●

**Part 4 — Unsupervised & Representation**
14. Unsupervised: k-Means, GMM/EM, DBSCAN/HDBSCAN ●
15. Hierarchical & spectral clustering ●
16. Dimensionality reduction: PCA, t-SNE, UMAP ●

**Capstone** — Gradient boosting from scratch to match LightGBM; k-Means and GMM from
scratch with PCA applied to real data.

`●` = ships runnable code with output.

---

## Prerequisites

- Python for Data Work (ch. 1–3): NumPy arrays, vectorization, fancy indexing.
- Linear algebra: matrix multiply, eigendecomposition, SVD (or comfort with ch. 2–6 of
  Math & Optimization when available).
- Probability: expectation, Bayes' rule, Gaussian distribution.

---

## Study notes

- Ch. 1–4 are load-bearing for everything. Do not skip the math in ch. 2 and 4.
- Ch. 9 (SVMs) is mathematically dense; work through the dual derivation once carefully.
- Ch. 10–12 build on each other — tree → bagging → boosting is a clean progression.
- Ch. 13 is the most practically important chapter. Read it carefully even if you already
  use XGBoost; the hyperparameter semantics are often misunderstood.
- Ch. 14–16 share a theme: finding structure without labels. PCA in ch. 16 connects
  back to the eigendecomposition in Math & Optimization (ch. 4–6).

---

## Reference anchors

- *Introduction to Statistical Learning* (ISLR, James/Witten/Hastie/Tibshirani) — ch. 2–9.
- *Elements of Statistical Learning* (ESL, Hastie/Tibshirani/Friedman) — the rigorous version.
- sklearn documentation — implementation details and parameter semantics.
- XGBoost/LightGBM/CatBoost official docs — authoritative on hyperparameters.
