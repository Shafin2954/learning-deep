# The Kaggle Glossary

Every term you'll meet on Kaggle, defined in depth. Read it once end to end; then use it
as a reference. Grouped by category. Cross-references point to chapters (this track) and
F-chapters (the foundations-for-llm track) where a term gets a full treatment.

---

## 1. Competition mechanics

**Kaggle** — a platform hosting data-science competitions, datasets, and notebooks.
Competitions give you training data with labels and test data without labels; you predict
the test labels and submit them to be scored.

**Competition types** — *Featured* (sponsored, prize money, hardest), *Research*
(scientific, often non-cash), *Getting Started* (permanent, for learning, e.g. Titanic),
*Playground* (low-stakes practice, monthly tabular "Season" series — your usual),
*Community* (user-created), *Analytics* (open-ended, judged write-ups, no leaderboard),
*Code/Kernels-only* (you submit a notebook that runs on Kaggle, not a CSV), *Simulation*
(your agent competes against others).

**Train set / test set** — the labeled data you learn from, and the unlabeled data you
predict. Your score comes only from the test set.

**Public test / private test split** — the test set is secretly divided. During the
competition you see your score on the *public* portion (the **public leaderboard**); your
final standing uses the hidden *private* portion (the **private leaderboard**), revealed
only at the end. This split is why overfitting the public score is dangerous (see
*shake-up*).

**Public leaderboard (LB)** — the live ranking based on the public test portion. A small,
noisy sample you can accidentally overfit by submitting repeatedly to it (*LB probing*).

**Private leaderboard** — the final ranking on the hidden test portion. The only one that
counts for prizes/medals.

**Shake-up / shake-down** — the change in rankings when the private LB is revealed. People
who overfit the public LB *shake down* (fall); people who trusted robust local validation
often *shake up* (rise). A big shake-up means the public LB was a poor guide.

**Submission** — your predicted labels for the test set, uploaded for scoring. Limited per
day (*daily submission limit*, often 5). You pick 1–2 **final submissions** that count for
the private LB — choosing these by your CV, not the public LB, is a core discipline (ch.
12–13).

**Sample submission** — a template file showing the exact required format (column names,
row ids, order). Your output must match it exactly or scoring fails.

**Evaluation metric** — the formula that scores submissions (RMSE, AUC, F1, etc.). Fixed
by the host; you must optimize *this*, which can differ from your model's training loss
(ch. 14, F14).

**Baseline** — a simple first model/submission that establishes a score to beat (e.g.,
predict the mean, or a default LightGBM). Submitting one early validates your whole
pipeline.

**Benchmark** — a reference score, sometimes provided by the host, that a serious solution
should exceed.

**Team / team merger / merger deadline** — you may form teams; the *merger deadline* is
the last date to combine. Teams share a submission budget.

**Medals & tiers** — top finishers earn *bronze/silver/gold* medals; accumulating medals
raises your *tier*: Novice → Contributor → Expert → Master → Grandmaster (separate
progression for Competitions, Datasets, Notebooks, Discussions).

**Code competition / kernels-only** — submissions are notebooks Kaggle runs for you,
usually with **no internet**, a **runtime limit** (e.g. 9 hours), and fixed GPU/TPU. You
must pre-attach models/data as Kaggle **Datasets** (ch. 13 of the LLM track covers the
offline-submission discipline, which applies here too).

**External data** — data beyond what the host provides. Each competition's rules state
whether it's allowed; using disallowed data is disqualifying.

**Leak (competition sense)** — an unintended flaw in how the data was prepared that lets
you predict the target without real modeling (e.g., row order encodes the label, or an id
correlates with the target). Distinct from your own *validation leakage* (section 2), but
related. Hosts patch leaks; exploiting one is contentious and sometimes banned.

**Write-up / solution sharing** — after a competition, top teams post how they did it.
Reading these is the fastest way to learn the meta.

**Notebook / kernel** — a Kaggle-hosted Jupyter environment (CPU/GPU/TPU) for running
code, doing EDA, and (in code competitions) producing submissions.

---

## 2. Validation & cross-validation (the heart of competing)

