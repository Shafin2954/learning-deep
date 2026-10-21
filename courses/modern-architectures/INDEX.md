# Modern and Alternative Architectures

Course 11 of 20. Current (2026). The move beyond vanilla attention — SSMs, Mamba, MoE, LNNs, KANs, and hybrid architectures.

**In plain words:** standard attention compares every token with every other one, so its cost and memory grow with the square of the text length, and this course is about the designs that avoid that bill. Chapter 1 measures the problem (score tables, the KV cache, memory bandwidth), and chapters 2–5 show the recurrent alternatives that keep a fixed-size memory instead: linear attention, state space models (S4), Mamba's selective scan, and RWKV, RetNet and Hyena. Chapters 6–7 switch to a different cost, the feed-forward layer, and show how Mixture-of-Experts stores many experts but runs only a few per token, and how to keep them evenly loaded. Chapter 8 combines the ideas into hybrids such as Jamba and Samba, and chapters 9–10 cover two outsiders, liquid networks and Kolmogorov-Arnold networks. Chapters 11–12 teach you to move knowledge from a Transformer into a cheaper model and to read architecture papers critically, and the capstone (ch. 13) has you build one alternative yourself and benchmark it honestly against attention.

## Chapters
1. The efficiency problem: O(n²) and KV-cache cost
2. Linear and kernelized attention
3. State Space Models: S4 to SSD
4. Mamba and Mamba-2: selective state spaces
5. Other recurrents: RWKV, RetNet, Hyena
6. Mixture-of-Experts: routing and sparse compute
7. MoE in practice: load balancing, Mixtral-style
8. Hybrids: Jamba / Samba / Nemotron
9. Liquid Neural Networks (LNNs)
10. Kolmogorov-Arnold Networks (KANs)
11. Cross-architecture distillation
12. Reading architecture papers systematically
13. Capstone: Build and benchmark an attention alternative
