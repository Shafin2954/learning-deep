# Data Wrangling & EDA

The craft of turning raw, messy data into analysis-ready features with a validation strategy
that actually reflects your holdout. This course is the prerequisite for every modelling
course: the best model on a leaky pipeline is worse than a logistic regression on clean data.

Pitched at: knows Python for Data Work (ch. 1–12), understands basic probability and
distributions. No prior sklearn experience required.

**In plain words:** this course teaches you to get a raw data file into a state a model can
trust, and to prove the model's score is honest. Chapters 1–5 cover understanding what each
column is, loading files without silent errors, reshaping tables into a tidy layout, and
dealing with blanks and extreme values. Chapters 6–7 are about exploring: looking at each
column, then at pairs of columns, and measuring how strongly they are linked. Chapters 8–11
turn raw columns into good features — transforms, encodings for categories, time and text
features, and scaling. Chapters 12–14 are the most important part: how information leaks
from the answer into the model, how to choose a validation split that copies real use, and
how scikit-learn Pipelines make the leak-free way automatic; the capstone (ch. 15) puts it
all together on one messy dataset.

---

## Chapters

**Part 1 — Understanding data**
1. Data types & measurement scales ●
2. Loading messy data: encodings, dtypes, bad rows ●
3. Tidy data & reshaping for analysis ●
4. Missing data: MCAR/MAR/MNAR & imputation ●
5. Outliers: detection & treatment ●

**Part 2 — Exploration**
6. EDA workflow: distributions, relationships, contingency tables ●
7. Correlation: Pearson vs Spearman vs mutual information ●

**Part 3 — Feature engineering**
8. Numeric features: binning, log/power transforms, interactions ●
9. Categorical features: one-hot, ordinal, target encoding ●
10. Datetime, text, and cyclical features ●
11. Scaling & transforms: standard, power, quantile ●

**Part 4 — Validation (the hardest part)**
12. Data leakage — every flavor and how to kill it ●
13. Validation strategy that matches your test set ●
14. sklearn Pipelines & ColumnTransformer (leak-proof) ●

**Capstone**
15. Leak-proof pipeline on real messy data

`●` = ships runnable code.

---

## Study notes

- Ch. 12 (leakage) is the most important chapter in this course. Read it twice.
- Ch. 4 and 11 are complementary: missing data handling and scaling must both happen
  *inside* the CV fold, which ch. 14 shows you how to enforce mechanically.
- Ch. 13 gives you the vocabulary to describe your CV scheme to a reviewer or team.
- The capstone is the only honest proof that you've closed every leakage path.

## Prerequisites

- Python for Data Work (this site, ch. 1–12): pandas, NumPy, groupby, reshaping.
- Basic probability: distributions, what a median is, what variance means.
- No sklearn knowledge required — it is introduced from scratch in ch. 11–14.

## Reference anchors

ISLR §2 (statistical learning setup), pandas docs (missing data, dtypes), sklearn docs
(preprocessing, pipeline, model selection), and Wickham's "Tidy Data" (2014) for ch. 3.
All content here is written in our own words, pitched at your level.
