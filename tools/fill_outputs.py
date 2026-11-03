#!/usr/bin/env python3
"""Run every ```python block of a chapter in one shared namespace (like the page's
kernel session) and write the literal stdout into the ```output block that follows it.

    python3 tools/fill_outputs.py courses/<slug>/NN-chapter.mdx [--check]

- A ```python block with no ```output after it gets one inserted.
- Blocks run top to bottom, including solution blocks inside <details>.
- Any exception aborts without writing, and prints which block failed.
- --check: run and report blocks whose recorded output differs, without writing.
"""
import contextlib
import io
import os
import re
import sys
import time
import traceback

os.environ.setdefault("MPLBACKEND", "Agg")

FENCE = re.compile(r"^```(\w*)\s*$")


def parse(lines):
    """Return list of (kind, start, end) for fenced blocks; end is index of closing fence."""
    blocks, i = [], 0
    while i < len(lines):
        m = FENCE.match(lines[i])
        if m and m.group(1):
            j = i + 1
            while j < len(lines) and lines[j].rstrip() != "```":
                j += 1
            blocks.append((m.group(1), i, j))
            i = j + 1
        else:
            i += 1
    return blocks


def main():
    path = sys.argv[1]
    check = "--check" in sys.argv
    text = open(path, encoding="utf-8").read()
    lines = text.split("\n")
    blocks = parse(lines)
    ns = {"__name__": "__main__"}
    edits = []  # (python_end, existing_output_block_or_None, new_output)
    for bi, (kind, s, e) in enumerate(blocks):
        if kind != "python":
            continue
        code = "\n".join(lines[s + 1:e])
        buf = io.StringIO()
        t0 = time.time()
        try:
            with contextlib.redirect_stdout(buf):
                exec(compile(code, f"{path}:block@line{s + 1}", "exec"), ns)
        except Exception:
            sys.stderr.write(buf.getvalue())
            traceback.print_exc()
            sys.exit(f"FAILED in python block starting at line {s + 1}")
        dt = time.time() - t0
        out = "\n".join(l.rstrip() for l in buf.getvalue().rstrip().split("\n"))
        if not out.strip():
            print(f"WARNING: block at line {s + 1} printed nothing", file=sys.stderr)
        print(f"block line {s + 1}: {dt:.1f}s", file=sys.stderr)
        nxt = None
        if bi + 1 < len(blocks) and blocks[bi + 1][0] == "output":
            k2, s2, e2 = blocks[bi + 1]
            if all(not l.strip() for l in lines[e + 1:s2]):
                nxt = (s2, e2)
        edits.append((e, nxt, out))
    if check:
        bad = 0
        for e, nxt, out in edits:
            old = "\n".join(lines[nxt[0] + 1:nxt[1]]) if nxt else None
            if old != out:
                bad += 1
                print(f"MISMATCH after python block ending line {e + 1}")
        print(f"{bad} mismatching output blocks")
        sys.exit(1 if bad else 0)
    for e, nxt, out in reversed(edits):
        new = ["```output"] + out.split("\n") + ["```"]
        if nxt:
            lines[nxt[0]:nxt[1] + 1] = new
        else:
            lines[e + 1:e + 1] = [""] + new
    open(path, "w", encoding="utf-8").write("\n".join(lines))
    print(f"wrote {len(edits)} output blocks to {path}")


if __name__ == "__main__":
    main()
