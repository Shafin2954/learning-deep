# Math & Optimization for ML

Linear algebra and calculus re-aimed at machine learning — all concepts are runnable.
This course assumes you know calculus and linear algebra at a first-year university level;
it rebuilds those tools with ML as the explicit target, so nothing later feels unmotivated.

Pitched at: someone who knows what a matrix is but has never computed a Jacobian by hand,
derived Adam, or thought carefully about numerical conditioning.

---

## Chapters

**Part 1 — Linear algebra re-aimed**
1. Vectors, norms, distances, dot/cosine ●
2. Matrices as linear maps; rank, span, basis
3. Matrix calculus: gradients, Jacobians, Hessians ●
4. Eigen-decomposition & what it means for data ●
5. SVD — the workhorse; low-rank approximation ●
6. PCA from the math (eigen + SVD views) ●

**Part 2 — Optimization foundations**
7. Positive-definiteness, quadratic forms
8. Convex sets & functions; why convexity matters
9. Gradient descent from scratch; learning rate ●
10. Momentum, Nesterov, AdaGrad, RMSProp, Adam ●
11. Constrained optimization & Lagrange multipliers ●
12. Numerical stability: conditioning, log-sum-exp, float traps ●

*(Ch. 12 ends with an "Under the Trench" section covering advanced topics.)*

**Capstone**
13. Optimization library from scratch — five solvers, linear + logistic regression, PCA (no scipy.optimize / no sklearn for the core)

`●` = ships runnable code.

---

## Study notes

- Ch. 1–3 are load-bearing for every deep-learning course: norms appear in regularization,
  the Jacobian is backpropagation, the Hessian is second-order optimization.
- Ch. 4–6 (eigen / SVD / PCA) can be read in one sitting; they tell the same story from
  three angles. Return to them when you hit latent-space models.
- Ch. 7–8 give the theoretical underpinning for *why* gradient descent works and *when*
  it is guaranteed to converge. Read them before ch. 9.
- Ch. 9–10 are the practical heart: implement every optimizer from scratch before you use
  PyTorch's. The capstone requires it.
- Ch. 11 (Lagrange) is a one-time read; you will need it for SVMs, constrained NNs, and
  the EM algorithm.
- Ch. 12 (numerical stability) is the chapter that separates production code from tutorial
  code. Read it last; apply it always.

## Environment / requirements

`numpy`, `scipy` (for comparison only — not for the core implementations), `matplotlib`.
All runs in the code-runner; `docker compose up` starts the kernel on :8000.

## Reference anchors

- **Linear algebra:** Gilbert Strang, *Introduction to Linear Algebra* (5th ed.), ch. 1–7.
- **Calculus / optimization:** Boyd & Vandenberghe, *Convex Optimization* (free online), ch. 1–4, 9.
- **ML framing:** Goodfellow, Bengio & Courville, *Deep Learning*, ch. 2–4.
- Content here is our own derivations and framing — references are for depth, not paraphrase.
