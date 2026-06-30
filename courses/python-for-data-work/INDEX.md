# Python for Data Work

Arrays, dataframes, speed, idioms — not syntax. This course assumes you know Python;
it builds the specific muscle memory for data work: vectorized thinking, shape fluency,
performance instincts, and the tools you reach for every day. No beginner filler.

Pitched at: strong Python, wants to stop writing loops, wants to know *why* NumPy is fast.

---

## Chapters

**Part 1 — NumPy (the core)**
1. NumPy arrays, dtypes, and memory layout ●
2. Vectorization & broadcasting — why loops are slow ●
3. Fancy indexing, boolean masks, `where`, `einsum` ●

**Part 2 — pandas**
4. The pandas data model: Index, Series, DataFrame
5. Selection: `loc` / `iloc` / boolean / `query`
6. GroupBy: split-apply-combine ●
7. Merge, join, concat; reshaping (pivot/melt/stack)
8. MultiIndex & hierarchical data
9. Datetime & resampling in pandas

**Part 3 — Beyond pandas**
10. polars: lazy frames, when to switch ●
11. Performance: dtypes, categoricals, `numexpr`, vectorize vs apply ●
12. Plotting anatomy: matplotlib → seaborn → plotly ●

**Part 4 — Under the Trench + Capstone**
(Rare/advanced topics are in ch. 12's "Under the Trench" section.)
13. Capstone: Mini analytical engine (NumPy only)

`●` = ships runnable code.

---

## Study notes

- Ch. 1–3 are load-bearing for everything downstream (DL, Kaggle, feature engineering).
  Spend extra time here — shape errors are the most common bug in ML code.
- Ch. 4–9 cover the pandas you'll actually use. Read 4–5 once carefully; 6–9 can be
  skimmed and returned to when you need them.
- Ch. 10–11 are for when pandas becomes a bottleneck. Don't skip ch. 11 — it explains
  *why* things are slow, which matters more than any single API.
- The capstone (ch. 13) is the proof of ownership: implement a columnar table from
  scratch using only NumPy. No pandas groupby, no pandas merge.

## Environment / requirements

The kernel has: `numpy`, `pandas`, `polars`, `matplotlib`, `seaborn`, `plotly`, `numexpr`.
Everything runs in the code-runner; no local install needed beyond `docker compose up`.

## Reference anchors

NumPy docs, pandas docs, polars docs, Jake VanderPlas's *Python Data Science Handbook*
(ch. 2–3 for NumPy/pandas mental model). Nothing in these chapters is restated from those
— content here is the *why* and the *when*, not the API list.
