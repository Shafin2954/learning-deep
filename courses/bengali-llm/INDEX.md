# Bengali LLM Competition — Mastery Track

A depth-first track for the July 25 Bengali-LLM Kaggle competition. Built to cover
every likely task (QA, classification, NER, translation, summarization, reasoning,
RAG), anchored on the Bengali-specific foundations that decide your score.

**The one thing to confirm:** the exact task and metric. The announcement reads
open-ended ("real-world language technology problems"). When you know the task,
deepen the matching chapters (7, 11–16). Everything in Parts 1–2 you need regardless.

---

## Chapters

**Part 1 — Bengali language & NLP foundations (where most people lose points)**
1. The Bengali script & Unicode — graphemes, conjuncts, matras, ZWNJ/ZWJ ●
2. Text normalization & cleaning — the csebuetnlp normalizer, code-mixing ●
3. Tokenization for Bengali — fertility, SentencePiece, why English BPE fails ●

**Part 2 — Models & embeddings**
4. The Bengali model landscape — BanglaBERT, BanglaT5, TituLM, TigerLLM, multilingual
5. Bengali embeddings & semantic similarity ●

**Part 3 — Transformer & task core**
6. Transformer recap for fine-tuners (what actually matters)
7. Task heads — classification, NER, extractive QA, seq2seq, causal generation ●

**Part 4 — Fine-tuning on real hardware (your 8GB RTX 3070 Ti)**
8. Fine-tune vs prompt vs RAG — choosing the cheapest thing that wins
9. QLoRA in practice on 8GB — bitsandbytes 4-bit, Unsloth, gradient checkpointing ●
10. Data for fine-tuning — curating/augmenting Bengali instruction & QA data ●

**Part 5 — Prompting, RAG, inference**
11. Prompting Bengali LLMs — instruction format, English-pivot, structured output ●
12. RAG for Bengali — chunking, multilingual embeddings, hybrid + rerank ●
13. Inference under Kaggle limits — 4-bit, vLLM, batching, no-internet submission

**Part 6 — Evaluation & competition craft**
14. Evaluation metrics by task — F1/EM, BLEU/chrF/ROUGE/BERTScore, Bengali pitfalls ●
15. CV strategy for NLP/LLM comps — leakage, adversarial validation for text ●
16. Ensembling LLMs — blending, self-consistency, multi-prompt/model ●
17. The 1-month plan — baseline → iterate → ensemble → submit

**Capstone — full Bengali LLM pipeline for the competition** (end of track).

`●` = chapter ships runnable code you can study and edit.

---

## The 1-month sprint plan (today → July 25)

**Week 1 — Foundations + baseline.** Read ch. 1–5. Set up the environment. Get the
data, run ch. 14–15 first to lock a *trustworthy* CV and the exact metric. Build a
dumb baseline (a multilingual model zero-shot, or TF-IDF + linear for classification)
and submit it day 2–3. A submitted baseline beats a perfect plan.

**Week 2 — The right approach.** Decide fine-tune vs prompt vs RAG (ch. 8). If
fine-tuning: ch. 9–10, get QLoRA training on your 8GB card. If generation/QA: ch.
11–12. Iterate to beat the baseline meaningfully.

**Week 3 — Depth + data.** Improve the data (ch. 10): augmentation, cleaning,
English-pivot tricks (ch. 11). Tune (ch. 9). Add RAG if it helps (ch. 12). Watch
the CV, not the public LB.

**Week 4 — Ensemble + harden.** Ensembling (ch. 16), inference optimization for the
submission environment (ch. 13), reproducibility and submission hygiene. Freeze
early; leave 3 days for submission-environment bugs (no-internet, time limits).

Rule: never let the public leaderboard override a CV you trust (ch. 15).

---

## Environment additions (for the Try-it runner + your local env)

Add to the runner's `environment/requirements.txt`:

```
# Bengali NLP
normalizer                 # csebuetnlp text normalizer (pip install git+https://github.com/csebuetnlp/normalizer)
bnlp_toolkit               # tokenizers, embeddings, NER for Bengali
sentencepiece              # subword tokenization
sacremoses
regex                      # grapheme-aware \X matching (NOT the stdlib re)
# Modeling / fine-tuning
transformers
datasets
tokenizers
accelerate
peft                       # LoRA / QLoRA adapters
bitsandbytes               # 4-bit quantization (GPU)
evaluate
sacrebleu                  # BLEU / chrF
rouge-score
bert-score
sentence-transformers
faiss-cpu                  # vector search for RAG
rank-bm25                  # lexical retrieval for hybrid RAG
```

Light chapters (1–3, 14) run on CPU in the Try-it box. Fine-tuning chapters (9–10)
need your GPU or a Kaggle/Colab notebook — they're marked "run locally."
