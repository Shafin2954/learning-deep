// setupScript.ts
// --------------
// Pure generator for the one-click local-runner setup script.
//
// The user picks a Device (windows/linux/mac) and an Env (system/venv/docker)
// on the /setup page and downloads ONE file. When run, that file fetches the
// handful of runner source files from raw GitHub (no `git clone`), provisions
// the chosen environment, and launches the code-runner on :8000. The deployed
// site (https://learning-deep.vercel.app) is already wired to call
// http://localhost:8000, and the runner's default CORS allowlist already
// includes that origin, so nothing else is needed.
//
// generateScript(device, env) is a pure function of two enums — no I/O — so it
// is trivially unit-testable and runs entirely client-side (Blob download).

export type Device = 'windows' | 'linux' | 'mac';
export type Env = 'system' | 'venv' | 'docker';

const RAW_BASE =
  'https://raw.githubusercontent.com/Shafin2954/learning-deep/main';
const RUNNER_PORT = 8000;
const WORK_DIR = 'learning-deep-runner';
const VERCEL_URL = 'https://learning-deep.vercel.app';
const IMAGE_TAG = 'learning-deep-runner';

// Repo-relative paths the runner needs at runtime.
const BASE_FILES = [
  'code-runner/server.py',
  'code-runner/kernel_exec.py',
  'code-runner/requirements.txt',
  'environment/requirements.txt',
];
const DOCKER_FILE = 'code-runner/Dockerfile';

export interface GeneratedScript {
  filename: string;
  mimeType: string;
  content: string;
}

const DEVICE_LABEL: Record<Device, string> = {
  windows: 'Windows',
  linux: 'Linux',
  mac: 'macOS',
};
const ENV_LABEL: Record<Env, string> = {
  system: 'System Python',
  venv: 'Virtual env (venv)',
  docker: 'Docker',
};

