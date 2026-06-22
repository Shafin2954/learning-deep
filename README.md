# Learning-Deep

A W3Schools-style site for **machine learning + data science**: read a concept,
read a worked example, then edit and **run real Python in the browser** — backed
by a full local kernel where every import works (numpy → torch → transformers).

Better than W3Schools for ML in one way: the kernel is **stateful per page**.
Variables, imports, and trained models from an earlier example stay alive for the
next one, like a notebook. Uses your local GPU if you have one, or CPU otherwise. The kernel is **isolated** from your system Python when running via Docker, so you can install whatever packages you want without breaking anything.

Each chapter page also has a **right-rail Notebook** — a multi-cell scratchpad that shares the
same kernel session as the page. Its cells, code, and outputs persist across navigation and
hard refreshes (stored in `sessionStorage`), so switching chapters and coming back leaves
everything intact. Closing the browser tab clears it.

```
┌────────────────────┐   POST /run {code, session_id}   ┌──────────────────────┐
│  Next.js web app   │ ───────────────────────────────► │   code-runner (API)  │
│  TryItYourself.tsx │ ◄─────────────────────────────── │  FastAPI + Jupyter   │
│  (Monaco editor)   │   {status, outputs[]}            │  one kernel/session  │
└────────────────────┘                                  └──────────┬───────────┘
                                                                   │ 
                                                    imports full DS/ML environment
                                                  (numpy, pandas, sklearn, xgboost,
                                                     lightgbm, catboost, torch,
                                                          transformers, …)
```

## Layout

```
learning-deep/
├── code-runner/            # the execution backend (tested, working)
│   ├── kernel_exec.py      # stateful kernel pool, normalizes outputs
│   ├── server.py           # FastAPI: /run /reset /health
│   ├── requirements.txt    # runner deps
│   └── Dockerfile
├── environment/
│   └── requirements.txt    # THE full ML/DS stack the kernel imports from
├── web/
│   ├── components/TryItYourself.tsx   # editor + run + rich output
│   └── lib/runner.ts                  # typed API client
├── docker-compose.yml
└── docs/
    └── PLAN.md             # curriculum + courses + per-course sidebar TOC
```

## Run it (local, fastest path)

**1. Backend — pick ONE:**

Docker (everything baked in):
```bash
cd learning-deep
docker compose up --build        # runner on http://localhost:8000
```

Or bare metal (uses your machine's GPU directly):
```bash
cd learning-deep
python -m venv .venv && source .venv/bin/activate   # Win: .venv\Scripts\activate
pip install -U pip
# GPU first:
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
pip install -r environment/requirements.txt
pip install -r code-runner/requirements.txt
cd code-runner
uvicorn server:app --host 0.0.0.0 --port 8000
```

Check it: `curl http://localhost:8000/health` → `{"ok":true,...}`

**2. Frontend — pick ONE:**

Use the deployed site (no npm needed):
```
https://learning-deep.vercel.app
```
The site automatically points Try-it blocks at `http://localhost:8000` on your machine —
so just start the kernel above, open the URL, and code runs locally.

Or run the frontend yourself:
```bash
cd web        # your Next.js app (app router)
npm run dev   # http://localhost:3000
```

## API

| Method | Path      | Body                                  | Returns                  |
|--------|-----------|---------------------------------------|--------------------------|
| POST   | `/run`    | `{code, session_id, timeout?}`        | `{status, outputs[]}`    |
| POST   | `/reset`  | `{session_id}`                        | `{ok: true}`             |
| GET    | `/health` | —                                     | `{ok, sessions}`         |

`outputs[]` items: `stdout` / `stderr` / `text` / `html` (DataFrames) /
`image` (plots, base64 PNG) / `error` (ename, evalue, traceback).

## Security

The runner executes arbitrary Python. It is built for **your local machine,
single user**. Do not expose port 8000 to the internet as-is. For hosted /
multi-user, run each kernel in a locked-down container (mem/cpu/pids limits,
no network, read-only FS) — flags are stubbed in `docker-compose.yml`.

## What's done vs next

- **Done + tested:** execution engine, API, state persistence, plot + DataFrame
  capture, error handling, environment spec, containers, editor component.
- **Next:** build the course pages from `docs/PLAN.md` (content → example →
  Try-it), the menu + per-course sidebar TOC, and the page-level kernel session
  wiring. (Partially done)
---
Course contents curated by Claude Opus.
Not implemented yet per the real order, as a competition is ahead and I need to learn deep...