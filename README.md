# learning-deep

A W3Schools-style site for **machine learning + data science**: read a concept,
read a worked example, then edit and **run real Python in the browser** — backed
by a full local kernel where every import works (numpy → torch → transformers).

The kernel is **stateful per page**. Variables, imports, and trained models from
an earlier example stay alive for the next one, like a notebook. Uses your local
GPU if you have one, or CPU otherwise. When running via Docker the kernel is
isolated from your system Python.

## Interactive features

Two ways to run code on every chapter page, both hitting the same kernel session:

**Try it Yourself blocks** — embedded editors inline with the lesson. Each block
on a page shares one `sessionId` (`course/chapter`), so a later example can use
variables set in an earlier one.

**Right-rail Notebook** — a persistent multi-cell scratchpad in the right column.
Cells, code, and outputs survive page navigation and hard refresh (stored in
`sessionStorage`); closing the tab clears it. On mobile it opens as a sheet via
a floating button.

```
┌──────────────────────────────────────────────────────────────────────┐
│  learning-deep.vercel.app  (or localhost:3000)                       │
│                                                                      │
│  ┌─── chapter body ─────────────────────┐  ┌── right rail ────────┐  │
│  │  explanation                         │  │  Notebook            │  │
│  │  ┌── TryItYourself ───────────────┐  │  │  [cell 1]    Run     │  │
│  │  │  Monaco editor +  Run          │  │  │  [cell 2]    Run     │  │
│  │  └────────────────────────────────┘  │  │  + Cell              │  │
│  │  explanation                         │  └──────────────────────┘  │
│  └──────────────────────────────────────┘                            │
└──────────────────────┬───────────────────────────────────────────────┘
                       │  POST /run  { code, session_id }
                       ▼  (both widgets, same session)
              http://localhost:8000
              ┌──────────────────────────────────┐
              │  FastAPI  +  Jupyter kernel      │
              │  full ML/DS environment          │
              │  numpy · pandas · sklearn        │
              │  xgboost · lightgbm · catboost   │
              │  torch · transformers            │
              └──────────────────────────────────┘
```

## Courses

20-course curriculum (basic → advanced), plus 3 fast-track courses.
**14 of 20 curriculum courses are live.** Remaining 6 are planned and will be added in PLAN order.

### Full curriculum

| # | Course | Group | Chapters | Status |
|---|--------|-------|----------|--------|
| 1 | Python for Data Work | Foundations | 13 | ✅ Live |
| 2 | Math & Optimization | Foundations | 13 | ✅ Live |
| 3 | Probability & Statistics | Foundations | 17 | ✅ Live |
| 4 | Data Wrangling & EDA | Foundations | 15 | ✅ Live |
| 5 | Classical ML | Core ML | 17 | ✅ Live |
| 6 | Time Series Forecasting | Core ML | 13 | ✅ Live |
| 7 | Deep Learning Foundations | Deep Learning | 14 | ✅ Live |
| 8 | CNNs & Computer Vision | Deep Learning | 13 | ✅ Live |
| 9 | Sequences & Transformers | Deep Learning | 13 | ✅ Live |
| 10 | Generative Models | Deep Learning | 12 | ✅ Live |
| 11 | Modern Architectures | Deep Learning | 13 | ✅ Live |
| 12 | NLP & LLMs | Deep Learning | 16 | ✅ Live |
| 13 | Reinforcement Learning | Specialized | 14 | ✅ Live |
| 14 | Graph ML | Specialized | 12 | ✅ Live |
| 15 | Recommender Systems | Specialized | — | ⏳ Planned |
| 16 | Bayesian & Probabilistic ML | Specialized | — | ⏳ Planned |
| 17 | Evaluation, Tuning & Interpretability | Applied / Prod | — | ⏳ Planned |
| 18 | Applied / Competition ML | Applied / Prod | — | ⏳ Planned |
| 19 | System Design & Architecture | Applied / Prod | — | ⏳ Planned |
| 20 | MLOps & Productionization | Applied / Prod | — | ⏳ Planned |

### Fast-track courses ✦

Pre-existing focused courses that run alongside the curriculum.

| Course | Chapters |
|--------|----------|
| Foundations for LLM ✦ | 15 |
| Bengali LLM ✦ | 18 |
| Tabular Kaggle ✦ | 19 |

## Quickstart — recommended path

**Step 0 — prerequisites:**

Clone the repo:
```bash
git clone https://github.com/Shafin2954/learning-deep.git
cd learning-deep
```

**Step 1 — start the backend (pick one):**

Docker (isolated, recommended):
```bash
docker compose up --build        # runner on http://localhost:8000
```

