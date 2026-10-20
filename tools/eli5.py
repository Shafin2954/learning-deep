#!/usr/bin/env python3
"""
eli5.py — rewrite chapters without ever retyping code, outputs, or math.

A rewrite is written as a *template*: your new prose, with placeholder lines
that pull blocks verbatim from the original chapter.

    @@B3@@   → fenced block #3 of the original (```python, ```output, …)
    @@M2@@   → display-math block #2 of the original ($$ … $$)

Subcommands
-----------
  show  FILE                 Print the chapter with [B#]/[M#] markers before each block.
  build TEMPLATE FILE        Fill TEMPLATE's placeholders from FILE's committed version
                             (git --base, default HEAD) and write the result to FILE.
  check FILE... [--base REV] Verify every block, heading, and inline formula of the
                             base version survives, then lint the authoring rules.

  build/check also take --base-dir DIR: use DIR/<course>/<file> as the base instead of
  git (e.g. a copy whose outputs were corrected with run_chapter.py --fix-all).

Exit status of `check` is non-zero if any file fails.
"""
from __future__ import annotations

import argparse
import collections
import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

FENCE_RE = re.compile(r"^```")
PLACEHOLDER_RE = re.compile(r"^@@([BM])(\d+)@@\s*$")


# ─── parsing ────────────────────────────────────────────────────────────────

def split_frontmatter(text: str) -> tuple[str, str]:
    if text.startswith("---\n"):
        end = text.index("\n---\n", 4) + 5
        return text[:end], text[end:]
    return "", text


def parse_blocks(body: str):
    """Return (segments, fences, maths).

    segments: list of ("prose", text) | ("B", idx) | ("M", idx) in order.
    fences:   list of full fenced-block strings (opening line … closing line).
    maths:    list of full display-math strings ($$ … $$, possibly one line).
    """
    lines = body.split("\n")
    segments: list[tuple[str, object]] = []
    fences: list[str] = []
    maths: list[str] = []
    prose: list[str] = []
    i = 0

    def flush():
        if prose:
            segments.append(("prose", "\n".join(prose)))
            prose.clear()

    while i < len(lines):
        line = lines[i]
        if FENCE_RE.match(line):
            j = i + 1
            while j < len(lines) and lines[j].rstrip() != "```":
                j += 1
            flush()
            fences.append("\n".join(lines[i : j + 1]))
            segments.append(("B", len(fences)))
            i = j + 1
            continue
        s = line.strip()
        if s.startswith("$$"):
            if s != "$$" and s.endswith("$$") and len(s) > 4:
                flush()
                maths.append(line)
                segments.append(("M", len(maths)))
                i += 1
                continue
            if s == "$$":
                j = i + 1
                while j < len(lines) and lines[j].strip() != "$$":
                    j += 1
                flush()
                maths.append("\n".join(lines[i : j + 1]))
                segments.append(("M", len(maths)))
                i = j + 1
                continue
        prose.append(line)
        i += 1
    flush()
    return segments, fences, maths


def fence_lang(fence: str) -> str:
    return fence.split("\n", 1)[0][3:].strip()


def prose_only(body: str) -> str:
    segs, _, _ = parse_blocks(body)
    return "\n".join(t for k, t in segs if k == "prose")


INLINE_CODE_RE = re.compile(r"`[^`\n]*`")
INLINE_MATH_RE = re.compile(r"(?<![\\$])\$(?!\$)((?:[^$\\\n]|\\.)+?)\$(?!\$)")


def inline_maths(body: str) -> collections.Counter:
    text = INLINE_CODE_RE.sub("", prose_only(body))
    return collections.Counter(m.group(1).strip() for m in INLINE_MATH_RE.finditer(text))


def headings(body: str, levels=(2, 3)) -> list[tuple[int, str]]:
    out = []
    for line in prose_only(body).split("\n"):
        m = re.match(r"^(#{1,6})\s+(.+?)\s*$", line)
        if m and len(m.group(1)) in levels:
            out.append((len(m.group(1)), m.group(2)))
    return out


def is_subsequence(needles: list, haystack: list) -> list:
    """Return the needles that could not be matched in order."""
    missing, j = [], 0
    for n in needles:
        k = j
        while k < len(haystack) and haystack[k] != n:
            k += 1
        if k == len(haystack):
            missing.append(n)
        else:
            j = k + 1
    return missing


# ─── git ────────────────────────────────────────────────────────────────────

