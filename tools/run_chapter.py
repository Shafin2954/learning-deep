#!/usr/bin/env python3
"""
run_chapter.py — execute a chapter's python blocks on the real kernel and compare
each one's result with the ```output block that follows it.

All blocks of one chapter run in one kernel session, top to bottom, exactly like
the site's notebook behaviour (sessionId = course/chapter).

Usage
-----
  run_chapter.py FILE_OR_DIR...            report matches / mismatches
  run_chapter.py FILE --fix B12,B20        replace those output blocks with real output
  run_chapter.py FILE --fix-all            replace every mismatched text output
  options: --timeout SECONDS (per block, default 120)  --jobs N (parallel chapters)
           --show  print the actual output of every mismatch

Needs the environment/requirements.txt stack plus jupyter_client + ipykernel.
"""
from __future__ import annotations

import argparse
import difflib
import os
import re
import sys
import tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "code-runner"))
sys.path.insert(0, str(REPO / "tools"))

from eli5 import fence_lang, parse_blocks, split_frontmatter  # noqa: E402
from kernel_exec import KernelPool  # noqa: E402

ANSI = re.compile(r"\x1b\[[0-9;]*m")


def render(outputs: list[dict]) -> tuple[str, list[str]]:
    """Text the reader would see (stdout + reprs + errors) and the rich kinds present."""
    parts, kinds = [], []
    for o in outputs:
        t = o["type"]
        if t == "stdout":
            parts.append(o["text"])
        elif t == "text":
            parts.append(o["text"] + "\n")
        elif t == "error":
            parts.append(f"{o['ename']}: {ANSI.sub('', o['evalue'])}\n")
            kinds.append("error")
        elif t in ("image", "html"):
            kinds.append(t)
    return "".join(parts), kinds


def is_rich(expected: str) -> bool:
    """Output blocks that stand for an image/HTML result rather than literal stdout."""
    s = expected.strip()
    return "data:image" in s or "<table" in s or s.startswith(("[Figure", "[Interactive"))


def rich_ok(expected: str, kinds: list[str]) -> bool:
    s = expected.strip()
    if "<table" in s:
        return "html" in kinds
    if s.startswith("[Interactive"):
        return "html" in kinds or "image" in kinds
    return "image" in kinds


def norm(s: str) -> str:
    lines = [ln.rstrip() for ln in s.strip("\n").split("\n")]
    return "\n".join(lines).strip("\n")


def run_file(pool: KernelPool, path: Path, timeout: float):
    text = path.read_text()
    _, body = split_frontmatter(text)
    segs, fences, _ = parse_blocks(body)
    order = [v for k, v in segs if k == "B"]
    sid = f"verify:{path.parent.name}/{path.stem}"
    results = []  # (output_block_idx, python_block_idx, expected, actual, kinds, status)
    pool.reset(sid)
    try:
        for pos, idx in enumerate(order):
            if fence_lang(fences[idx - 1]) != "python":
                continue
            code = "\n".join(fences[idx - 1].split("\n")[1:-1])
            res = pool.run(sid, code, timeout=timeout)
            actual, kinds = render(res["outputs"])
            stderr = "".join(o["text"] for o in res["outputs"] if o["type"] == "stderr")
            nxt = order[pos + 1] if pos + 1 < len(order) else None
            if nxt and fence_lang(fences[nxt - 1]) == "output":
                expected = "\n".join(fences[nxt - 1].split("\n")[1:-1])
                if is_rich(expected):
                    ok = rich_ok(expected, kinds)
                else:
                    ok = norm(expected) == norm(actual)
                status = "ok" if ok else ("mismatch" if res["status"] == "ok" else res["status"])
                results.append((nxt, idx, expected, actual, kinds, status, stderr))
            elif res["status"] != "ok":
                results.append((None, idx, "", actual, kinds, res["status"], stderr))
    finally:
        pool.reset(sid)
    return path, results


def apply_fixes(path: Path, results, which: set[int] | None):
    text = path.read_text()
    fm, body = split_frontmatter(text)
    _, fences, _ = parse_blocks(body)
    changed = 0
    for out_idx, _, expected, actual, kinds, status, _ in results:
        # only paste clean runs; errors and timeouts need a human fix to the code
        if out_idx is None or status != "mismatch":
            continue
        if which is not None and out_idx not in which:
            continue
        if is_rich(expected):
            continue
        old = fences[out_idx - 1]
        new = "```output\n" + norm(actual) + "\n```"
        if body.count(old) != 1:
            print(f"   ! B{out_idx}: block text not unique, fix by hand", file=sys.stderr)
            continue
        body = body.replace(old, new)
        changed += 1
    path.write_text(fm + body)
    return changed


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paths", nargs="+")
    ap.add_argument("--timeout", type=float, default=120)
    ap.add_argument("--jobs", type=int, default=4)
    ap.add_argument("--fix", default="")
    ap.add_argument("--fix-all", action="store_true")
    ap.add_argument("--show", action="store_true")
    args = ap.parse_args()

    files: list[Path] = []
    for p in map(Path, args.paths):
        files += sorted(p.glob("*.mdx")) if p.is_dir() else [p]
    files = [f.resolve() for f in files if "capstone" not in f.name]

    # kernels inherit the cwd; keep files that examples write out of the repo
    os.chdir(tempfile.mkdtemp(prefix="run_chapter_"))
    pool = KernelPool()
    with ThreadPoolExecutor(max_workers=args.jobs) as ex:
        reports = list(ex.map(lambda f: run_file(pool, f, args.timeout), files))
    pool.shutdown_all()

    total_bad = 0
    for path, results in reports:
        bad = [r for r in results if r[5] != "ok"]
        total_bad += len(bad)
        print(f"[{'ok' if not bad else str(len(bad)) + ' mismatch'}] {path}  ({len(results)} checked)")
        for out_idx, py_idx, expected, actual, kinds, status, stderr in bad:
            label = f"B{py_idx}→B{out_idx}" if out_idx else f"B{py_idx} (no output block)"
            print(f"   ✗ {label} [{status}] kinds={kinds}")
            if args.show or status == "error":
                diff = difflib.unified_diff(norm(expected).split("\n"), norm(actual).split("\n"),
                                            "doc", "kernel", lineterm="", n=1)
                for line in list(diff)[2:40]:
                    print("      " + line)
                if stderr.strip() and args.show:
                    print("      stderr: " + stderr.strip().split("\n")[-1][:200])
        if args.fix or args.fix_all:
            which = None if args.fix_all else {int(x.strip().lstrip("B")) for x in args.fix.split(",") if x.strip()}
            n = apply_fixes(path, results, which)
            if n:
                print(f"   → replaced {n} output block(s) with real kernel output")
    sys.exit(1 if total_bad else 0)


if __name__ == "__main__":
    main()
