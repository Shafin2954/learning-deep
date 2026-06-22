// runner.ts — typed client for the learning-deep code-runner.
// Set NEXT_PUBLIC_RUNNER_URL in .env.local (defaults to localhost:8000).

const RUNNER_URL =
  process.env.NEXT_PUBLIC_RUNNER_URL ?? "http://localhost:8000";

// Output shapes match code-runner/kernel_exec.py exactly.
export type Output =
  | { type: "stdout"; text: string }
  | { type: "stderr"; text: string }
  | { type: "text"; text: string }
  | { type: "html"; html: string }
  | { type: "image"; mime: string; b64: string }
  | { type: "error"; ename: string; evalue: string; traceback: string[] };

export interface RunResult {
  status: "ok" | "error" | "timeout";
  outputs: Output[];
}

export async function runCode(
  code: string,
  sessionId: string,
  timeout = 30,
): Promise<RunResult> {
  const res = await fetch(`${RUNNER_URL}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, session_id: sessionId, timeout }),
  });
  if (!res.ok) {
    return {
      status: "error",
      outputs: [
        {
          type: "error",
          ename: "RunnerError",
          evalue: `Runner returned ${res.status}. Is the code-runner running on ${RUNNER_URL}?`,
          traceback: [],
        },
      ],
    };
  }
  return res.json();
}

export async function resetSession(sessionId: string): Promise<void> {
  await fetch(`${RUNNER_URL}/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  }).catch(() => { });
}

// Jupyter tracebacks carry ANSI color codes — strip them for clean display.
export function stripAnsi(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/\u001b\[[0-9;]*m/g, "");
}