**Validation set / holdout** — data you set aside (not trained on) to estimate how your
model generalizes. Your local proxy for the test set.

**Cross-validation (CV)** — instead of one holdout, split the data into *k* parts
(*folds*); train on k−1, validate on the held-out one, repeat k times, average the scores.
Uses all data for both training and validation and gives a stable estimate (F14).

**k-fold** — the basic CV: k equal folds. Common k = 5.

**Stratified k-fold** — k-fold that preserves the class balance (or target distribution)
in each fold. Essential for imbalanced data and classification (F14).

**Group k-fold** — k-fold where all rows sharing a *group* (same user, author, source)
stay in the same fold, preventing the model from "recognizing the group" instead of
learning the task (group leakage, F15).

**Time-series split** — for temporal data: always train on the past, validate on the
future (no shuffling). Prevents *temporal leakage* (F15).

**Leave-one-out (LOOCV)** — k equal to the number of rows; each row is its own validation
fold. Accurate but expensive; rare in practice.

**Repeated k-fold** — run k-fold several times with different shuffles and average, to
reduce the variance of the estimate.

**Nested CV** — an outer CV to estimate performance and an inner CV to tune
hyperparameters, so tuning doesn't leak into the performance estimate. The rigorous (but
costly) way to report an honest tuned score.

**Out-of-fold (OOF) predictions** — for each fold, the predictions made on its held-out
part by the model trained on the other folds. Concatenated, OOF gives one held-out
prediction per training row — the basis of honest CV scoring and of *stacking* (ch. 16).

**CV–LB gap / correlation** — the relationship between your local CV score and the public
LB. If they move together, trust your CV and decide offline. If they diverge, suspect
leakage or distribution shift, and (usually) **trust your CV** over the noisy public LB
(F15).

**Local validation** — evaluating offline with your own CV before (or instead of) spending
a submission. The skill that lets you iterate fast without burning your submission budget.

**Data leakage** — information available in training that won't be available at prediction
time, which inflates validation scores and then fails on the real test. Forms:
- *Target leakage* — a feature derived from or encoding the label.
- *Train–test contamination* — duplicate/near-duplicate rows split across train and
  validation.
- *Group leakage* — related rows (same entity) split across folds.
- *Temporal leakage* — using the future to predict the past.
- *Preprocessing leakage* — fitting a scaler/encoder/imputer on train+val together rather
  than inside each fold.
(Full treatment: F15.)

**Adversarial validation** — label train rows 0 and test rows 1, train a classifier to
tell them apart. AUC ≈ 0.5 → same distribution (random CV is safe); AUC ≫ 0.5 → train and
test differ, so a naive CV will mislead and you must adapt (F15).

**Overfitting the leaderboard / LB probing** — tuning to the public LB via many
submissions, which fits its small sample's noise and collapses on the private LB.

---

## 3. The tabular problem & general ML terms

**Tabular data** — data in rows (samples/observations/instances) and columns (features +
a target). The dominant Kaggle format and the home of tree-based models.

**Feature / predictor / variable** — an input column. **Target / label / response** — the
column you predict. **Sample / row / instance / observation** — one record.

**Supervised learning** — learning from labeled examples (the Kaggle norm). **Unsupervised**
— finding structure without labels (clustering, dimensionality reduction).

**Classification** — predicting a category (*binary* = two classes, *multiclass* = many,
*multilabel* = several labels can be true at once). **Regression** — predicting a
continuous number.

**Generalization** — performing well on unseen data, the actual goal. **Overfitting** —
fitting training noise, so train score ≫ validation score. **Underfitting** — too simple to
capture the signal, both scores poor. **Bias–variance tradeoff** — underfitting is high
bias, overfitting is high variance; you tune model complexity between them (F6).

**Class imbalance** — when one class is far rarer (fraud, churn). Handled with *class
weights*, *oversampling* (duplicate/synthesize minority), *undersampling* (drop majority),
or **SMOTE** (synthesize minority points by interpolation). Also drives metric choice
(use F1/AUC, not accuracy) and stratification.