def base_text(path: Path, args) -> str | None:
    """The version a rewrite is checked against: --base-dir/<course>/<file>, else git REV."""
    if getattr(args, "base_dir", None):
        p = Path(args.base_dir) / path.parent.name / path.name
        return p.read_text() if p.exists() else None
    return git_show(path, args.base)


def git_show(path: Path, rev: str) -> str | None:
    rel = path.resolve().relative_to(REPO)
    r = subprocess.run(
        ["git", "-C", str(REPO), "show", f"{rev}:{rel.as_posix()}"],
        capture_output=True, text=True,
    )
    return r.stdout if r.returncode == 0 else None


# ─── subcommands ────────────────────────────────────────────────────────────

def cmd_show(args):
    text = Path(args.file).read_text()
    fm, body = split_frontmatter(text)
    segs, fences, maths = parse_blocks(body)
    sys.stdout.write(fm)
    for kind, val in segs:
        if kind == "prose":
            sys.stdout.write(val + "\n")
        elif kind == "B":
            sys.stdout.write(f"[B{val}]\n{fences[val - 1]}\n")
        else:
            sys.stdout.write(f"[M{val}]\n{maths[val - 1]}\n")


def cmd_build(args):
    target = Path(args.file)
    original = base_text(target, args)
    if original is None:
        original = target.read_text()
    fm, body = split_frontmatter(original)
    _, fences, maths = parse_blocks(body)

    tpl = Path(args.template).read_text()
    tfm, tbody = split_frontmatter(tpl)
    out_lines, used_b, used_m, errors = [], set(), set(), []
    for line in tbody.split("\n"):
        m = PLACEHOLDER_RE.match(line)
        if not m:
            out_lines.append(line)
            continue
        kind, idx = m.group(1), int(m.group(2))
        pool = fences if kind == "B" else maths
        if not 1 <= idx <= len(pool):
            errors.append(f"placeholder @@{kind}{idx}@@ out of range (have {len(pool)})")
            continue
        (used_b if kind == "B" else used_m).add(idx)
        out_lines.append(pool[idx - 1])
    unused_b = sorted(set(range(1, len(fences) + 1)) - used_b)
    unused_m = sorted(set(range(1, len(maths) + 1)) - used_m)
    if unused_b and not args.allow_drop:
        errors.append(f"unused fenced blocks: {['B%d' % i for i in unused_b]}")
    if unused_m and not args.allow_drop:
        errors.append(f"unused math blocks: {['M%d' % i for i in unused_m]}")
    if errors:
        for e in errors:
            print("build error:", e, file=sys.stderr)
        sys.exit(1)
    result = (tfm or fm) + "\n".join(out_lines)
    result = result.rstrip("\n") + "\n"
    target.write_text(result)
    print(f"wrote {target} ({result.count(chr(10))} lines)")


UNICODE_MATH = re.compile(r"[₀-ₜ⁰-ⁿᵀ-ᵪᵢ-ᵪα-ωΑ-Ω∑∏√∞≤≥≠≈∈∂∇]")


def lint(path: Path, text: str, is_last_teaching: bool, is_capstone: bool) -> list[str]:
    problems: list[str] = []
    fm, body = split_frontmatter(text)
    keys = re.findall(r"^(\w+):", fm, re.M)
    if keys != ["course", "chapter", "title", "order"]:
        problems.append(f"frontmatter keys {keys}")

    segs, fences, _ = parse_blocks(body)
    prose = "\n".join(t for k, t in segs if k == "prose")
    for line in prose.split("\n"):
        if re.match(r"^#\s", line):
            problems.append(f"H1 in body: {line[:60]}")
        if re.match(r"^#{4,}\s", line):
            problems.append(f"H4+ heading: {line[:60]}")
        if re.match(r"^\*\*[^*]+\*\*:?\s*$", line):
            problems.append(f"bold-as-heading: {line[:60]}")
    for f in fences:
        for fl in f.split("\n")[1:-1]:
            if re.match(r"^##\s", fl):
                problems.append(f"'## ' line inside a code fence splits the section: {fl[:50]}")

    h2 = [t for lvl, t in headings(body, (2,))]
    if is_capstone:
        if fences:
            problems.append("capstone contains code blocks")
        for bad in ("Try it", "Exercise"):
            if any(t.lower().startswith(bad.lower()) for t in h2):
                problems.append(f"capstone has a '{bad}' section")
    else:
        expected_tail = ["Try it Yourself", "Exercise"] + (["Under the Trench"] if is_last_teaching else [])
        if h2[-len(expected_tail):] != expected_tail:
            problems.append(f"tail sections {h2[-len(expected_tail):]} != {expected_tail}")

    # every python example outside <details> must be followed by an output block
    in_details = False
    for n, (kind, val) in enumerate(segs):
        if kind == "prose":
            opens = val.count("<details>")
            closes = val.count("</details>")
            if opens > closes:
                in_details = True
            elif closes > opens:
                in_details = False
            continue
        if kind == "B" and fence_lang(fences[val - 1]) == "python" and not in_details:
            nxt = segs[n + 1] if n + 1 < len(segs) else None
            if nxt and nxt[0] == "prose" and nxt[1].strip() == "" and n + 2 < len(segs):
                nxt = segs[n + 2]
            if not (nxt and nxt[0] == "B" and fence_lang(fences[nxt[1] - 1]) == "output"):
                problems.append(f"python block B{val} not followed by an output block")
    if body.count("<details>") != body.count("</details>"):
        problems.append("unbalanced <details>")
    return problems


