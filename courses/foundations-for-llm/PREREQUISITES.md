# Foundations for the Bengali LLM Track — Prerequisite Path

**Read this before (or alongside) the Bengali-LLM chapters.** The Bengali chapters
assume you already own the deep-learning core. This track builds that core, drawn
from PLAN.md (courses 2, 3, 7, 9, 12, 17, 18) but trimmed to exactly what an LLM
competitor needs. Your stats/tabular base is already strong — this is the
deep-learning spine, which is the real depth upgrade for you.

Order matters: each chapter is a prerequisite for the next. Build bottom-up.

| #  | Chapter | Why it matters for the competition | Feeds |
|----|---------|-----------------------------------|-------|
| F1 | The math of a neural layer (matmul, softmax, cross-entropy, log-sum-exp) | An LLM's output layer and loss *are* this. Attention is matmuls. | everything |
| F2 | Neuron → MLP → backprop from scratch | Every model is this substrate. Understand gradients flowing. | F3, transformers |
| F3 | Loss & the MLE view; why cross-entropy = next-token loss | The LM objective and perplexity come from here. | F8, eval |
| F4 | Optimizers: SGD → momentum → Adam; LR schedules & warmup | These are your fine-tuning knobs. Warmup isn't optional for transformers. | fine-tuning |
| F5 | Initialization & normalization (LayerNorm/RMSNorm) | Transformers don't train without them. LayerNorm is in every block. | transformers |
| F6 | Regularization: dropout, weight decay, early stopping | Bengali data is small → overfitting is your main enemy. | fine-tuning |
| F7 | The training loop, batching, mixed precision, debugging NaNs | Actually running a fine-tune on 8GB without crashing. | fine-tuning |
| F8 | Embeddings: one-hot → dense → contextual | The bridge from tokens to vectors; the input to every LLM. | RAG, attention |
| F9 | RNNs & the long-dependency problem → why attention exists | Motivation. Why we left recurrence behind. | F10 |
| F10| Self-attention from scratch; multi-head; Q/K/V | The single most important mechanism in the whole field. | F11 |
| F11| Positional encoding (sinusoidal, learned, RoPE) | Attention is order-blind without it. RoPE is in modern LLMs. | F12 |
| F12| The Transformer block (full); encoder vs decoder; KV cache | The architecture you'll fine-tune. Decoding for generation. | Bengali ch. 6–7 |
| F13| The language-model objective & perplexity | What pretraining optimizes; how LMs are scored. | Bengali ch. 14 |
| F14| Metrics, cross-validation, calibration | Trustworthy evaluation. | Bengali ch. 14–15 |
| F15| Data leakage & validation strategy | The discipline that wins competitions. | Bengali ch. 15 |

**Where these connect to the Bengali track:**
- F1–F3 + F13 → make Bengali ch. 14 (evaluation) and the LM objective obvious.
- F4–F7 → make Bengali ch. 8–10 (fine-tuning, QLoRA) make sense, not magic.
- F8 → underpins Bengali ch. 5 (embeddings) and ch. 12 (RAG).
- F9–F12 → are the general version of Bengali ch. 6–7; once you've built a
  transformer from scratch, fine-tuning one is just configuration.
- F14–F15 → are the general discipline behind Bengali ch. 15–16.

**How to use your month:** if you're tight on time, the minimum viable spine is
**F1, F2, F4, F8, F10, F12, F14, F15** — that's enough to fine-tune competently and
evaluate honestly. Do the rest to actually go deep (your stated goal).

Each chapter: Concept → Example → Try it Yourself → Exercise. Code is verified on
CPU with NumPy/PyTorch where it runs; heavy bits are marked "run locally."

Build order for me to write: F1–F2 (this batch), then F3–F7, then F8–F12, then
F13–F15. Say **continue** between batches.
