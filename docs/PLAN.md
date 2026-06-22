# learning-deep — Complete Curriculum & Site Plan (v2)

**Goal:** total coverage of machine learning + data science, **basic → advanced**,
so you never hit a concept in the wild that wasn't taught here. Rare / hard /
niche topics are not dropped — they're parked at the end of each course under
**Under the Trench** with a one-line summary, so you at least know the name, the
idea, and when to reach for it.

Every course ends with a **Capstone**: a hard, integrative, **from-scratch**
project meant to be done **with no AI assistance ("no vibe coding")** and
solvable **using only that course's content**. If a capstone needs something, the
course teaches it. That's the contract.

Pitched at your level: strong math/stats already, Kaggle (boosting, stacking,
pseudo-labeling), RAG/pgvector, explored SSM/MoE/LNN/KAN, full-stack backends
(Supabase, FastAPI, n8n, Proxmox). No beginner-Python filler.

---

## 1. How each course is structured

```
Course
 ├── Chapters (ordered basic → advanced)        ← the spine
 ├── Under the Trench (rare/hard, 1-line each)   ← so nothing is a surprise later
 └── Capstone (hard, from-scratch, no AI)        ← uses every learning outcome
```

**Chapter page** (W3Schools shape): Concept → Example (read-only) → **Try it
Yourself** (editable, runs on the real kernel) → Exercise (hidden solution).
State persists down a page (notebook behavior) via a per-page kernel session.

**Capstone page**: problem statement · hard constraints (what you may NOT use) ·
"Skills/chapters it uses" checklist · acceptance criteria · a hidden reference
solution you only open after submitting yours.

---

## 2. Site map (top menu, grouped)

| Group              | Courses |
|--------------------|---------|
| **Foundations**    | 1 Python for Data Work · 2 Math & Optimization · 3 Probability, Statistics & Inference |
| **Data**           | 4 Data Wrangling & EDA |
| **Core ML**        | 5 Classical Machine Learning · 6 Time Series & Forecasting |
| **Deep Learning**  | 7 DL Foundations · 8 CNNs & Computer Vision · 9 Sequence Models & Transformers · 10 Generative Models · 11 Modern & Alternative Architectures · 12 NLP & LLMs |
| **Specialized**    | 13 Reinforcement Learning · 14 Graph ML · 15 Recommender Systems · 16 Bayesian & Probabilistic ML |
| **Applied / Prod** | 17 Evaluation, Tuning & Interpretability · 18 Applied / Competition ML · 19 System Design & Architecture · 20 MLOps |

Left sidebar = active course's chapters. `●` = chapter ships a runnable demo.

---

## 3. Course catalog

### 0. Start Here
How the site works · how the kernel/state works · reading examples · doing
exercises · doing capstones (the no-AI rule, why it matters) · local setup.

---

### 1. Python for Data Work
*Tight. Arrays, dataframes, speed, idioms — not syntax.*
1. NumPy arrays, dtypes, memory layout ●
2. Vectorization & broadcasting (why loops are slow) ●
3. Fancy indexing, boolean masks, `where`, `einsum` ●
4. pandas data model: Index, Series, DataFrame
5. Selection: `loc`/`iloc`/boolean/`query`
6. GroupBy: split-apply-combine ●
7. Merge/join/concat; reshaping (pivot/melt/stack)
8. MultiIndex & hierarchical data
9. Datetime & resampling in pandas
10. polars: lazy frames, when to switch ●
11. Performance: dtypes, categoricals, `numexpr`, vectorize vs apply ●
12. Plotting anatomy: matplotlib → seaborn → plotly

**Under the Trench**
- *NumPy strides & `as_strided`* — make sliding windows with zero copies (sharp edges).
- *Structured/record arrays* — C-struct-like typed arrays; rare outside binary I/O.
- *Memory-mapping (`np.memmap`)* — work with arrays bigger than RAM.
- *Copy-on-write & SettingWithCopy* — why pandas warns; the new CoW model.
- *`numpy` broadcasting tricks for pairwise ops* — outer subtraction for distance matrices.
- *Arrow-backed pandas & zero-copy interchange* — the dtype backend shift.

**Capstone — Mini analytical engine.** Implement a small columnar table with
`groupby`-aggregate, hash join, and vectorized filters on a messy multi-million-row
CSV, hitting a fixed time/memory budget. Internals use **NumPy only** (no pandas
groupby/merge). *Uses:* ch. 1–11.

---

### 2. Math & Optimization for ML
*Your math, re-aimed at ML, all runnable.*
1. Vectors, norms, distances, dot/cosine ●
2. Matrices as linear maps; rank, span, basis
3. Matrix calculus: gradients, Jacobians, Hessians ●
4. Eigen-decomposition & what it means for data ●
5. SVD — the workhorse; low-rank approximation ●
6. PCA from the math (eigen + SVD views) ●
7. Positive-definiteness, quadratic forms
8. Convex sets & functions; why convexity matters
9. Gradient descent from scratch; learning rate ●
10. Momentum, Nesterov, AdaGrad, RMSProp, Adam ●
11. Constrained optimization & Lagrange multipliers ●
12. Numerical stability: conditioning, log-sum-exp, float traps ●

