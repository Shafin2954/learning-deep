# Deep Learning Foundations

Build the machinery first, then reach for the library.

Every chapter starts with a from-scratch NumPy implementation, then shows the equivalent in PyTorch. By the end you will have written reverse-mode autograd, backpropagation, BatchNorm, Dropout, and a full training loop yourself — and you will know exactly what `torch.nn` is doing underneath.

---

## Part 1 — The neuron to the network (ch. 1–4)

| # | Chapter | Key ideas |
|---|---------|-----------|
| 1 | Neuron, Perceptron, and MLP | activations, XOR, universal approximation |
| 2 | Forward Pass and Computational Graphs | DAGs, storing activations, matrix form |
| 3 | Backpropagation by Hand | chain rule, derive all gradients |
| 4 | Autograd: Build Reverse-Mode Autodiff | topo sort, dual numbers, scalar Value class |

## Part 2 — The training toolkit (ch. 5–9)

| # | Chapter | Key ideas |
|---|---------|-----------|
| 5 | Loss Functions and When to Use Each | MSE, BCE, focal, KL |
| 6 | Optimizers and LR Schedules | SGD, Adam, warmup, cosine |
| 7 | Weight Initialization: Xavier and He | vanishing/exploding, histograms |
| 8 | Batch Norm, Layer Norm, Group Norm | covariate shift, train vs eval |
| 9 | Regularization: Dropout, Weight Decay, Early Stopping | ensemble view, inverted dropout |

## Part 3 — PyTorch in practice (ch. 10–11)

| # | Chapter | Key ideas |
|---|---------|-----------|
| 10 | PyTorch: Tensors, Modules, Training Loop | nn.Module, DataLoader, checkpoints |
| 11 | Data Loading, Batching, Augmentation | Dataset, collate_fn, transforms |

## Part 4 — Stability and scale (ch. 12–13)

| # | Chapter | Key ideas |
|---|---------|-----------|
| 12 | Debugging Training: NaNs, Dead Units, Overfitting | gradient norms, LR range test |
| 13 | Mixed Precision, Gradient Clipping, Accumulation | autocast, GradScaler, accumulation |

**Capstone:** Autograd engine + MLP from scratch — no `torch.nn` for the core.

---

## Study notes

- Read chapters in order — ch. 4 depends on ch. 2–3; ch. 10 depends on ch. 6–9.
- The `## Try it Yourself` block in each chapter runs on the live kernel. Change parameters and observe — that is the point.
- Capstone takes 8–15 hours. The no-AI rule is the constraint that makes it educational.

## Prerequisites

- **Math & Optimization** ch. 1–11 — vectors, matrix calculus, gradient descent, Adam
- **Classical ML** ch. 2–4 — loss functions, logistic regression, gradient basics

## Environment

```
torch>=2.0    numpy    matplotlib    scikit-learn (for datasets only)
```

GPU is not required for any chapter. Mixed-precision chapter (ch. 13) degrades gracefully to CPU.
