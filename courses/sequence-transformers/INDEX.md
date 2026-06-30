# Sequence Models, Attention & Transformers

From recurrent networks to the full transformer — every mechanism derived, then built.

**Prerequisites:** DL Foundations (ch. 1–12: autograd, PyTorch training loop, backprop). Basic Python/NumPy fluency.

---

## Part 1 — Recurrent Models

| # | Chapter | Topics |
|---|---------|--------|
| 1 | Sequence Problems & Tokenization | tasks, padding, masking, character/word/BPE |
| 2 | RNNs & BPTT | RNN cell, vanishing gradient, backprop through time |
| 3 | LSTM & GRU | gates, cell-state highway, gradient flow |
| 4 | Bidirectional & Deep RNNs | bidir for encoding, stacking, dropout |
| 5 | Seq2seq & Encoder–Decoder | context vector, teacher forcing, BLEU |

## Part 2 — Attention

| # | Chapter | Topics |
|---|---------|--------|
| 6 | Attention from Scratch | Bahdanau, Luong, attention heatmap |
| 7 | Self-Attention & Multi-Head | scaled dot-product, heads, causal mask |
| 8 | Positional Encoding | sinusoidal, learned, RoPE |

## Part 3 — The Full Transformer

| # | Chapter | Topics |
|---|---------|--------|
| 9 | Transformer Block | pre-norm, FFN, encoder/decoder stacks |
| 10 | Training Transformers | warmup, label smoothing, masking, clipping |

## Part 4 — Decoding & Architectures

| # | Chapter | Topics |
|---|---------|--------|
| 11 | Decoding & KV Cache | greedy, beam, top-p, KV cache speedup |
| 12 | BERT vs GPT vs T5 | enc-only, dec-only, enc-dec, when to use each |
| 13 | Capstone | Transformer from scratch, trained + KV cache |

---

## Study Notes

- Ch. 7 is the pivot: once you can implement scaled dot-product attention, the rest of the transformer is just stacking it.
- The KV cache (ch. 11) is the key to understanding why inference is cheaper than training.
- For ch. 3–5, use a CPU/small GPU — the toy tasks fit easily.

## Environment

```
torch>=2.0    numpy    matplotlib
```

No Hugging Face transformers required until the NLP & LLMs course.