**Under the Trench**
- *KKT conditions* — Lagrange generalized to inequalities; behind SVM duals.
- *Second-order/Newton & quasi-Newton (L-BFGS)* — curvature-aware steps; classic for small problems.
- *Automatic differentiation internals* — forward vs reverse mode; the dual-number trick.
- *Proximal & subgradient methods* — optimize non-smooth penalties like L1.
- *Conjugate gradient* — solve big linear systems without inverting.
- *Matrix factorizations (QR, Cholesky, LU)* — the numerical guts under "solve".
- *Tensor/Einstein notation & contractions* — bookkeeping for higher-order arrays.

**Capstone — Optimization library from scratch.** Implement GD, momentum, Adam,
backtracking line search, and Newton's method; solve linear + logistic regression
and one Lagrange-constrained problem; verify every gradient numerically; reproduce
PCA via both eigendecomposition and SVD. **No scipy.optimize / sklearn.** *Uses:*
ch. 1–12.

---

### 3. Probability, Statistics & Inference
*The stats pillar everything else stands on.*
1. Probability axioms, conditional, Bayes ●
2. Random variables, expectation, variance, moments
3. Discrete distributions (Bernoulli→NegBin, Poisson) ●
4. Continuous distributions (Normal, Exp, Gamma, Beta) ●
5. Joint, marginal, covariance, correlation ●
6. MGF / PGF / CGF and what they buy you
7. Limit theorems: LLN, CLT (simulated) ●
8. Sampling distributions & standard error
9. Estimation: MLE & MAP from scratch ●
10. Confidence intervals & the bootstrap ●
11. Hypothesis testing; p-values; power; effect size
12. Multiple testing & false discovery rate
13. Bias–variance decomposition (simulated) ●
14. Cross-validation theory (k-fold/stratified/group/time)
15. Probability calibration & reliability curves ●
16. Bayesian inference: priors, posteriors, conjugacy ●

**Under the Trench**
- *Exponential family & sufficiency* — the unifying form behind most distributions.
- *Delta method* — variance of a transformed estimator.
- *EM algorithm as a general tool* — MLE with latent variables.
- *Fisher information & Cramér–Rao bound* — the best variance you can hope for.
- *Concentration inequalities (Hoeffding, Chernoff)* — finite-sample tail bounds.
- *Copulas* — model dependence separately from marginals.
- *Survival analysis (Kaplan–Meier, Cox)* — time-to-event with censoring.
- *Extreme value theory* — modeling the tails / rare maxima.
- *Permutation & rank tests* — assumption-light alternatives to t/ANOVA.

**Capstone — Inference toolkit.** Implement MLE for several distributions, a
bootstrap-CI engine, permutation tests, a conjugate Bayesian updater, and a
calibration/reliability analysis — **all from scratch** — then write a correct,
caveated statistical analysis of a real dataset (e.g., dengue vs climate:
Spearman vs Pearson, contingency tests). **No statsmodels for the core.** *Uses:*
ch. 1–16.

---

### 4. Data Wrangling & EDA
1. Data types & measurement scales
2. Loading messy data; encodings; dtypes & memory
3. Tidy data & reshaping for analysis
4. Missing data: MCAR/MAR/MNAR; imputation strategies ●
5. Outliers: detection & treatment
6. EDA workflow: distributions, relationships, contingency ●
7. Correlation: Pearson vs Spearman vs mutual information ●
8. Feature engineering: numeric (binning, transforms) ●
9. Feature engineering: categorical (one-hot/target/ordinal) ●
10. Feature engineering: datetime, text, cyclical
11. Scaling & transforms (standard, power, quantile)
12. **Data leakage** — every flavor, and how to kill it ●
13. **Validation strategy** that matches your test set ●
14. sklearn Pipelines & ColumnTransformer (leak-proof) ●

**Under the Trench**
- *Adversarial validation* — train a classifier to detect train/test drift.
- *Target/leave-one-out encoding with CV folds* — encoding without leaking the target.
- *Weight of evidence & information value* — credit-scoring feature transforms.
- *Entity/record linkage & fuzzy joins* — deduplicate and match dirty keys.
- *Imbalanced data: SMOTE family vs class weights* — when resampling actually helps.
- *Great Expectations / data contracts* — automated data-quality gates.
- *Feature stores & training/serving skew* — keep offline and online features identical.

**Capstone — Leak-proof pipeline on real messy data.** Produce a full EDA report,
principled missing/outlier handling, engineered features, and a CV scheme **proven
to track a held-out test** (build adversarial validation to confirm no drift).
Deliverable: a reproducible pipeline where CV ≈ holdout, plus a writeup of every
leakage risk you closed. *Uses:* ch. 1–14.

---

