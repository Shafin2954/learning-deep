"""
kernel_exec.py
--------------
Stateful Jupyter-kernel execution engine for the "Try it Yourself" runner.

One IPython kernel per session_id. Code submitted to the same session keeps its
namespace (variables, imports, models persist across runs) — like a notebook.
This is what makes the ML tutorials better than W3Schools: students build state.

Outputs are normalized into a simple ordered list the frontend can render:
    {"type": "stdout",  "text": "..."}
    {"type": "stderr",  "text": "..."}
    {"type": "text",    "text": "..."}      # plain repr of last expression
    {"type": "html",    "html": "..."}      # e.g. a pandas DataFrame
    {"type": "image",   "mime": "image/png", "b64": "..."}   # matplotlib figs
    {"type": "error",   "ename": "...", "evalue": "...", "traceback": ["..."]}
"""

from __future__ import annotations

import queue
import threading
import time
from dataclasses import dataclass, field

from jupyter_client.manager import KernelManager


# How long a single run may take before we interrupt the kernel.
DEFAULT_TIMEOUT = 30.0
# Kernels idle longer than this get shut down to free memory.
IDLE_SHUTDOWN = 15 * 60.0


@dataclass
class _Session:
    km: KernelManager
    client: object
    last_used: float = field(default_factory=time.time)
    lock: threading.Lock = field(default_factory=threading.Lock)


class KernelPool:
    """Holds one kernel per session id. Thread-safe. Auto-reaps idle kernels."""

    def __init__(self, idle_shutdown: float = IDLE_SHUTDOWN):
        self._sessions: dict[str, _Session] = {}
        self._guard = threading.Lock()
        self._idle_shutdown = idle_shutdown
        self._reaper = threading.Thread(target=self._reap_loop, daemon=True)
        self._reaper.start()

    # -- lifecycle ---------------------------------------------------------
    def _spawn(self) -> _Session:
        km = KernelManager(kernel_name="python3")
        km.start_kernel()
        client = km.client()
        client.start_channels()
        client.wait_for_ready(timeout=60)
        # Inline backend captures matplotlib figures as PNG and flushes them
        # automatically at the end of each cell. Keep this minimal — adding an
        # explicit Agg backend before the magic disables the flush hook.
        boot = "get_ipython().run_line_magic('matplotlib', 'inline')\n"
        client.execute(boot, silent=True)
        # drain boot output
        self._drain(client, timeout=20)
        return _Session(km=km, client=client)

    def _get(self, session_id: str) -> _Session:
        with self._guard:
            sess = self._sessions.get(session_id)
            if sess is None:
                sess = self._spawn()
                self._sessions[session_id] = sess
            sess.last_used = time.time()
            return sess

    def reset(self, session_id: str) -> None:
        """Kill the session's kernel; next run starts fresh."""
        with self._guard:
            sess = self._sessions.pop(session_id, None)
        if sess is not None:
            self._shutdown(sess)

    def shutdown_all(self) -> None:
        with self._guard:
            sessions = list(self._sessions.values())
            self._sessions.clear()
        for s in sessions:
            self._shutdown(s)

    @staticmethod
    def _shutdown(sess: _Session) -> None:
        try:
            sess.client.stop_channels()
        except Exception:
            pass
        try:
            sess.km.shutdown_kernel(now=True)
        except Exception:
            pass

    def _reap_loop(self) -> None:
        while True:
            time.sleep(60)
            cutoff = time.time() - self._idle_shutdown
            stale: list[str] = []
            with self._guard:
                for sid, sess in self._sessions.items():
                    if sess.last_used < cutoff:
                        stale.append(sid)
            for sid in stale:
                self.reset(sid)

    # -- execution ---------------------------------------------------------
    @staticmethod
    def _drain(client, timeout: float) -> None:
        """Throw away pending iopub messages (used after boot)."""
        deadline = time.time() + timeout
        while time.time() < deadline:
            try:
                client.get_iopub_msg(timeout=0.2)
            except queue.Empty:
                break

    def run(self, session_id: str, code: str, timeout: float = DEFAULT_TIMEOUT) -> dict:
        sess = self._get(session_id)
        # serialize runs within a session — one kernel, one execution at a time
        with sess.lock:
            return self._execute(sess, code, timeout)

    def _execute(self, sess: _Session, code: str, timeout: float) -> dict:
        client = sess.client
        msg_id = client.execute(code, store_history=True, allow_stdin=False)

        outputs: list[dict] = []
        status = "ok"
        deadline = time.time() + timeout
        idle_seen = False

        while True:
            remaining = deadline - time.time()
            if remaining <= 0:
                # took too long — interrupt the kernel and report
                try:
                    sess.km.interrupt_kernel()
                except Exception:
                    pass
                outputs.append(
                    {
                        "type": "error",
                        "ename": "TimeoutError",
                        "evalue": f"Execution exceeded {timeout:.0f}s and was interrupted.",
                        "traceback": [],
                    }
                )
                status = "timeout"
                break

            try:
                msg = client.get_iopub_msg(timeout=min(remaining, 1.0))
            except queue.Empty:
                continue

            if msg.get("parent_header", {}).get("msg_id") != msg_id:
                continue

            mtype = msg["header"]["msg_type"]
            content = msg["content"]

            if mtype == "status":
                if content.get("execution_state") == "idle":
                    idle_seen = True
                    break  # execution finished
            elif mtype == "stream":
                outputs.append(
                    {"type": content["name"], "text": content["text"]}  # stdout / stderr
                )
            elif mtype in ("execute_result", "display_data"):
                outputs.extend(self._render_data(content.get("data", {})))
            elif mtype == "error":
                outputs.append(
                    {
                        "type": "error",
                        "ename": content.get("ename", "Error"),
                        "evalue": content.get("evalue", ""),
                        "traceback": content.get("traceback", []),
                    }
                )
                status = "error"

        return {"status": status if not idle_seen else status, "outputs": outputs}

    @staticmethod
    def _render_data(data: dict) -> list[dict]:
        """Pick the richest representation Jupyter handed us."""
        out: list[dict] = []
        if "image/png" in data:
            out.append({"type": "image", "mime": "image/png", "b64": data["image/png"].strip()})
        elif "image/jpeg" in data:
            out.append({"type": "image", "mime": "image/jpeg", "b64": data["image/jpeg"].strip()})
        elif "text/html" in data:
            out.append({"type": "html", "html": data["text/html"]})
        elif "text/plain" in data:
            out.append({"type": "text", "text": data["text/plain"]})
        return out
