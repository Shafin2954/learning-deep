import Link from 'next/link';
import NavBar, { COURSE_GROUPS } from '@/components/NavBar';

/**
 * Full course metadata for the home-page cards.
 * Add an entry here when a course's content is published (alongside courseNames.ts + NavBar).
 * Groups mirror COURSE_GROUPS in NavBar.tsx.
 */
const HOME_COURSES: Record<string, { tagline: string; chapters: number; badge: string }> = {
  // Fast-track courses (existing)
  'foundations-for-llm': {
    tagline: '15 chapters covering the math, code, and intuition behind modern LLMs.',
    chapters: 15,
    badge: 'F1 – F15',
  },
  'bengali-llm': {
    tagline: '18 chapters building a Bengali language model from scratch for Kaggle.',
    chapters: 18,
    badge: 'Ch 1 – 18',
  },
  'tabular-kaggle': {
    tagline: '19 chapters on classical ML, boosting, and competition strategies.',
    chapters: 19,
    badge: 'Ch 1 – 19',
  },

  // Full curriculum courses
  'python-for-data-work': {
    tagline: '13 chapters: NumPy, pandas, polars, vectorization, and plotting — no beginner filler.',
    chapters: 13,
    badge: 'Ch 1 – 13',
  },
  'math-optimization': {
    tagline: '12 chapters: linear algebra, matrix calculus, SVD, PCA, gradient descent, and Adam — all derived.',
    chapters: 13,
    badge: 'Ch 1 – 13',
  },
  'probability-statistics': {
    tagline: '16 chapters: probability theory, MLE/MAP, confidence intervals, hypothesis testing, and Bayesian inference.',
    chapters: 17,
    badge: 'Ch 1 – 17',
  },
  'data-wrangling-eda': {
    tagline: '14 chapters: EDA workflow, missing data, feature engineering, leakage, and leak-proof sklearn Pipelines.',
    chapters: 15,
    badge: 'Ch 1 – 15',
  },
  'classical-ml': {
    tagline: '16 chapters: every algorithm from linear regression through XGBoost, clustering, and UMAP — with math.',
    chapters: 17,
    badge: 'Ch 1 – 17',
  },
  'time-series-forecasting': {
    tagline: '12 chapters: stationarity, ARIMA, backtesting, ML forecasting, GARCH, prediction intervals, deep models.',
    chapters: 13,
    badge: 'Ch 1 – 13',
  },
  'deep-learning-foundations': {
    tagline: '13 chapters: backpropagation, autograd, PyTorch training loop, normalization, regularization, and mixed precision.',
    chapters: 14,
    badge: 'Ch 1 – 14',
  },
  'cnns-computer-vision': {
    tagline: '12 chapters: convolutions, ResNet, transfer learning, detection (IoU/NMS/YOLO), segmentation, ViT, and self-supervised learning.',
    chapters: 13,
    badge: 'Ch 1 – 13',
  },
  'sequence-transformers': {
    tagline: '12 chapters: RNNs, LSTM, attention from scratch, multi-head attention, positional encoding, the full Transformer, and KV cache.',
    chapters: 13,
    badge: 'Ch 1 – 13',
  },
  'generative-models': {
    tagline: '11 chapters: autoencoders, VAEs, GANs, normalizing flows, diffusion (DDPM), latent diffusion, and generative eval (FID).',
    chapters: 12,
    badge: 'Ch 1 – 12',
  },
  'modern-architectures': {
    tagline: '12 chapters: SSMs, Mamba, RWKV, MoE, Mixtral, hybrid architectures, LNNs, KANs, and how to read architecture papers.',
    chapters: 13,
    badge: 'Ch 1 – 13',
  },
  'nlp-llms': {
    tagline: '15 chapters: tokenization, BERT/GPT, fine-tuning, LoRA, RLHF/DPO, RAG, GraphRAG, agentic RAG, and multilingual NLP.',
    chapters: 16,
    badge: 'Ch 1 – 16',
  },
  'reinforcement-learning': {
    tagline: '13 chapters: MDPs, DP, Monte Carlo, TD learning, DQN, policy gradients, PPO, SAC, and model-based RL.',
    chapters: 14,
    badge: 'Ch 1 – 14',
  },
  'graph-ml': {
    tagline: '11 chapters: GCN, GraphSAGE, GAT, link prediction, graph pooling, scaling GNNs, and knowledge-graph embeddings.',
    chapters: 12,
    badge: 'Ch 1 – 12',
  },
};

export default function Home() {
  return (
    <>
      <NavBar />

      <main className="home-main">
        <section className="home-hero">
          <h1 className="hero-title">
            Learn ML by running real Python
          </h1>
          <p className="hero-sub">
            Concepts, worked examples, live kernel. <br />
            Every code block executes on a real kernel — numpy, pandas, torch, transformers, all available.
          </p>
          <br />
          <p>
            Set up locally to run code in your browser. See the{' '}
            <Link href="https://github.com/Shafin2954/learning-deep.git" target="_blank">
              github repository
            </Link>
            . <br />
            20-course curriculum in progress — new courses added in PLAN order.
          </p>
        </section>

        {/* Courses grouped by PLAN.md navigation groups */}
        {COURSE_GROUPS.filter(g => g.courses.length > 0).map(g => {
          const cardsInGroup = g.courses.filter(c => HOME_COURSES[c.id]);
          if (cardsInGroup.length === 0) return null;
          return (
            <section key={g.group} className="home-courses">
              <h2 className="home-section-heading">{g.group}</h2>
              <div className="courses-grid">
                {cardsInGroup.map(c => {
                  const meta = HOME_COURSES[c.id]!;
                  return (
                    <Link key={c.id} href={`/${c.id}`} className="course-card">
                      <div className="course-card-badge">{meta.badge}</div>
                      <h3 className="course-card-title">{c.name}</h3>
                      <p className="course-card-tagline">{meta.tagline}</p>
                      <span className="course-card-cta">Start learning →</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Glossary card — always shown */}
        <section className="home-courses">
          <h2 className="home-section-heading">Reference</h2>
          <div className="courses-grid">
            <Link href="/glossary" className="course-card glossary-card">
              <div className="course-card-badge">Reference</div>
              <h3 className="course-card-title">Kaggle Glossary</h3>
              <p className="course-card-tagline">
                Every term you&apos;ll meet on Kaggle, defined in depth. Searchable.
              </p>
              <span className="course-card-cta">Browse glossary →</span>
            </Link>
          </div>
        </section>

        <section className="home-features">
          <div className="feature-grid">
            <div className="feature-item">
              <span className="feature-icon">▶</span>
              <h3>Real kernel</h3>
              <p>Code runs on a local Jupyter kernel — not a sandbox. Import anything.</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📓</span>
              <h3>Stateful per page</h3>
              <p>Variables from an earlier example stay alive for the next one, like a notebook.</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔡</span>
              <h3>Bengali support</h3>
              <p>Bengali script renders correctly throughout — tokenization examples included.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