### 5. Classical Machine Learning
*The ESL core — every model with its math and a runnable example.*
1. Supervised setup: loss, risk, generalization
2. Linear regression: closed form & gradient ●
3. Regularization: Ridge, Lasso, Elastic Net (geometry) ●
4. Logistic regression; sigmoid/softmax; cross-entropy ●
5. Generalized linear models
6. k-Nearest Neighbors & curse of dimensionality
7. Naive Bayes (Gaussian/Multinomial/Bernoulli)
8. Linear & quadratic discriminant analysis
9. SVMs & the kernel trick ●
10. Decision trees: impurity, splits, pruning ●
11. Bagging & Random Forests ●
12. Boosting intuition: AdaBoost → gradient boosting ●
13. **XGBoost / LightGBM / CatBoost** deeply ● (objectives, leaf-wise vs level-wise, categorical handling, key params)
14. Unsupervised: k-Means, GMM/EM, DBSCAN/HDBSCAN ●
15. Hierarchical & spectral clustering
16. Dimensionality reduction: PCA, t-SNE, UMAP ●

**Under the Trench**
- *Splines & GAMs* — flexible nonlinearity you can still interpret.
- *Kernel smoothing / local regression (LOESS)* — fit curves without a model form.
- *Isotonic & quantile regression* — monotone fits / predict intervals not means.
- *Gaussian processes (preview)* — full Bayesian regression with uncertainty.
- *ICA & NMF* — source separation / parts-based factorization.
- *Manifold methods (Isomap, LLE, spectral embedding)* — nonlinear structure.
- *Association rules (Apriori/FP-growth)* — market-basket "X→Y" patterns.
- *One-class SVM & isolation forest* — anomaly detection.
- *Multi-output / multi-label / ordinal classification* — beyond single-label.
- *Conformal prediction* — distribution-free prediction sets with coverage guarantees.

**Capstone — Boosting + clustering from scratch.** Implement a decision-tree
regressor and gradient boosting (shrinkage, subsampling, early stopping) and match
LightGBM within tolerance on a tabular set; then implement k-Means, GMM(EM), and
PCA from scratch and cluster a dataset with a chosen-k justification. **No sklearn
estimators for the core algorithms.** *Uses:* ch. 1–16.

---

### 6. Time Series & Forecasting
1. Time-series structure: trend, seasonality, noise
2. Stationarity, differencing, ACF/PACF ●
3. Decomposition (classical, STL) ●
4. Exponential smoothing: simple → Holt → Holt-Winters ●
5. ARIMA / SARIMA / SARIMAX ●
6. Backtesting: rolling-origin / time-series CV ●
7. Feature-based ML forecasting (lags, windows, calendar) ●
8. Gradient boosting for time series
9. Multivariate: VAR; Granger causality
10. Volatility: ARCH / GARCH
11. Prediction intervals & forecast calibration ●
12. Deep forecasting: DeepAR, N-BEATS/N-HiTS, TFT ●