**Seed / random state / reproducibility** — the random number used to make stochastic
steps repeatable. Fix all seeds and log configs so a good run can be rebuilt (F7).

**Pipeline** — a chained sequence of preprocessing + model fit/predict, where every step is
fit *inside* the fold to prevent preprocessing leakage. sklearn's `Pipeline` +
`ColumnTransformer` is the standard tool.

**Inference / prediction** — producing outputs on new data. For classification you may
output a *class* or a *probability*; many metrics (AUC, log loss) need probabilities.

---

## 4. Models — linear, trees, forests, boosting

**Linear regression** — predict the target as a weighted sum of features; fit by minimizing
squared error (F1–F2 give the math).

**Logistic regression** — linear model for classification: the weighted sum is passed
through a sigmoid to give a probability; fit by minimizing log loss (F1, F3). A strong,
fast baseline.

**Generalized linear model (GLM)** — the family generalizing linear/logistic to other
target distributions (Poisson for counts, etc.) via a link function.

**Regularization** — penalizing model complexity to fight overfitting. **L2 / Ridge** —
penalizes squared weights, shrinks them smoothly. **L1 / Lasso** — penalizes absolute
weights, drives some to exactly zero (feature selection). **ElasticNet** — a mix of both.
(Geometry in F-chapters / ch. 3 here.)

**Decision tree** — a model that repeatedly splits the data on feature thresholds, forming
a tree whose leaves give a prediction. Splits chosen to most reduce impurity.
- **Node / leaf / depth** — internal split points / terminal prediction cells / longest
  root-to-leaf path. **Split** — a (feature, threshold) test.
- **Splitting criterion** — what a split optimizes: **Gini impurity** or **entropy**
  (classification), **MSE/variance reduction** (regression).
- **Pruning** — cutting back a grown tree to reduce overfitting; **max_depth /
  min_samples_leaf** limit growth up front.
Trees capture nonlinearity and interactions natively and need no feature scaling — which is
why they dominate tabular Kaggle.

**Bagging (bootstrap aggregating)** — train many models on bootstrap resamples of the data
and average them, reducing variance. **Bootstrap** — sampling rows with replacement to make
a resampled dataset.

**Random Forest** — bagging of decision trees with an extra twist: each split considers
only a random subset of features, decorrelating the trees. Robust, low-tuning baseline.
- **Out-of-bag (OOB) score** — since each bootstrap omits ~37% of rows, those omitted rows
  give a free validation estimate for that tree; averaged, the OOB score approximates CV
  without a separate split.

**Boosting** — build models *sequentially*, each correcting the errors of the ensemble so
far. Reduces bias (and variance). The dominant tabular approach.

**AdaBoost** — early boosting that reweights misclassified points each round.