Bare metal (direct GPU access, no Docker needed):
```bash
python -m venv .venv && source .venv/bin/activate   # Win: .venv\Scripts\activate
pip install -U pip
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121   # GPU
pip install -r environment/requirements.txt
pip install -r code-runner/requirements.txt
cd code-runner
uvicorn server:app --host 0.0.0.0 --port 8000
```

Confirm it's up: `curl http://localhost:8000/health` → `{"ok":true,...}`

**Step 2 — open the frontend (pick one):**

Use the deployed site — no npm, no build:
```
https://learning-deep.vercel.app
```
The Vercel frontend is already configured to call `http://localhost:8000` on your
machine. Start the backend above, open the URL, and every Run button works.

Or run the frontend locally:
```bash
cd web
npm install
npm run dev        # http://localhost:3000
```

## How the kernel session works

Both the TryItYourself blocks and the Notebook rail call the same backend session,
keyed to `course/chapter` (e.g. `foundations-for-llm/f02-mlp-backprop`).
This means:

- Run a cell in the Notebook → variable is available in a TryItYourself block
  on the same page, and vice versa.
- Navigate to a different chapter → a fresh session; the previous page's kernel
  state is gone (but the Notebook's *cell text* persists in `sessionStorage`).
- "Reset kernel" in either widget → clears the kernel state for that session.

## Repo layout

```
learning-deep/
├── code-runner/
│   ├── kernel_exec.py      # stateful kernel pool, normalises outputs
│   ├── server.py           # FastAPI: /run /reset /health + CORS
│   ├── requirements.txt
│   └── Dockerfile
├── environment/
│   └── requirements.txt    # full ML/DS stack the kernel imports
├── web/
│   ├── app/                # Next.js app router
│   ├── components/
│   │   ├── TryItYourself.tsx   # inline editor widget
│   │   ├── NotebookPanel.tsx   # right-rail multi-cell notebook
│   │   ├── NotebookStore.tsx   # sessionStorage persistence
│   │   ├── NotebookMonaco.tsx  # lazy-loaded Monaco for notebook cells
│   │   └── OutputBlock.tsx     # renders stdout/html/image/error outputs
│   └── lib/
│       └── runner.ts           # typed API client (runCode / resetSession)
├── courses/
│   ├── foundations-for-llm/   # fast-track ✦ (frozen)
│   ├── bengali-llm/           # fast-track ✦ (frozen)
│   ├── tabular-kaggle/        # fast-track ✦ (frozen)
│   ├── python-for-data-work/  # curriculum courses 1-14 (live)
│   ├── math-optimization/
│   ├── probability-statistics/
│   ├── data-wrangling-eda/
│   ├── classical-ml/
│   ├── time-series-forecasting/
│   ├── deep-learning-foundations/
│   ├── cnns-computer-vision/
│   ├── sequence-transformers/
│   ├── generative-models/
│   ├── modern-architectures/
│   ├── nlp-llms/
│   ├── reinforcement-learning/
│   └── graph-ml/
├── docker-compose.yml
└── docs/PLAN.md            # full 20-course curriculum + syllabi
```

## API

| Method | Path      | Body                           | Returns               |
|--------|-----------|--------------------------------|-----------------------|
| POST   | `/run`    | `{code, session_id, timeout?}` | `{status, outputs[]}` |
| POST   | `/reset`  | `{session_id}`                 | `{ok: true}`          |
| GET    | `/health` | —                              | `{ok, sessions}`      |

`outputs[]` items: `stdout` / `stderr` / `text` / `html` (DataFrames) /
`image` (plots, base64 PNG) / `error` (ename, evalue, traceback).

## CORS / Vercel + local kernel

The backend allows requests from both local dev and the Vercel deployment by
default (`RUNNER_CORS_ORIGINS`). No configuration needed: start the backend,
open `learning-deep.vercel.app`, run code.

If you fork and deploy to a different Vercel URL, override the env var:
```bash
# docker-compose.yml environment section, or shell export before uvicorn:
RUNNER_CORS_ORIGINS="http://localhost:3000,https://your-app.vercel.app"
```

Chrome's Private Network Access policy (HTTPS page → HTTP localhost) is handled
by the `allow_private_network` middleware in `server.py`.

## Security

The runner executes arbitrary Python — it is built for **your local machine,
single user**. Do not expose port 8000 to the internet. For hosted / multi-user
deployment, run each kernel in a locked-down container (mem/cpu/pid limits, no
network, read-only FS) — flags are stubbed in `docker-compose.yml`.

---

14 of 20 curriculum courses live. Remaining 6 (Recommender Systems, Bayesian ML,
Eval/Tuning, Competition ML, System Design, MLOps) in progress per PLAN.md order.
Course contents curated by Claude.