**Under the Trench**
- *State-space models & Kalman filter* — recursive estimation behind ETS/structural TS.
- *Prophet* — additive trend+seasonality+holidays, robust defaults.
- *Hierarchical forecasting & reconciliation* — make bottom-up and top-down agree.
- *Dynamic time warping* — align/compare series of different speeds.
- *Change-point & anomaly detection in series* — find regime shifts.
- *Intermittent demand (Croston's)* — forecasting sparse, spiky series.
- *Spectral analysis / Fourier & wavelets* — frequency-domain features.
- *Global vs local models* — one model across many series vs one-per-series.

**Capstone — Forecasting system from scratch.** Implement Holt-Winters and an
AR/ARIMA fit, plus a rolling-origin backtester; compare against a boosting model
with lag/calendar features; deliver calibrated prediction intervals and a model-
selection writeup. **No statsmodels for core ETS/AR.** *Uses:* ch. 1–11. (Ties to
your AgriBase / Holt's-trend work.)

---

### 7. Deep Learning Foundations
*From scratch first, then PyTorch. Runs on your GPU.*
1. Neuron → perceptron → MLP ●
2. Forward pass & computational graphs
3. Backpropagation by hand ●
4. Autograd: build reverse-mode diff ●
5. Loss functions & when to use each
6. Optimizers: SGD, momentum, Adam, schedules ●
7. Initialization (Xavier/He) & why it matters
8. Normalization: batch / layer / group ●
9. Regularization: dropout, weight decay, early stopping ●
10. PyTorch tensors, modules, the training loop ●
11. Data loading, batching, augmentation pipelines
12. Debugging training: NaNs, dead units, overfitting ●
13. Mixed precision, gradient clipping, accumulation

**Under the Trench**
- *Second-order/natural-gradient & K-FAC* — curvature methods for nets.
- *Loss landscape & mode connectivity* — why SGD finds good minima.
- *Lottery ticket hypothesis & pruning* — sparse subnetworks that train alone.
- *Quantization & knowledge distillation* — shrink models for deployment.
- *SAM (sharpness-aware minimization)* — optimize for flat minima.
- *Gradient checkpointing* — trade compute for memory on big models.
- *Neural tangent kernel* — the infinite-width theory link.
- *Hardware: GPU memory, kernels, the roofline* — why your batch OOMs.

**Capstone — Autograd engine + MLP from scratch.** Build a tensor-valued reverse-
mode autograd and an optimizer suite (SGD/momentum/Adam), implement dropout +
batchnorm yourself, and train an MLP on a real dataset matching a torch baseline.
**No `torch.autograd` / `torch.nn` for the core.** *Uses:* ch. 1–12.

---

### 8. CNNs & Computer Vision
1. Convolution & cross-correlation; why it works ●
2. Padding, stride, dilation, receptive field
3. Pooling & downsampling
4. Classic CNNs: LeNet → ResNet (skip connections) ●
5. Batchnorm in CNNs; modern blocks
6. Transfer learning & fine-tuning ●
7. Data augmentation for vision (incl. mixup/cutmix)
8. Object detection: IoU, anchors, NMS ●
9. Detectors: R-CNN family, YOLO, DETR
10. Semantic & instance segmentation (U-Net, Mask R-CNN) ●
11. Vision Transformers (ViT) & hybrids ●
12. Self-supervised vision (contrastive, MAE)

**Under the Trench**
- *Deformable & dilated convolutions* — flexible/large receptive fields.
- *Feature pyramids (FPN)* — multi-scale detection.
- *Keypoint & pose estimation* — heatmap regression.
- *Optical flow & video models* — motion across frames.
- *NeRF & 3D / point clouds* — view synthesis and 3D vision.
- *OCR pipelines* — detection + recognition (you use Whisper's cousin world).
- *Grad-CAM & saliency* — see what a CNN looks at.
- *Model compression for vision (MobileNet, depthwise-separable)* — edge inference.

**Capstone — CNN + detection/segmentation, mostly from scratch.** Implement conv
forward+backward at least once; train a small CNN in torch on an image task;
implement an IoU/NMS pipeline and either a simple detector head or a U-Net
segmenter; report mAP or mIoU. *Uses:* ch. 1–11.

---

### 9. Sequence Models, Attention & Transformers
1. Sequence problems & tokenization basics
2. RNNs; backprop through time ●
3. Vanishing gradients; LSTM & GRU ●
4. Bidirectional & deep recurrent nets
5. Seq2seq & the encoder–decoder
6. Attention, from scratch ●
7. Self-attention & multi-head attention ●
8. Positional encoding (sinusoidal, learned, RoPE) ●
9. The Transformer block (full) ●
10. Training Transformers: warmup, label smoothing, masking
11. Decoding: greedy, beam, sampling, KV cache ●
12. Encoder-only vs decoder-only vs enc-dec (BERT vs GPT vs T5)

**Under the Trench**
- *Efficient attention (Performer, Linformer, sparse, sliding-window)* — beat O(n²).
- *FlashAttention* — IO-aware exact attention that's just faster.
- *Grouped-/Multi-query attention (GQA/MQA)* — shrink the KV cache.
- *ALiBi & long-context positional schemes* — extrapolate past training length.
- *Pointer networks & CTC* — copy mechanisms / alignment-free seq labeling.
- *Memory-augmented & recurrent-memory transformers* — carry state across segments.
- *Speculative & assisted decoding* — generate faster with a draft model.

**Capstone — Transformer from scratch, trained.** Implement multi-head self-
attention, positional encoding, and a full encoder/decoder; train a char-level or
toy-translation model; implement a KV cache for generation. **No `nn.Transformer`.**
*Uses:* ch. 1–12. (nanoGPT-level, self-built.)

---

### 10. Generative Models
1. What "generative" means; likelihood vs implicit
2. Autoencoders & the latent space ●
3. Variational autoencoders: ELBO, reparameterization ●
4. GANs: minimax game, training ●
5. GAN failure modes & fixes (WGAN-GP, etc.)
6. Normalizing flows (change of variables) ●
7. Diffusion models: forward noise, reverse denoise ●
8. DDPM training & sampling; classifier-free guidance ●
9. Latent diffusion & conditioning (text→image idea)
10. Autoregressive generation (pixels/tokens)
11. Evaluating generative models (FID, IS, NLL)

**Under the Trench**
- *Score-based models & SDEs* — the continuous view unifying diffusion.
- *Energy-based models & contrastive divergence* — unnormalized densities.
- *VQ-VAE & discrete latents* — tokenizing images/audio.
- *Consistency & flow-matching models* — few-step fast generation.
- *Restricted Boltzmann machines* — historical, MCMC-trained generators.
- *Conditional GANs / pix2pix / CycleGAN* — paired/unpaired translation.

**Capstone — VAE + diffusion from scratch.** Implement a VAE (reparam, ELBO) and a
DDPM (noise schedule, loss, sampling) on a small image set; add a simple GAN;
compare samples and discuss tradeoffs. *Uses:* ch. 1–11.

---

### 11. Modern & Alternative Architectures
*Current (2026). The move beyond vanilla attention — your research thread.*
1. The efficiency problem: O(n²), KV-cache cost ●
2. Linear & kernelized attention recap
3. State Space Models: S4 → SSD intuition ●
4. **Mamba / Mamba-2**: selective state spaces, the scan ●
5. Other recurrents: RWKV, RetNet, Hyena ●
6. Mixture-of-Experts: routing & sparse compute ●
7. MoE in practice: load balancing, Mixtral-style ●
8. Hybrids: Jamba / Samba / Nemotron (Mamba+Attn+MoE) ●
9. Liquid Neural Networks (LNNs)
10. Kolmogorov–Arnold Networks (KANs) ●
11. Cross-architecture distillation (Attention→Mamba)
12. Reading architecture papers systematically; choosing per use-case

**Under the Trench**
- *Mixture-of-Depths / early-exit* — spend compute only where needed.
- *Linear-attention deltas (DeltaNet, Gated DeltaNet)* — newest linear variants.
- *Sparse/Switch routing internals & expert collapse* — why MoE training breaks.
- *Retrieval-augmented architectures (RETRO)* — bake retrieval into the model.
- *Mixture-of-Attention-heads / SwitchHead* — sparsity inside attention.
- *Hardware-aware design (the Mamba trick)* — algorithms shaped by GPU memory.

**Capstone — Build & benchmark an attention alternative.** Implement a minimal
Mamba/SSM block (selective scan) **or** an MoE layer with routing + load balancing,
plus a GQA attention; benchmark throughput and quality vs vanilla attention on a
sequence task; write the tradeoff analysis. *Uses:* ch. 1–11 (and DL Foundations,
Transformers).

---

### 12. NLP & Large Language Models
*Straight into Fixeth + your pgvector RAG world.*
1. Text preprocessing; the tokenization problem ●
2. Subword tokenizers (BPE, WordPiece, Unigram) ●
3. Bag-of-words / TF-IDF → classic text classification ●
4. Static embeddings (Word2Vec/GloVe) ●
5. Contextual embeddings; BERT vs GPT families
6. Using `transformers`: pipelines & inference ●
7. Sentence embeddings & semantic similarity ●
8. Fine-tuning: full vs LoRA/PEFT (with a small run) ●
9. Instruction tuning, RLHF/DPO (the idea)
10. Prompting & structured/JSON output
11. **RAG**: chunking, embedding, vector + BM25 hybrid (RRF), reranking ●
12. Query transformation: rewriting, HyDE, decomposition ●
13. **GraphRAG & agentic RAG** (plan→retrieve→reflect→verify) ●
14. Evaluating LLM/RAG (recall@k, groundedness, RAGAS) ●
15. Multilingual/Bengali: tokenization & script pitfalls

**Under the Trench**
- *Quantization for inference (GPTQ/AWQ, GGUF)* — run big models on your laptop.
- *KV-cache management & paged attention (vLLM)* — serve LLMs efficiently.
- *Long-context tricks & context compression* — fit more, pay less.
- *Speculative decoding* — faster generation with a draft model.
- *Structured generation / constrained decoding (grammars)* — guarantee valid output.
- *Tool use & function calling internals* — how agents call APIs.
- *Embedding model fine-tuning & hard-negative mining* — sharpen retrieval.
- *Guardrails, jailbreak & prompt-injection defense* — production safety.
- *Classic NLP (NER, POS, dependency parsing, coref)* — still useful, pre-LLM.

**Capstone — RAG system from scratch + eval.** Build chunking, a hybrid index
(dense + BM25 with RRF), a reranker, query rewriting/HyDE, and generation; add a
small agentic loop (retrieve→reflect→retrieve); evaluate retrieval (recall@k,
precision@k) and answer groundedness on a QA set. **No LangChain/LlamaIndex — wire
it yourself.** *Uses:* ch. 1–15. (Mirrors Fixeth.)

---

### 13. Reinforcement Learning
*Tabular → deep, Sutton-grounded.*
1. The RL problem; agent–environment; reward ●
2. Multi-armed bandits; explore vs exploit; UCB ●
3. Markov Decision Processes; value functions
4. Dynamic programming: policy & value iteration ●
5. Monte Carlo prediction & control
6. Temporal-difference learning; SARSA; Q-learning ●
7. n-step & eligibility traces (TD(λ))
8. Function approximation; the deadly triad
9. Deep Q-Networks: replay, target nets ●
10. Policy gradients: REINFORCE; baselines ●
11. Actor–critic; A2C; PPO ●
12. Continuous control: DDPG, TD3, SAC
13. Model-based RL & planning (Dyna, MCTS/AlphaZero)

**Under the Trench**
- *Offline / batch RL (CQL, BCQ)* — learn from logged data, no environment.
- *Inverse RL & imitation (behavior cloning, GAIL)* — recover reward from demos.
- *Distributional RL (C51, QR-DQN)* — model the whole return distribution.
- *Multi-agent RL* — cooperation/competition among agents.
- *Exploration beyond ε-greedy (intrinsic/curiosity, RND)* — sparse-reward tasks.
- *Hierarchical RL & options* — temporally extended actions.
- *RLHF as RL* — where PPO meets language models.
- *Bandits in production (Thompson sampling, contextual)* — recommendation/ads.

**Capstone — Tabular → deep RL from scratch.** Implement value iteration,
Q-learning, and SARSA on a gridworld; then DQN (replay + target net) and
REINFORCE/PPO on CartPole; compare sample efficiency. **No RL libraries (env API
only).** *Uses:* ch. 1–11.

---

### 14. Graph Machine Learning
1. Graphs: representations, sparsity, tasks
2. Classic node features & centralities
3. Node embeddings: DeepWalk, node2vec ●
4. The message-passing framework ●
5. Graph Convolutional Networks (GCN) ●
6. GraphSAGE (sampling, inductive) ●
7. Graph Attention Networks (GAT) ●
8. Pooling & graph-level readout (graph classification)
9. Link prediction & negative sampling ●
10. Scaling GNNs (neighbor/cluster sampling)
11. Knowledge-graph embeddings (TransE, etc.)

**Under the Trench**
- *Spectral graph theory & the graph Laplacian* — the math under GCN.
- *Over-smoothing & over-squashing* — why deep GNNs degrade.
- *Heterogeneous & temporal graphs* — multi-type / evolving graphs.
- *Graph transformers* — attention over graphs.
- *Expressive power & the WL test* — what GNNs can't distinguish.
- *Community detection & graph clustering* — Louvain, modularity.
- *GraphRAG link* — KG construction feeds your RAG course.

**Capstone — GNN from scratch + real graph task.** Implement a GCN layer (message
passing) from scratch, then build GraphSAGE/GAT in a framework; do node
classification and link prediction (with negative sampling) on a real graph;
report metrics. *Uses:* ch. 1–11.

---

### 15. Recommender Systems
1. The recommendation problem; explicit vs implicit
2. Evaluation: NDCG, MAP, recall@k, temporal splits ●
3. Neighborhood CF (user/item-based) ●
4. Matrix factorization: SVD/ALS ●
5. Implicit feedback: BPR, weighted ALS ●
6. Factorization machines ●
7. Neural CF & two-tower retrieval ●
8. Sequential / session-based (GRU4Rec, SASRec)
9. Content & hybrid recommenders; cold-start ●
10. Candidate generation → ranking (two-stage)
11. Bandits & online learning for recsys

**Under the Trench**
- *Wide & Deep / DeepFM / DLRM* — industrial CTR architectures.
- *Graph-based recsys (LightGCN)* — CF as a graph problem.
- *Diversity, novelty, serendipity, fairness* — beyond accuracy.
- *Exposure bias & debiasing* — logged data is not random.
- *Approximate nearest neighbors (FAISS/HNSW)* — serve retrieval at scale.
- *Multi-task & multi-objective ranking* — optimize clicks + dwell + revenue.
- *Reranking & calibration in ranking* — final-stage polish.

**Capstone — Recommender stack.** Implement matrix factorization (ALS + BPR) from
scratch, a two-tower neural recommender, and a sequential model; evaluate with
ranking metrics under temporal splits; handle cold-start. *Uses:* ch. 1–10.

---

### 16. Bayesian & Probabilistic ML
1. Bayesian inference recap; priors & posteriors ●
2. Conjugate models end-to-end ●
3. Why sampling: the intractable posterior
4. MCMC: Metropolis–Hastings from scratch ●
5. Gibbs sampling ●
6. Hamiltonian Monte Carlo & NUTS (the idea)
7. Convergence diagnostics (R-hat, ESS, trace) ●
8. Probabilistic programming (PyMC/NumPyro) ●
9. Hierarchical / multilevel models ●
10. Variational inference & the ELBO ●
11. Gaussian processes from scratch ●
12. Bayesian deep learning (MC dropout, ensembles)

**Under the Trench**
- *Empirical Bayes* — estimate the prior from the data.
- *Nonparametric Bayes (Dirichlet process)* — infinite mixtures, unknown #clusters.
- *Bayesian optimization* — sample-efficient black-box tuning (links to HPO).
- *Probabilistic graphical models (Bayes nets, MRFs, belief propagation)* — structured joints.
- *Expectation propagation* — an alternative to VI.
- *Stochastic VI & normalizing-flow posteriors* — scale/flexibility for VI.
- *Causal Bayesian models & do-calculus* — intervention, not just correlation.

**Capstone — Probabilistic modeling from scratch + PPL.** Implement Metropolis–
Hastings and Gibbs on a hierarchical model from scratch; rebuild it in a PPL and
run full posterior + diagnostics (R-hat, ESS); fit a Gaussian Process regressor
from scratch. *Uses:* ch. 1–11 (and Prob/Stats foundations).

---

### 17. Evaluation, Tuning & Interpretability
1. Classification metrics: precision/recall/F1, ROC vs PR ●
2. Regression & ranking metrics ●
3. Threshold selection; cost-sensitive decisions ●
4. Probability calibration (Platt, isotonic) ●
5. Cross-validation pitfalls in practice ●
6. Hyperparameter search: grid → random → Bayesian ●
7. **Optuna**: samplers, pruners, multi-objective ●
8. Feature importance: permutation, gain, drop-column
9. **SHAP**: theory + reading the plots ●
10. Partial dependence, ICE, surrogate models
11. Error analysis as a discipline
12. Experiment tracking: what to log and why

**Under the Trench**
- *Conformal prediction* — guaranteed-coverage prediction sets.
- *Counterfactual & contrastive explanations* — "what would flip this?".
- *LIME & anchors* — local model-agnostic explanations.
- *Influence functions* — which training points drove a prediction.
- *Fairness metrics & bias audits* — demographic parity, equalized odds.
- *Multi-objective / Pareto tuning & ASHA/Hyperband* — efficient large sweeps.
- *Drift & performance monitoring (PSI, KS)* — links to MLOps.
- *Statistical significance of model comparisons* — don't ship noise.

**Capstone — Evaluation & tuning harness.** Build an experiment-tracking harness,
an Optuna study (pruning + multi-objective), calibration + threshold optimization,
and a SHAP/permutation-importance analysis — producing a decision-ready report on
a real model. *Uses:* ch. 1–12.

---

### 18. Applied / Competition ML (Kaggle)
*Your exact toolkit, made systematic.*
1. Reading a competition: metric, leak risk, CV design ●
2. Building a CV that matches the leaderboard ●
3. EDA → fast baselines
4. Feature engineering patterns that pay off ●
5. Target encoding without leakage ●
6. Handling magic/anonymized features
7. Ensembling: blending vs stacking ●
8. **Rank-blend & weighted blends** ●
9. **Pseudo-labeling** done safely ●
10. Adversarial validation (train/test drift) ●
11. Hill-climbing the ensemble
12. Reproducibility, seeds, submission hygiene
13. Writing the solution report

**Under the Trench**
- *Multi-level stacking & out-of-fold discipline* — deep stacks without leakage.
- *Post-processing to the metric* — optimize thresholds/rounding for the exact score.
- *Test-time augmentation* — average predictions over input perturbations.
- *Denoising & label-noise handling* — when labels lie.
- *GPU-efficient tabular (RAPIDS cuDF/cuML)* — speed for big sweeps.
- *Knowledge of the metric's math* — exploit (or avoid exploiting) its quirks.

**Capstone — Full competition, end to end.** Take a dataset/competition: trustworthy
CV, feature engineering, leak hunting, adversarial validation; train diverse models;
stack/rank-blend + hill-climb; write a complete solution report. *Uses:* every
chapter (and draws on Classical ML, Eval/Tuning). (Your S6E2 / heart-disease style.)

---

### 19. System Design & Architecture
*General distributed systems → ML systems. Concept + diagram + (often) a runnable
Python demo + a paper design exercise. DDIA-grounded.*

**Fundamentals**
1. How to approach a design: requirements → API → data → scale
2. Back-of-envelope estimation; latency numbers ●

**Building blocks**
3. Clients, servers, proxies, reverse proxies, load balancers
4. Load-balancing & **consistent hashing** (build it) ●
5. Caching: where/what/eviction; **LRU/LFU from scratch** ●
6. Cache invalidation & stampede protection ●
7. **Bloom filters** (build one) ●
8. Message queues, pub/sub, event-driven design
9. CDNs & object/blob storage

**Data layer (DDIA)**
10. SQL vs NoSQL; pick by access pattern
11. Storage engines: **B-tree vs LSM-tree** ●
12. Indexing & query plans (why your query is slow)
13. Replication: leader/follower, multi-leader, leaderless/quorums
14. Partitioning / **sharding** ●
15. Transactions: ACID, isolation levels, snapshot isolation, serializability
16. CAP, linearizability vs causal consistency ●
17. Consensus: Raft / Paxos (the idea)
18. Batch vs stream processing; change data capture

**Scale & reliability**
19. Stateless services & horizontal scaling
20. **Rate limiting: token bucket / leaky bucket** (build it) ●
21. Idempotency, retries, **backoff + jitter** (simulate thundering herd) ●
22. Circuit breakers, bulkheads, backpressure
23. Observability: logs, metrics, traces, SLO/SLI

**ML systems design**
24. Training vs serving; batch vs online (real-time) inference
25. Feature stores & training/serving skew
26. Model registry, versioning, shadow & canary rollout
27. **RAG system architecture** end-to-end (ingest→embed→store→retrieve→rerank→generate) ●
28. Data/feature pipelines; where n8n / Airflow fit
29. Production monitoring: data & concept drift, feedback loops

**Case studies (design exercises)**
30. Design: URL shortener · news feed · chat · a job-scraper pipeline (yours) ·
    a vector-search service · a ZATCA e-invoicing SaaS backend (yours)

**Under the Trench**
- *Vector clocks & CRDTs* — track causality / merge concurrent edits.
- *Two-phase / three-phase commit & sagas* — distributed transactions and their escape hatch.
- *Gossip & membership protocols* — how clusters agree who's alive.
- *Quorum math (R+W>N) & read repair* — tune consistency vs availability.
- *Bulk data formats (Parquet/Arrow/Avro) & columnar warehouses* — analytics storage.
- *Lambda vs Kappa architecture* — batch+stream vs stream-only.
- *Multi-region, consistency, and clock skew (Spanner/TrueTime)* — global systems.
- *Idempotency keys & exactly-once semantics* — the hard part of queues.

**Capstone — Build a sharded, cached, rate-limited service + design one big system.**
Implement a key-value service with consistent-hashing sharding, an LRU cache with
stampede protection, a token-bucket limiter, a bloom filter, and retries with
backoff+jitter; load-test it; write the design doc (CAP/consistency tradeoffs).
Then fully design one large system on paper (e.g., your RAG service or e-invoicing
SaaS). *Uses:* ch. 1–30.

---

### 20. MLOps & Productionization
*Lean; complements System Design's ML section.*
1. Packaging a model: artifacts, schemas, versioning
2. Serving with FastAPI: async, batching ●
3. Containerizing; resource limits; reproducible builds
4. CI/CD for models (test data, test the model, gate on metrics) ●
5. Pipelines & scheduling (n8n / Airflow) — your world ●
6. Experiment & model tracking (MLflow-style)
7. Monitoring: drift, data quality, alerting ●
8. Retraining triggers & the feedback loop
9. Cost, latency, and scaling inference

**Under the Trench**
- *Feature stores (Feast)* — consistent offline/online features in production.
- *Model/data versioning (DVC) & lineage* — reproduce any past result.
- *Canary / shadow / A-B model rollout* — ship safely.
- *Edge & on-device deployment (ONNX, TFLite)* — run off the server.
- *GPU serving & batching (Triton, vLLM)* — high-throughput inference.
- *Infra as code & GitOps* — your Proxmox/WireGuard world, formalized.
- *Data/ML observability platforms* — end-to-end quality tracking.

**Capstone — Productionize a model end to end.** Package a model with a schema,
serve via FastAPI (async + batched), containerize with limits, add a CI gate on
metrics, a drift monitor, and a retraining trigger wired through n8n/Airflow;
document the lifecycle. *Uses:* ch. 1–9. (Your pipeline/deploy world.)

---

## 4. Cross-links (study one, reinforce another)

- Math→SVD/PCA ↔ Classical ML→PCA ↔ Generative→latent spaces
- Prob/Stats→calibration/bias-variance ↔ Eval→calibration ↔ Classical ML→model selection
- Prob/Stats→MCMC/VI ↔ Bayesian ML (full treatment)
- DL Foundations→autograd ↔ every deep-learning course
- Sequence/Transformers ↔ Modern Architectures ↔ NLP/LLMs (same backbone, three lenses)
- NLP→RAG ↔ System Design→RAG architecture ↔ Graph ML→GraphRAG
- Eval→HPO/Optuna ↔ Bayesian→Bayesian optimization ↔ Kaggle→tuning
- Data Wrangling→leakage/validation ↔ Kaggle→trustworthy CV (the same discipline)
- MLOps ↔ System Design→ML systems (build vs design two views of production)

## 5. Build order

1. **Phase 0 — platform:** Next.js shell (menu, sidebar, page template), wire
   `TryItYourself` to the runner. Backend already done & tested.
2. **Phase 1 — prove the loop:** Classical ML ch. 1–4 end-to-end (concept →
   example → try-it → exercise) + the per-page kernel session.
3. **Phase 2 — Foundations:** Python · Math · Prob/Stats · Data Wrangling.
4. **Phase 3 — Core ML:** finish Classical ML · Time Series · Eval/Tuning · Kaggle.
5. **Phase 4 — Deep Learning:** DL Foundations · CNN/CV · Sequence/Transformers ·
   Generative · Modern Architectures · NLP/LLMs.
6. **Phase 5 — Specialized:** RL · Graph ML · RecSys · Bayesian.
7. **Phase 6 — Systems:** System Design · MLOps.

Per course, write chapters first, then Under-the-Trench stubs, then the capstone
spec (with its no-AI rule and acceptance criteria).

## 6. Reference anchors (honest grounding)

The topic spines were cross-checked against standard references and current work,
then reorganized and described in our own words:
- **Classical ML & Stats:** ISLR, ESL (Hastie/Tibshirani/Friedman).
- **Deep Learning:** Goodfellow–Bengio–Courville; CS231n (vision); CS224n (NLP).
- **Reinforcement Learning:** Sutton & Barto (2nd ed.) + modern deep-RL.
- **System Design / data layer:** Designing Data-Intensive Applications (Kleppmann).
- **Modern architectures & RAG (2025–2026):** Mamba/Mamba-2, MoE, RWKV/RetNet,
  Jamba/Nemotron hybrids; advanced/Graph/agentic RAG, RAGAS-style evaluation.

These are anchors, not the source of the wording — every chapter and capstone here
is written for this site and for your background.