// ── Windows (.bat) ───────────────────────────────────────────────────────────
function winDownload(path: string): string {
  const dest = path.replace(/\//g, '\\');
  return `curl -fsSL -o ${dest} ${RAW_BASE}/${path}`;
}

function windowsScript(env: Env): string[] {
  const files = env === 'docker' ? [...BASE_FILES, DOCKER_FILE] : BASE_FILES;
  const lines: string[] = [
    '@echo off',
    'setlocal enabledelayedexpansion',
    'title learning-deep runner setup',
    'echo ============================================',
    `echo   learning-deep local runner setup`,
    `echo   Windows  -  ${ENV_LABEL[env]}`,
    'echo ============================================',
    'echo.',
    '',
    'REM --- prerequisites ---',
    'where curl >nul 2>nul || (echo [ERROR] curl.exe not found ^(needs Windows 10 1803+^). & pause & exit /b 1)',
  ];

  if (env !== 'docker') {
    lines.push(
      'set "PY="',
      'where py >nul 2>nul && set "PY=py -3"',
      'if not defined PY where python >nul 2>nul && set "PY=python"',
      'if not defined PY (echo [ERROR] Python 3.10+ not found. Install from https://python.org and re-run. & pause & exit /b 1)',
    );
  } else {
    lines.push(
      'where docker >nul 2>nul || (echo [ERROR] Docker not found. Install Docker Desktop and re-run. & pause & exit /b 1)',
    );
  }

  lines.push(
    '',
    `set "ROOT=%~dp0${WORK_DIR}"`,
    'if not exist "%ROOT%\\code-runner" mkdir "%ROOT%\\code-runner"',
    'if not exist "%ROOT%\\environment" mkdir "%ROOT%\\environment"',
    'cd /d "%ROOT%"',
    '',
    'echo Downloading runner files...',
    ...files.map(winDownload),
    '',
  );

  if (env === 'system') {
    lines.push(
      'echo Installing dependencies ^(may take several minutes and download multiple GB^)...',
      '%PY% -m pip install --upgrade pip',
      '%PY% -m pip install -r environment\\requirements.txt -r code-runner\\requirements.txt || (echo [ERROR] pip install failed. & pause & exit /b 1)',
      '',
      `echo Starting runner on http://localhost:${RUNNER_PORT}  ^(Ctrl+C to stop^)`,
      `echo Then open ${VERCEL_URL}`,
      'cd code-runner',
      `%PY% -m uvicorn server:app --host 0.0.0.0 --port ${RUNNER_PORT}`,
    );
  } else if (env === 'venv') {
    lines.push(
      'echo Creating virtual environment...',
      '%PY% -m venv "%ROOT%\\.venv"',
      'set "VENV_PY=%ROOT%\\.venv\\Scripts\\python.exe"',
      'echo Installing dependencies ^(may take several minutes and download multiple GB^)...',
      '"%VENV_PY%" -m pip install --upgrade pip',
      '"%VENV_PY%" -m pip install -r environment\\requirements.txt -r code-runner\\requirements.txt || (echo [ERROR] pip install failed. & pause & exit /b 1)',
      '',
      `echo Starting runner on http://localhost:${RUNNER_PORT}  ^(Ctrl+C to stop^)`,
      `echo Then open ${VERCEL_URL}`,
      'cd code-runner',
      `"%VENV_PY%" -m uvicorn server:app --host 0.0.0.0 --port ${RUNNER_PORT}`,
    );
  } else {
    lines.push(
      'echo Building Docker image ^(first build downloads multiple GB, be patient^)...',
      `docker build -f code-runner\\Dockerfile -t ${IMAGE_TAG} . || (echo [ERROR] docker build failed. & pause & exit /b 1)`,
      '',
      `echo Starting runner on http://localhost:${RUNNER_PORT}  ^(Ctrl+C to stop^)`,
      `echo Then open ${VERCEL_URL}`,
      `docker run --rm -p ${RUNNER_PORT}:${RUNNER_PORT} ${IMAGE_TAG}`,
    );
  }

  lines.push('pause');
  return lines;
}

// ── Unix (.sh / .command) ────────────────────────────────────────────────────
function nixScript(env: Env): string[] {
  const files = env === 'docker' ? [...BASE_FILES, DOCKER_FILE] : BASE_FILES;
  const lines: string[] = [
    '#!/usr/bin/env bash',
    'set -euo pipefail',
    '',
    'echo "============================================"',
    'echo "  learning-deep local runner setup"',
    `echo "  ${env === 'docker' ? 'Docker' : ENV_LABEL[env]}"`,
    'echo "============================================"',
    '',
    'SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"',
    `ROOT="$SCRIPT_DIR/${WORK_DIR}"`,
    `RAW="${RAW_BASE}"`,
    '',
    '# download helper: curl, fall back to wget',
    'dl() {',
    '  if command -v curl >/dev/null 2>&1; then curl -fsSL -o "$1" "$2";',
    '  elif command -v wget >/dev/null 2>&1; then wget -qO "$1" "$2";',
    '  else echo "[ERROR] need curl or wget"; exit 1; fi',
    '}',
    '',
    'mkdir -p "$ROOT/code-runner" "$ROOT/environment"',
    'cd "$ROOT"',
    '',
    'echo "Downloading runner files..."',
    ...files.map((p) => `dl "${p}" "$RAW/${p}"`),
    '',
  ];

  if (env === 'docker') {
    lines.push(
      'command -v docker >/dev/null 2>&1 || { echo "[ERROR] Docker not found. Install Docker and re-run."; exit 1; }',
      'echo "Building Docker image (first build downloads multiple GB, be patient)..."',
      `docker build -f code-runner/Dockerfile -t ${IMAGE_TAG} .`,
      '',
      `echo "Starting runner on http://localhost:${RUNNER_PORT}  (Ctrl+C to stop)"`,
      `echo "Then open ${VERCEL_URL}"`,
      `exec docker run --rm -p ${RUNNER_PORT}:${RUNNER_PORT} ${IMAGE_TAG}`,
    );
    return lines;
  }

  // system + venv both need a python
  lines.push(
    'PY="$(command -v python3 || command -v python || true)"',
    '[ -z "$PY" ] && { echo "[ERROR] Python 3.10+ required. Install it and re-run."; exit 1; }',
  );

  if (env === 'venv') {
    lines.push(
      'echo "Creating virtual environment..."',
      '"$PY" -m venv "$ROOT/.venv"',
      'PY="$ROOT/.venv/bin/python"',
    );
  }

  lines.push(
    'echo "Installing dependencies (may take several minutes and download multiple GB)..."',
    '"$PY" -m pip install --upgrade pip',
    '"$PY" -m pip install -r environment/requirements.txt -r code-runner/requirements.txt',
    '',
    `echo "Starting runner on http://localhost:${RUNNER_PORT}  (Ctrl+C to stop)"`,
    `echo "Then open ${VERCEL_URL}"`,
    'cd code-runner',
    `exec "$PY" -m uvicorn server:app --host 0.0.0.0 --port ${RUNNER_PORT}`,
  );
  return lines;
}

// ── Public API ───────────────────────────────────────────────────────────────
export function generateScript(device: Device, env: Env): GeneratedScript {
  if (device === 'windows') {
    return {
      filename: 'learning-deep-setup.bat',
      mimeType: 'application/octet-stream',
      // .bat wants CRLF line endings.
      content: windowsScript(env).join('\r\n') + '\r\n',
    };
  }
  const filename =
    device === 'mac' ? 'learning-deep-setup.command' : 'learning-deep-setup.sh';
  return {
    filename,
    mimeType: 'application/octet-stream',
    content: nixScript(env).join('\n') + '\n',
  };
}

export const DEVICES: { id: Device; label: string }[] = [
  { id: 'windows', label: DEVICE_LABEL.windows },
  { id: 'linux', label: DEVICE_LABEL.linux },
  { id: 'mac', label: DEVICE_LABEL.mac },
];
export const ENVS: { id: Env; label: string; hint: string }[] = [
  { id: 'system', label: 'System Python', hint: 'Installs into your current Python. Simplest, but pollutes the global environment.' },
  { id: 'venv', label: 'Virtual env', hint: 'Creates an isolated .venv. Recommended for a clean, contained install.' },
  { id: 'docker', label: 'Docker', hint: 'Fully isolated container. Heaviest first-run build, zero Python setup on your host.' },
];

/** True when the chosen device cannot reliably double-click-run (Mac/Linux). */
export function needsShellCommand(device: Device): boolean {
  return device !== 'windows';
}
