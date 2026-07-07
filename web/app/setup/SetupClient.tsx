'use client';

// SetupClient.tsx
// ---------------
// Interactive form for the /setup page: pick Device + Env, preview the exact
// script, and download it as one file. All client-side — the script is static
// text templated from two enums (see lib/setupScript.ts), so there's no API
// route or server work involved.

import { useMemo, useState } from 'react';
import {
  generateScript,
  needsShellCommand,
  DEVICES,
  ENVS,
  type Device,
  type Env,
} from '@/lib/setupScript';

export default function SetupClient() {
  const [device, setDevice] = useState<Device>('windows');
  const [env, setEnv] = useState<Env>('venv');

  const script = useMemo(() => generateScript(device, env), [device, env]);

  function download() {
    const blob = new Blob([script.content], { type: script.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = script.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const envHint = ENVS.find((e) => e.id === env)?.hint ?? '';

  return (
    <div className="setup-wizard">
      <div className="setup-field">
        <span className="setup-field-label">1. Your device</span>
        <div className="setup-options" role="group" aria-label="Device">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              className={`setup-option${device === d.id ? ' selected' : ''}`}
              aria-pressed={device === d.id}
              onClick={() => setDevice(d.id)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="setup-field">
        <span className="setup-field-label">2. Environment</span>
        <div className="setup-options" role="group" aria-label="Environment">
          {ENVS.map((e) => (
            <button
              key={e.id}
              type="button"
              className={`setup-option${env === e.id ? ' selected' : ''}`}
              aria-pressed={env === e.id}
              onClick={() => setEnv(e.id)}
            >
              {e.label}
            </button>
          ))}
        </div>
        <p className="setup-hint">{envHint}</p>
      </div>

      <div className="setup-field">
        <span className="setup-field-label">3. Download &amp; run</span>
        <button type="button" className="setup-download tiy-run" onClick={download}>
          ↓ Download {script.filename}
        </button>

        {device === 'windows' ? (
          <p className="setup-hint">
            Double-click <code>{script.filename}</code> to run it. It downloads the runner,
            installs everything, and starts it on <code>localhost:8000</code>. Then open{' '}
            <a href="https://learning-deep.vercel.app" target="_blank" rel="noreferrer">
              learning-deep.vercel.app
            </a>
            .
          </p>
        ) : (
          <p className="setup-hint">
            Your browser removes the executable bit on download, so run it from a terminal:
            <br />
            <code>bash ~/Downloads/{script.filename}</code>
            <br />
            It downloads the runner, installs everything, and starts it on{' '}
            <code>localhost:8000</code>. Then open{' '}
            <a href="https://learning-deep.vercel.app" target="_blank" rel="noreferrer">
              learning-deep.vercel.app
            </a>
            .
          </p>
        )}
        {needsShellCommand(device) && env === 'docker' && (
          <p className="setup-hint">
            Docker builds the image locally on first run (no prebuilt image yet) — expect a
            long first build.
          </p>
        )}
      </div>

      <div className="setup-field">
        <span className="setup-field-label">Preview</span>
        <pre className="setup-preview">
          <code>{script.content}</code>
        </pre>
      </div>
    </div>
  );
}
