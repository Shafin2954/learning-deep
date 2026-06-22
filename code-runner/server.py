"""
server.py
---------
HTTP API in front of the kernel pool. The Next.js "Try it Yourself" editor POSTs
code here and renders the structured outputs.

Endpoints
    POST /run    {code, session_id, timeout?}  -> {status, outputs[]}
    POST /reset  {session_id}                   -> {ok: true}
    GET  /health                                -> {ok: true, sessions: n}

Run it:
    uvicorn server:app --host 0.0.0.0 --port 8000

SECURITY NOTE
    This executes arbitrary Python. It is built for a LOCAL, single-user learning
    setup (your machine). Do NOT expose port 8000 to the public internet as-is.
    For multi-user/hosted use, run each kernel inside a locked-down container
    (no network, CPU/mem limits, read-only FS) — see docker-compose.yml notes.
"""

from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from starlette.requests import Request

from kernel_exec import KernelPool, DEFAULT_TIMEOUT

app = FastAPI(title="learning-deep code-runner", version="1.0")

# Allow the local Next.js dev server (and your deployed origin) to call us.
_origins = os.environ.get(
    "RUNNER_CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,https://learning-deep.vercel.app",
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _origins if o.strip()],
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

pool = KernelPool()


@app.middleware("http")
async def allow_private_network(request: Request, call_next):
    """Chrome Private Network Access: public-HTTPS → localhost preflights carry
    'Access-Control-Request-Private-Network: true' and require this header back.
    FastAPI's CORSMiddleware doesn't emit it, so we add it here."""
    response = await call_next(request)
    if request.headers.get("access-control-request-private-network") == "true":
        response.headers["Access-Control-Allow-Private-Network"] = "true"
    return response


class RunRequest(BaseModel):
    code: str
    session_id: str = Field(..., min_length=1, max_length=200)
    timeout: float = Field(default=DEFAULT_TIMEOUT, ge=1, le=120)


class ResetRequest(BaseModel):
    session_id: str = Field(..., min_length=1, max_length=200)


@app.post("/run")
def run(req: RunRequest) -> dict:
    return pool.run(req.session_id, req.code, timeout=req.timeout)


@app.post("/reset")
def reset(req: ResetRequest) -> dict:
    pool.reset(req.session_id)
    return {"ok": True}


@app.get("/health")
def health() -> dict:
    return {"ok": True, "sessions": len(pool._sessions)}


@app.on_event("shutdown")
def _cleanup() -> None:
    pool.shutdown_all()
