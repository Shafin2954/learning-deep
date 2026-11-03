# Recommender Systems

Course 15 of 20. How to decide what each user sees next — built from first principles and measured
honestly. Every model in the course is implemented from scratch on synthetic logs with real structure
(drifting tastes, popularity long tails, exposure bias), evaluated under temporal splits with
full-catalogue ranking metrics, and compared against baselines that are deliberately hard to beat.

## Chapters

1. The recommendation problem: explicit versus implicit
2. Evaluation: NDCG, MAP, recall@k, temporal splits
3. Neighborhood collaborative filtering
4. Matrix factorization: SVD and ALS
5. Implicit feedback: BPR and weighted ALS
6. Factorization machines
7. Neural CF and two-tower retrieval
8. Sequential and session-based recommendation
9. Content-based and hybrid recommenders; cold start
10. Candidate generation and ranking: the two-stage stack
11. Bandits and online learning for recommendation (+ Under the Trench)
12. Capstone: a recommender stack, from scratch

## What each chapter builds

| Chapter | You build |
|---|---|
| 1 | a sparse interaction matrix, a long-tail analysis, and the popularity baseline that beats most first attempts |
| 2 | recall@k, precision@k, MAP and NDCG from their definitions; coverage/novelty/diversity; a sampled-vs-full metric comparison; temporal split schemes |
| 3 | item-item and user-user CF with shrinkage, popularity correction, and TF-IDF/BM25 weighting |
| 4 | biased baselines, SGD matrix factorisation, truncated SVD (and why it differs), and ALS with a rank/regularisation sweep |
| 5 | weighted ALS (iALS) with the confidence trick, BPR with pluggable negative samplers, and a head-to-head |
| 6 | a factorisation machine with the $O(kn)$ identity, proof that user+item FM is MF, and generalisation to unseen pairs |
| 7 | NCF vs dot product, a two-tower model with in-batch softmax and the logQ correction, and the serving-cost argument |
| 8 | an order-aware sequence generator, Markov and gap-2 rule baselines, session-kNN, GRU4Rec with four losses, SASRec, and an honest comparison where the count table wins |
| 9 | an entity-held-out cold-start protocol, a TF-IDF content recommender, Burke hybrids, attribute-to-factor mapping, a LightFM-style model with DropoutNet, and onboarding question selection |
| 10 | a latency-budget funnel, merged candidate sources, a numpy IVF ANN index, a leak-free ranker table, pointwise/RankNet/LambdaRank/listwise rankers, and MMR re-ranking |
| 11 | a feedback-loop collapse simulation, LinUCB and linear Thompson sampling, and replay/IPS/SNIPS/doubly-robust off-policy evaluation |

## How to study this course

Read the numbers first. Most chapters end with a table, and several of those tables contradict the
folklore: the neural retrieval model does not automatically beat implicit ALS, a two-step count
table beats GRU4Rec and SASRec on next-item prediction, sampled metrics reorder models, and a ranker
trained on leaky features looks brilliant offline and loses online. Predict the explanation before
you read it.

Three habits the course is built around:

- **Time is the split.** Recommendation is forecasting. Any split that lets a model train on the
  future of the users it is tested on will flatter it.
- **Rank against the whole catalogue.** Sampled-negative metrics are cheap, and they change which
  model you would ship.
- **Baselines before models.** Popularity, recent popularity and item-item CF are reported first in
  every comparison; complexity has to earn its place against them.

Prerequisites: Math & Optimization (matrix factorisation, gradients), Probability & Statistics,
and the basics of PyTorch from DL Foundations. Chapter 11 builds on Reinforcement Learning ch. 2
(bandits).