**Gradient boosting (GBDT / GBM)** — boosting where each new tree is fit to the **negative
gradient** of the loss (for squared error, that's the residuals) of the current ensemble;
add trees scaled by a learning rate. The engine behind XGBoost/LightGBM/CatBoost (built
from scratch in ch. 6).

**kNN (k-nearest neighbors)** — predict from the k closest training points. Simple,
distance-based, needs scaling; weak on high-dimensional tabular but useful as a diverse
ensemble member.

**SVM (support vector machine)** — finds a maximum-margin separator, optionally in a
nonlinear *kernel* space. Strong on small/medium data; rarely the tabular winner now.

**Naive Bayes** — probabilistic classifier assuming feature independence; fast baseline,
especially for text counts.

---

## 5. Gradient-boosting libraries & their parameters

The three libraries Kaggle tabular runs on. They implement GBDT with different engineering.

**XGBoost** — the classic high-performance GBDT. **Level-wise (depth-wise) growth**: grows
the tree level by level. Robust, well-documented.

**LightGBM** — fast, memory-efficient GBDT. **Leaf-wise growth**: grows the leaf that most
reduces loss (deeper, more accurate, more prone to overfit on small data — control with
`num_leaves`/`min_data_in_leaf`). Uses **histogram-based splitting** (bins continuous
features for speed), **GOSS** (Gradient-based One-Side Sampling — keep large-gradient rows,
subsample small-gradient ones), and **EFB** (Exclusive Feature Bundling — merge sparse
mutually-exclusive features). Usually the fastest and a default favorite.

**CatBoost** — GBDT specialized for **categorical features**. Uses **ordered target
statistics** (a leakage-safe way to target-encode categoricals using only past rows) and
**ordered boosting** (a permutation trick that avoids the *prediction shift* bias of
standard boosting). Often best out-of-the-box on categorical-heavy data with little tuning;
handles categoricals natively (no manual encoding).

**Shared parameters (names vary by library — grouped by what they do):**
- **learning_rate / eta / shrinkage** — how much each tree contributes. Lower = slower,
  needs more trees, usually generalizes better. The key bias/variance dial.
- **n_estimators / num_boost_round / num_iterations / iterations** — number of boosting
  rounds (trees). Paired with early stopping.
- **max_depth** — tree depth cap. **num_leaves** (LightGBM) — leaf-wise leaf cap (the real
  complexity knob there; keep `num_leaves < 2^max_depth`).
- **min_child_weight / min_data_in_leaf / min_child_samples** — minimum data (or hessian)
  per leaf; raises it to regularize.
- **subsample / bagging_fraction** — fraction of *rows* sampled per tree (stochastic
  boosting, reduces overfitting). **colsample_bytree / feature_fraction** — fraction of
  *features* per tree.
- **reg_alpha (L1) / reg_lambda (L2) / lambda** — weight penalties on leaf values.
- **gamma / min_split_gain / min_split_loss** — minimum loss reduction to make a split
  (pre-pruning).
- **early_stopping_rounds** — stop adding trees if the validation metric hasn't improved
  for this many rounds; keep the best iteration. The single most important anti-overfit
  setting and how you avoid hand-picking `n_estimators`.
- **objective** — the loss/task: e.g. `reg:squarederror`, `binary:logistic`,
  `multi:softprob`, `rank:pairwise`. Must match your problem.
- **eval_metric** — the metric watched for early stopping/printing; set it to the
  competition metric when possible.
- **scale_pos_weight / class_weight / is_unbalance** — reweight classes for imbalance.
- **monotone_constraints** — force the model to be monotonic in a feature (domain
  knowledge / fairness).
- **DART** — a boosting variant that applies dropout to trees; sometimes helps, slower.
- **cat_features (CatBoost) / categorical_feature (LightGBM)** — tell the library which
  columns are categorical so it handles them natively.

**Feature importance (tree models)** — how much each feature contributed:
- *Gain* — total loss reduction from splits on the feature (usually the most meaningful).
- *Split / frequency* — how often the feature was used (biased toward high-cardinality).
- *Cover* — how many samples the feature's splits touched.
- *Permutation importance* — drop in score when a feature's values are shuffled
  (model-agnostic, more trustworthy).
- *SHAP values* — game-theoretic per-prediction attributions; the gold standard for
  consistent, local + global importance (ch. 11 of LLM track touches interpretability;
  full in ch. 14 here).
- *Null importance* — compare real importance to importance under shuffled targets to
  filter features that look important by chance.

---

## 6. Feature engineering & encoding (where tabular comps are won)

**Feature engineering** — creating new input columns from raw data to expose signal the
model can use. On tabular Kaggle, this is usually the biggest lever, above model choice.

**Categorical encoding** — turning category strings into numbers:
- **One-hot encoding** — one binary column per category. Safe, but explodes with high
  cardinality.
- **Label / ordinal encoding** — map categories to integers. Fine for trees (which split
  on thresholds); misleading for linear models unless the order is real.
- **Frequency / count encoding** — replace a category with how often it appears. Cheap and
  often surprisingly strong.
- **Target / mean encoding** — replace a category with the mean target for that category.
  Powerful but **leak-prone**: must be computed with cross-fold or leave-one-out schemes so
  a row never sees its own target (ch. 10). **K-fold target encoding** and **leave-one-out
  encoding** are the leak-safe variants; **CatBoost ordered target statistics** do this
  automatically.
- **Weight of evidence (WoE)** — log-odds encoding from credit scoring.

**Numeric transforms:**
- **Scaling / standardization** — center to mean 0, scale to std 1 (needed by linear/kNN/
  NN; irrelevant to trees). **Min-max normalization** — rescale to [0,1].
- **Log / power transform (Box-Cox, Yeo-Johnson)** — compress skewed/heavy-tailed features
  toward normality.
- **Binning / discretization** — bucket a continuous feature into ranges.
- **Rank / quantile transform** — replace values by their rank/quantile; robust to outliers
  and scale.

**Constructed features:**
- **Interaction features** — products/ratios/differences of features (capture combined
  effects). **Polynomial features** — powers and cross-terms.
- **Aggregation / groupby features** — stats (mean, std, count, min/max) of one column
  grouped by another (e.g., mean purchase per user). A top source of signal on relational
  tabular data.
- **Datetime features** — year/month/day/weekday/hour, is_weekend, time-since-event.
  **Cyclical encoding** — sin/cos of hour/month so 23:00 and 00:00 are close.
- **Lag / window features** — previous values / rolling stats (time series).

**Missing values:**
- **Imputation** — fill missing with mean/median/mode, a constant, or a model's prediction.
- **Missing indicator** — an extra binary "was missing" column; missingness is often itself
  predictive. (Trees can handle NaN natively in XGBoost/LightGBM.)

**Outliers** — extreme values; handle by **clipping/winsorizing** (cap at percentiles),
transforming, or leaving them (trees are robust).

**Feature selection** — keeping the useful features and dropping noise:
- *Filter* methods — rank by correlation, mutual information, chi-square.
- *Wrapper* methods — **RFE** (recursive feature elimination): repeatedly drop the weakest.
- *Embedded* methods — L1/Lasso zeros features; tree importance ranks them.
- *Permutation importance* and *null importance* (section 5) — robust selection signals.

**Dimensionality reduction** — **PCA** (linear, variance-preserving), **SVD**, **t-SNE**/
**UMAP** (nonlinear, mainly for visualization). Sometimes added as features.

**"Magic feature"** — a single engineered feature that cracks a competition (often a clever
groupby or a discovered structure in ids/time). The thing top solutions hunt for.

**Memory reduction / downcasting** — shrinking dtypes (float64→float32, int64→int8) and
using **Parquet/Feather** or **Polars** to fit big tabular data in RAM/time.

---

## 7. Ensembling

**Ensemble** — combining several models' predictions; a diverse, decent set beats the best
single model because errors partly cancel (ch. 16 of LLM track verified this).

**Blending** — combine model predictions by a simple rule on a holdout: **average**,
**weighted average**, **rank average** (average the ranks — robust to scale/calibration),
**geometric mean**, or **power average**.

**Stacking** — train a **meta-model (meta-learner / level-1 model)** on the base models'
**out-of-fold predictions (level-0)** to learn how to combine them. The most powerful
combiner; leak-safe only with strict OOF discipline. **Multi-level stacking** chains more
layers.

**Voting** — for classification: **hard voting** (majority class) or **soft voting**
(average probabilities then argmax).

**Hill climbing** — greedily add/weight models to maximize the CV metric, one step at a
time. A simple, strong, overfit-resistant blender.

**Seed averaging / bagging seeds** — train the same model with different random seeds and
average; cheap variance reduction. **Snapshot ensembling** — average models saved at
different points of one training run.

**Pseudo-labeling** — predict on test/unlabeled data, add the **confident** predictions as
new training labels, retrain. Can lift scores but is a leakage minefield — keep pseudo-rows
out of validation folds and confirm gains on a clean CV (ch. 17, F15).

**Test-time augmentation (TTA)** — predict on several perturbed versions of each test input
and average; common in vision, occasionally tabular.

**Diversity** — the prerequisite for ensembling to help: members must make *different*
errors (different models, seeds, features, encodings). Identical models don't combine.

---

## 8. Hyperparameter tuning

**Hyperparameter** — a setting you choose, not learned from data (learning rate, depth,
regularization). **Tuning / HPO** — searching for good values.

**Grid search** — try every combination on a grid. Exhaustive but explodes combinatorially.

**Random search** — sample random combinations; usually more efficient than grid for the
same budget.

**Bayesian optimization** — model the score as a function of hyperparameters and propose
promising next trials; sample-efficient. **Optuna** and **Hyperopt** are the standard
libraries; Optuna uses a **TPE** (Tree-structured Parzen Estimator) sampler by default.

**Pruning (in HPO)** — stop unpromising trials early (Optuna pruners, **ASHA/Hyperband**),
saving compute for good ones.

**Learning curve** — score vs training-set size (diagnoses bias/variance, whether more data
would help). **Validation curve** — score vs a single hyperparameter (find its sweet spot).

**Early stopping** — for iterative models, stop when validation stops improving (section 5,
F6). Both a regularizer and a way to avoid tuning `n_estimators` by hand.

---

## 9. Metrics

**Accuracy** — fraction correct. Misleading under class imbalance.

**Precision / recall / F1** — precision = of predicted positives, how many are right;
recall = of actual positives, how many caught; **F1** = their harmonic mean. **Macro-F1**
averages per-class F1 (rare classes weighted equally); **micro-F1** aggregates globally;
**weighted-F1** weights by class frequency (F14).

**Confusion matrix** — the table of true/false positives/negatives that all the above come
from. **Threshold** — the probability cutoff turning a score into a class label; tuning it
optimizes threshold-based metrics (F14).

**ROC-AUC** — area under the ROC curve; probability a random positive outranks a random
negative. Threshold-free, great for ranking quality; can be optimistic under heavy
imbalance. **PR-AUC (average precision)** — area under precision–recall; better than ROC-AUC
when positives are rare.

**Log loss / cross-entropy / binary log loss** — penalizes confident wrong probabilities;
the standard probabilistic classification metric (F3). Needs *calibrated* probabilities.

**Gini coefficient** — $2 \cdot \text{AUC} - 1$; common in insurance/credit competitions.

**RMSE** — root mean squared error (regression); penalizes large errors heavily. **MAE** —
mean absolute error; robust to outliers. **RMSLE** — RMSE on log1p targets; penalizes
under-prediction and relative error (for skewed positive targets). **MAPE** — mean absolute
percentage error. **R²** — fraction of variance explained.

**MCC (Matthews correlation)** — balanced binary metric robust to imbalance. **Cohen's
kappa / quadratic weighted kappa (QWK)** — agreement metrics; QWK is standard for ordinal
targets (e.g., ratings).

**Ranking metrics** — **MAP@k** (mean average precision at k), **NDCG** (normalized
discounted cumulative gain), **MRR** (mean reciprocal rank), **recall@k** — for
recommendation/retrieval/ranking tasks.

**Calibration** — whether predicted probabilities match observed frequencies; fix with
**Platt scaling** or **isotonic regression** (F14). Matters for log loss, thresholds, and
blending.

**Custom metric / metric optimization / post-processing** — implement the exact competition
metric, then optimize *to it*: tune thresholds, rounding, or transform predictions (e.g.,
optimal rounding for QWK, rank-calibration for AUC). Often worth real points (F14).

---

## 10. Workflow & infrastructure

**EDA (exploratory data analysis)** — inspecting distributions, correlations, missingness,
and target relationships before modeling. Where you find leaks, magic features, and the
right CV (ch. 8).

**RAPIDS / cuDF / cuML** — GPU-accelerated dataframe and ML libraries; speed up big tabular
sweeps. **Polars** — a fast multi-threaded dataframe (you use it) — great for large data
and feature engineering.

**Experiment tracking** — logging configs, CV scores, and OOF files per experiment so you
can compare honestly and reproduce (F7). The discipline behind trustworthy iteration.

**Reproducibility** — seed everything, pin versions, save OOF/preds; you must be able to
rebuild your selected submission exactly (F7, F15).

---

*If you hit a term on Kaggle that isn't here, it's almost always a synonym or a
library-specific name for something above (parameters especially vary by library). Map it
back to the concept, and the chapters give you the depth.*