def chapter_roles(path: Path) -> tuple[bool, bool]:
    chapters = sorted(p.name for p in path.parent.glob("*.mdx"))
    capstones = [c for c in chapters if "capstone" in c]
    is_capstone = "capstone" in path.name
    is_last_teaching = bool(capstones) and len(chapters) >= 2 and path.name == chapters[-2]
    return is_last_teaching, is_capstone


def cmd_check(args):
    failed = 0
    for f in args.files:
        path = Path(f)
        new = path.read_text()
        old = base_text(path, args)
        problems: list[str] = []
        warnings: list[str] = []
        if old is not None:
            ofm, obody = split_frontmatter(old)
            nfm, nbody = split_frontmatter(new)
            if ofm != nfm:
                problems.append("frontmatter changed")
            _, ofences, omaths = parse_blocks(obody)
            _, nfences, nmaths = parse_blocks(nbody)
            norm = lambda s: re.sub(r"\s+", " ", s).strip()
            for m in is_subsequence(ofences, nfences):
                problems.append(f"lost fenced block: {m[:70]!r}")
            for m in is_subsequence([norm(x) for x in omaths], [norm(x) for x in nmaths]):
                problems.append(f"lost display math: {m[:70]!r}")
            lost_inline = inline_maths(obody) - inline_maths(nbody)
            for m, c in lost_inline.items():
                problems.append(f"lost inline math (x{c}): ${m}$")
            for h in is_subsequence(headings(obody), headings(nbody)):
                problems.append(f"lost/reordered heading: {'#' * h[0]} {h[1]}")
            new_py = [x for x in nfences if x not in ofences and fence_lang(x) == "python"]
            if new_py:
                warnings.append(f"{len(new_py)} NEW python block(s) — run them and paste real output")
            ow = len(re.findall(r"\w+", prose_only(obody)))
            nw = len(re.findall(r"\w+", prose_only(nbody)))
            uni_old = len(UNICODE_MATH.findall(INLINE_CODE_RE.sub("", prose_only(obody))))
            uni_new = len(UNICODE_MATH.findall(INLINE_CODE_RE.sub("", prose_only(nbody))))
            if uni_new > uni_old:
                warnings.append(f"unicode math chars in prose grew {uni_old} → {uni_new}")
            stats = f"prose words {ow} → {nw} ({(nw / max(ow, 1)):.2f}x), lines {old.count(chr(10))} → {new.count(chr(10))}"
        else:
            stats = "(new file, no base version)"
        is_last, is_cap = chapter_roles(path)
        problems += lint(path, new, is_last, is_cap)
        status = "FAIL" if problems else "ok"
        failed += bool(problems)
        print(f"[{status}] {f}: {stats}")
        for p in problems:
            print("   ✗", p)
        for w in warnings:
            print("   !", w)
    sys.exit(1 if failed else 0)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("show"); s.add_argument("file"); s.set_defaults(fn=cmd_show)
    b = sub.add_parser("build"); b.add_argument("template"); b.add_argument("file")
    b.add_argument("--base", default="HEAD")
    b.add_argument("--base-dir", help="read base chapters from DIR/<course>/<file> instead of git")
    b.add_argument("--allow-drop", action="store_true", help="permit unused original blocks")
    b.set_defaults(fn=cmd_build)
    c = sub.add_parser("check"); c.add_argument("files", nargs="+"); c.add_argument("--base", default="HEAD")
    c.add_argument("--base-dir", help="read base chapters from DIR/<course>/<file> instead of git")
    c.set_defaults(fn=cmd_check)
    args = ap.parse_args()
    args.fn(args)


if __name__ == "__main__":
    main()
