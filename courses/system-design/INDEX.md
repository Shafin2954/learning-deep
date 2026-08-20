# System Design & Architecture

Course 19 of 20. General distributed systems, the data layer (DDIA-grounded), scale and
reliability patterns, ML systems design, and six worked case studies. Concept, diagram, runnable
Python demo, and a paper design exercise per topic.

## Chapters

**Fundamentals**
1. How to approach a design: requirements, API, data, scale
2. Back-of-envelope estimation and latency numbers

**Building blocks**
3. Clients, servers, proxies, and load balancers
4. Load balancing and consistent hashing
5. Caching: where, what, and eviction policies (LRU/LFU from scratch)
6. Cache invalidation and stampede protection
7. Bloom filters: membership without storing the set
8. Message queues, pub/sub, and event-driven design
9. CDNs and object storage

**Data layer (DDIA)**
10. SQL vs NoSQL: picking a store by access pattern
11. Storage engines: B-tree vs LSM-tree
12. Indexing and query plans: why your query is slow
13. Replication: leaders, followers, and quorums
14. Partitioning and sharding
15. Transactions: ACID, isolation levels, and serializability
16. CAP, linearizability, and causal consistency
17. Consensus: Raft and Paxos, the idea
18. Batch processing, stream processing, and CDC

**Scale & reliability**
19. Stateless services and horizontal scaling
20. Rate limiting: token bucket and leaky bucket
21. Idempotency, retries, and backoff with jitter
22. Circuit breakers, bulkheads, and backpressure
23. Observability: logs, metrics, traces, and SLOs

**ML systems design**
24. Training vs serving: batch and online inference
25. Feature stores and training/serving skew
26. Model registry, versioning, and safe rollout
27. RAG system architecture, end to end
28. Data and feature pipelines: orchestration in practice
29. Production monitoring: drift, feedback loops, and decay

**Case studies and capstone**
30. Case studies: six designs end to end (+ Under the Trench)
31. Capstone: a sharded, cached, rate-limited service

## How to study this course

Every chapter is runnable. The demos are deliberately small — a consistent-hash ring in 30 lines,
an LSM-tree in 40 — because the point is the *shape* of the trade-off, not a production
implementation. Read the code, change one parameter, and watch which number moves.

Three habits to carry through:

- **Numbers before boxes.** Every architectural decision in this course cites the number that
  forced it. If you cannot name the number, you are drawing, not designing.
- **Name the failure mode.** For every component you add, answer "what happens when this is down,
  slow, or lying?" before moving on.
- **Say what you are not building.** Ch. 1 and ch. 30 both end there, and it is the hardest habit.

## What each demo builds

| Chapter | You build |
|---|---|
| 4 | consistent-hash ring with virtual nodes; rendezvous hashing |
| 5 | LRU and LFU in $O(1)$; TinyLFU admission control |
| 6 | single-flight, stale-while-revalidate, XFetch early expiry |
| 7 | Bloom filter, counting Bloom filter, scalable Bloom filter |
| 8 | partitioned log with consumer groups; outbox pattern; DLQ |
| 11 | mini LSM-tree with leveled compaction; write-amplification measurement |
| 12 | real query plans on SQLite: index, covering index, sargability |
| 13 | quorum overlap, fencing tokens, version vectors |
| 14 | fixed-partition rebalancing, dynamic splitting, scatter-gather tails |
| 15 | MVCC store showing dirty reads, lost updates, write skew, SSI, 2PL |
| 16 | linearizability checker; causal delivery; CAP under partition |
| 17 | Raft leader election, log replication, log repair, safety check |
| 18 | MapReduce, event-time windows with watermarks, CDC and log compaction |
| 20 | token bucket, leaky bucket, sliding window counter, hierarchical limiter |
| 21 | idempotency keys, full-jitter backoff, retry budgets, deadlines |
| 22 | circuit breaker, bulkheads, bounded queues, priority shedding |
| 23 | RED/USE metrics, percentile pitfalls, burn-rate alerting |
| 25 | a small feature store with as-of joins and a parity test |
| 27 | BM25 + dense retrieval, reciprocal rank fusion, RAG evaluation |
| 29 | PSI and KS drift detection, feedback-loop simulation, IPS estimation |

## Prerequisites

None from this course's own group. Ch. 24–29 are easier if you have met a model before
(Classical ML, or any of the deep learning courses), but every ML idea used here is explained
in place. Ch. 12 assumes you can read SQL. Ch. 27 pairs with NLP & LLMs (RAG) and ch. 24 with
Recommender Systems (two-stage ranking).

## Reference

Designing Data-Intensive Applications (Kleppmann) for chapters 10–18; the Google SRE book for
19–23; Designing Machine Learning Systems (Huyen) for 24–29.
