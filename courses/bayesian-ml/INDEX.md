# Bayesian & Probabilistic ML

Course 16 of 20. Inference as a craft: write a model down as a generative story, compute (or
approximate) its posterior, prove the computation worked, check whether the model is any good, and
turn the posterior into a decision. Every sampler, diagnostic, and approximation is built from
scratch first, checked against an exact answer or a library (ArviZ, PyMC, NumPyro, sklearn), and only
then used.

## Chapters

1. Bayesian inference: priors, likelihoods, posteriors
2. Conjugate models end to end
3. Why sampling: the intractable posterior
4. Markov chain Monte Carlo: Metropolis–Hastings from scratch
5. Gibbs sampling and data augmentation
6. Hamiltonian Monte Carlo and NUTS
7. Convergence diagnostics: R-hat, ESS, and trace forensics
8. Probabilistic programming with PyMC and NumPyro
9. Model checking and comparison: PPCs, WAIC, and PSIS-LOO
10. Hierarchical and multilevel models
11. Variational inference and the ELBO
12. Gaussian processes from scratch
13. Bayesian deep learning: uncertainty you can use (+ Under the Trench)
14. Capstone: a probabilistic modelling toolkit, from scratch to PPL

## What each chapter builds

| Chapter | You build |
|---|---|
| 1 | 1-D and 2-D grid posteriors, a likelihood-principle demonstration, HPDI vs equal-tailed intervals, a credible-vs-confidence coverage simulation, prior/posterior predictive checks, the Jeffreys prior, loss-derived estimators, and MAP as regularised MLE |
| 2 | the exponential-family conjugate update, Gamma–Poisson with its negative-binomial predictive, Dirichlet smoothing chosen by evidence, the Normal–Inverse-Gamma Student-t marginal, Bayesian linear regression (= ridge) with its predictive, MacKay empirical Bayes vs CV, and a Beta A/B test with a peeking simulation |
| 3 | the evidence integral for Bayesian logistic regression, grid cost $G^d$, a Laplace approximation and its failures, Monte Carlo error vs dimension, rejection and importance sampling with Kish ESS and Pareto $\hat k$, the typical set, and Lindley's paradox |
| 4 | finite Markov chains and detailed balance, the MH acceptance ratio derived, log-space random-walk Metropolis with an autocorrelation ESS, optimal scaling (0.44 / 0.234), Hastings corrections and Jacobians, adaptation pitfalls, and covariance preconditioning |
| 5 | Gibbs as MH with acceptance 1, full conditionals by hand, the $\rho^2$ mixing failure and blocking, a Gaussian-mixture Gibbs sampler with label switching, Albert–Chib probit, Rao–Blackwellisation, a change-point model, and Metropolis-within-Gibbs |
| 6 | Hamiltonian dynamics, Euler vs leapfrog energy drift, numpy HMC with step/path sweeps, dual-averaging and mass-matrix adaptation, autograd HMC, cost vs dimension against RWM, divergences on Neal's funnel, and a simplified multinomial NUTS |
| 7 | classic, split, rank-normalised and folded R-hat; multi-chain bulk and tail ESS; MCSE for means and quantiles (all matching ArviZ); numeric trace forensics; E-BFMI; and a five-sampler diagnostic table |
| 8 | one model in PyMC and NumPyro with the log density checked against numpy, prior predictive of "vague" priors, `az.summary` decoded, automatic transforms, `pm.Data` prediction, robust and offset GLMs, and a 40-line effect-handler tracer |
| 9 | posterior predictive checks that can fail, LOO-PIT, WAIC derived, PSIS-LOO from scratch (matching `az.loo`), elpd differences with SEs, Bayes-factor prior sensitivity, and stacking vs BMA |
| 10 | no/complete/partial pooling with the shrinkage formula, James–Stein as empirical Bayes, the exact Eight Schools $\tau$ posterior, centred vs non-centred (and when centred wins), LKJ varying slopes, and hierarchical logistic regression |
| 11 | the ELBO two ways, reverse vs forward KL, CAVI for Normal–Gamma and a Bayesian GMM, the mean-field variance proof, REINFORCE vs reparameterisation gradients, ADVI (mean-field and full-rank), minibatch SVI, and PSIS-based VI diagnostics |
| 12 | the GP as kernelised Bayesian linear regression, kernel priors, Cholesky GP regression (matching sklearn), marginal-likelihood hyperparameters with gradients and Occam's razor, composite kernels, sparse GPs, Laplace GP classification, and MCMC over hyperparameters |
| 13 | heteroscedastic heads and the aleatoric/epistemic split, deep ensembles, MC dropout, Bayes by Backprop, last-layer Laplace, NUTS on a small BNN as the gold standard, and a full uncertainty scoreboard |

## How to study this course

Each chapter checks itself. Samplers are run against closed-form posteriors, diagnostics against
ArviZ, GPs against sklearn, approximations against long reference runs — so when a number disagrees
with intuition, the disagreement is real, and several do: "vague" priors that predict absurd data,
the classic R-hat that passes a broken chain, a centred hierarchy that silently truncates its tail,
mean-field VI that is confidently too narrow, and deep ensembles that are not the best on every
uncertainty metric. Read the output tables before the prose.

Three habits the course is built around:

- **Simulate before you fit.** Prior predictive checks catch bad priors; fitting to simulated data
  with known parameters catches bad code.
- **No posterior without diagnostics.** R-hat, bulk/tail ESS, MCSE and divergences are reported
  every time, not when something looks wrong.
- **Check the model, then compare it.** Posterior predictive checks ask whether a model is wrong;
  PSIS-LOO asks which of several wrong models predicts best. They are different questions.

Prerequisites: Probability & Statistics (especially ch. 16, Bayesian inference basics), Math &
Optimization (gradients, Cholesky, eigenvalues), and PyTorch basics from DL Foundations.
