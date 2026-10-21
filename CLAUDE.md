# CLAUDE.md — mlForge Authoring Contract

> **Status (2026):** The rendering pipeline and backend are **done and deployed**.  
> This document is now the **strict authoring contract** for writing course MDX content.  
> Read it fully before producing any chapter. The rules are non-negotiable.

---

## What we're building

Each chapter is **one page** that interleaves short explanations and worked examples, ending
with an exercise: `heading → explanation → example (+output) → heading → explanation →
example → … → exercise`. Like W3Schools: bite-sized, example-driven, every code block shows
its result. A top nav (6 grouped dropdowns) picks the course; a left sidebar lists chapters
(ordered by `order` frontmatter); prev/next walks through them. The **Notebook right rail**
(persistent scratchpad) is on every chapter page automatically. "Try it Yourself" blocks run
real Python against the local backend (already built and tested).

The full curriculum is 20 courses, basic → advanced, in PLAN.md §2. Existing fast-track
courses (`foundations-for-llm`, `bengali-llm`, `tabular-kaggle`) live alongside the full-depth
courses; they follow the same authoring rules, including the ELI5 layer (rule 12). New courses follow PLAN.md §5 build order, one course per pass.

---

## Repo structure

```
mlforge/
├── code-runner/      # DONE. FastAPI+Jupyter kernel. POST /run {code,session_id}. Do not modify.
├── environment/      # Python stack the kernel imports.
├── web/              # Next.js frontend (done). Only edit content files below + courseNames.ts / NavBar.tsx / page.tsx when registering.
├── courses/          # CONTENT: one subdirectory per course.
│   ├── foundations-for-llm/   # fast-track
│   ├── bengali-llm/           # fast-track
│   ├── tabular-kaggle/        # fast-track
│   └── <new-course-slug>/     # ← your work goes here
└── docs/PLAN.md      # full curriculum: chapter lists, Under the Trench items, capstone specs
```

---

## Rendering pipeline reality (know this before writing)

Content is **NOT** compiled MDX/JSX. Each `.mdx` file is loaded with `gray-matter`, split into
`## ` sections, and rendered with **react-markdown** (`remarkGfm`, `remarkMath`, `rehypeRaw`,
`rehypeKatex`, `rehypeHighlight`). This means:

- **Only CommonMark + GFM + `$LaTeX$` + raw `<details>/<summary>` HTML** may appear in content.
- **No `import` statements.** No React component tags. No JSX.
- **No `<TryItYourself>` tag.** The live editor is mounted by the page when a `## Try it Yourself`
  heading is detected (regex `/^try it/i`). The **first `\`\`\`python` fence** in that section
  becomes the editor's initial code. You just write the heading and a code block.
- **`\`\`\`output` fences** render as an Output panel (monospace, muted background, "Output" label).
- **`## Under the Trench`** headings (regex `/under the trench/i`) automatically get the
  "Advanced / rare topics" banner styling.
- **`<details><summary>Solution</summary>…</details>`** HTML works (rehypeRaw passes it through).
- **Notebook right rail** mounts on every chapter page automatically.
  `sessionId = \`${course}/${chapter}\`` — all Try-it blocks on a page share one kernel session
  (variables persist down the page, like a notebook). Do not add any browser storage; that is
  handled exclusively by `NotebookStore.tsx` (`sessionStorage` key `notebook:v1`).

---

## AUTHORING RULES (STRICT)

These are non-negotiable. Every chapter, including chapters in existing courses used as
references, follows all of them.

### 1. File naming and placement
- Course directory: `courses/<course-slug>/` — flat, no subfolders.
- Chapters: `NN-slug.mdx` (zero-padded, kebab-case), e.g. `01-numpy-arrays.mdx`.
- Sidecar: `INDEX.md` (plain Markdown, not MDX) — course overview, chapter list, study notes.
- Capstone: the **final numbered chapter**, e.g. `13-capstone.mdx`.

### 2. Frontmatter — exactly four fields, in this order
```yaml
---
course: python-for-data-work
chapter: 01-numpy-arrays
title: "NumPy Arrays, Dtypes, and Memory Layout"
order: 1
---
```
- `course` = the directory name exactly.
- `chapter` = the filename stem exactly (without `.mdx`).
- `title` = double-quoted string. Title case; colons are fine.
- `order` = integer (not string). Controls sidebar order and prev/next.
- **No other fields.** No `tags`, `description`, `slug`, `part`, `section`, etc.

### 3. Body structure
- **No H1 in the body.** The page renders the `title` as H1. Body starts with `##`.
- Use `##` (H2) for every content section — sentence-phrase titles (not single words).
- Use `###` (H3) for drill-down sub-sections: derivations, worked sub-examples.
- **Never use `####` (H4) or deeper.** Maximum nesting depth is H3.
- No bold-as-heading (`**Heading**` on its own line). Use real headings.

### 4. Code + output pairing (the most important rule)
Every worked example is a `\`\`\`python` block **immediately followed** by a `\`\`\`output`
block holding the **exact, literal stdout** from running that code on the kernel:

````
```python
import numpy as np
a = np.array([1, 2, 3], dtype=np.float32)
print(a.dtype, a.nbytes)
```

```output
float32 12
```
````

- **Outputs must be real.** Run the code against the kernel and paste the actual result.
  Never fabricate or guess output. Plots → `![](data:image/png;base64,…)`. DataFrames → HTML.
- No trailing blank lines inside code blocks.
- Comments inside the code block may annotate the expected value inline, e.g. `# → 12`.

### 5. Math — LaTeX only
- Inline: `$x$`, `$W \in \mathbb{R}^{d}$`, `$\sqrt{d_k}$`.
- Display (own paragraph):
  ```
  $$
  y = xW + b
  $$
  ```
- **No unicode math** (`W₂`, `hᵀ`, `α`). No math in code spans (`` `alpha` `` is fine for a
  variable name; `$\alpha$` is for math).
- Use full KaTeX: `\boxed{}`, `\underbrace{}`, `\mathrm{}`, `\text{}`, `\frac{}{}`, `\sum`, etc.

### 6. Interleaving — mandatory
Do **not** dump all theory then all code. Alternate in small bites:

```
## Section title
Concept paragraph(s). At most 3–4 short paragraphs before the next example.

```python
<working example code>
```

```output
<real output>
```

Short bridging sentence, then the next ## or ###.
```

### 7. Fixed tail — every teaching chapter ends with this exact sequence
```
… (last concept section) …

## Try it Yourself

```python
<a runnable, self-contained experiment the reader can modify>
```

```output
<real output of the above as written>
```

Optional prose connecting to the next chapter or nudging the reader to try variations.

## Exercise

Prose problem statement (may reference the chapter's concepts).

<details>
<summary>Solution</summary>

```python
<solution code>
```

Brief explanation of the key insight.
</details>
```

- `## Exercise` is **always the last section** in a teaching chapter, except in the course's
  last teaching chapter where `## Under the Trench` follows it (see rule 8).
- Include `<details><summary>Solution</summary>` when a code solution exists. Omit for
  open-ended/reflective exercises.

### 8. Under the Trench — last teaching chapter only
In the **last teaching chapter** of each course (the one just before the capstone):
append a final `## Under the Trench` section **after** `## Exercise`.

Format: one line per rare/advanced topic, using bold term + em-dash:
```
## Under the Trench

Rare and advanced topics you should at least know the name of. You won't need them daily,
but you'll stop being surprised when you meet them.

- **NumPy strides & `as_strided`** — make sliding windows with zero copies; sharp edges if you get the strides wrong.
- **Structured/record arrays** — C-struct-like typed arrays; rare outside binary I/O.
- … (one line each, from PLAN.md's Under the Trench bullets for this course)
```

Source the bullet list from `docs/PLAN.md`'s "Under the Trench" section for the course.
This section gets the "Advanced / rare topics" banner automatically.

### 9. Capstone — final numbered chapter
The capstone is a **project spec**, not a teaching chapter. Structure:

```
---
course: <slug>
chapter: NN-capstone
title: "Capstone: <Short Title>"
order: N
---

## The project

One paragraph describing what you're building and why it's the proof of the whole course.

## Hard constraints (no vibe coding)

Bulleted list of what you MAY NOT use (no AI, no library X for the core, etc.).

## What it must contain (and the chapter each tests)

Numbered or bulleted requirements, each referencing the chapter(s) it exercises: `(ch. 4–7)`.

## Acceptance criteria

Concrete, measurable. "CV score within X% of library Y", "implements Z from scratch", etc.

## Skills checklist (tick before you claim done)

- [ ] I can <skill 1>.
- [ ] I can <skill 2>.
…
```

- **No code blocks, no `## Try it Yourself`, no `## Exercise`** in a capstone.
- Source the constraints, requirements, and checklist from `docs/PLAN.md`'s Capstone spec for
  the course; flesh out to be actionable.

### 10. Cross-references
Link chapters inline: `(ch. 6)`, `(ch. 4–7)`, `(F10)` for foundations chapters. Use the
chapter's topic name when helpful: `(ch. 12, feature selection)`.

### 11. Prose style
- Second-person voice: "You know…", "This gives you…"
- Clear before dense. Target 180–350 lines per teaching chapter (the ELI5 layer in rule 12
  adds length; that is expected, padding is not).
- No filler openers ("In this chapter, we will…"). Start the section with the thing itself.
- Derive fundamentals in `###` sub-sections with display math — don't state without showing.

### 12. The ELI5 layer — smart reader, new to the topic
Every chapter must be followable by a motivated beginner **without losing any rigor**. The
technical content (code, outputs, math, facts, edge cases) stays complete; the ELI5 layer
adds understanding around it. Write as if explaining to a curious 12-year-old who is good
at puzzles: plain words first, then the precise version.

- **Plain idea first.** Open every `##` section with one or two sentences that state the
  idea in everyday words, before any jargon, symbols, or code.
- **Define on first use.** The first time a term appears, bold it and say what it means in
  plain words in the same sentence: "a **dtype** — the *kind* of number every slot holds".
- **One honest analogy per big idea**, as a callout: `> **Picture it:** …`. The analogy must
  map onto the real mechanism; say where it breaks if that matters.
- **Read every display equation out loud** right after it: a `> **In plain words:** …`
  callout, or a short bullet list naming each symbol when there are three or more.
- **Walk through every output.** After an `output` block, point at the exact number or line
  that proves the point ("look at the second line: 24 bytes = 3 numbers × 8 bytes").
- **Name the trap** with `> **Watch out:** …` callouts for the mistakes people actually make.
- **Recap before practice.** The last concept section before `## Try it Yourself` is
  `## Recap in plain words`: 3–7 one-sentence bullets.
- **Hint before the solution.** Exercises get a `> **Hint:** …` line above `<details>`.
- Use short sentences and concrete numbers. No baby talk, and never "simply", "just",
  "obviously", or "trivially" — if it were obvious, the reader wouldn't need the page.
- The only callout labels are **Picture it**, **In plain words**, **Watch out**, **Hint**.
- When rewriting an existing chapter, code, outputs, and math are kept verbatim: write a
  template with `@@B#@@` / `@@M#@@` placeholders and build it with `tools/eli5.py` (below).

---

## Authoring tools

- `python tools/eli5.py show FILE` — print a chapter with `[B#]` (fenced block) and `[M#]`
  (display math) markers.
- `python tools/eli5.py build TEMPLATE FILE` — fill a template's `@@B#@@`/`@@M#@@` lines
  verbatim from the committed chapter and write it.
- `python tools/eli5.py check FILE...` — fail if any block, heading, or inline formula of
  the committed version was lost; lint rules 2–9.
- `python tools/run_chapter.py FILE_OR_DIR` — run every python block on the real kernel (one
  session per chapter, top to bottom) and diff against its `output` block; `--fix B12` /
  `--fix-all` pastes the real output. Needs the `environment/` stack installed.

---

## Under the Trench convention — summary

| Where | What |
|-------|------|
| Last teaching chapter of each course | `## Under the Trench` section (after `## Exercise`) |
| Content | One line per rare/advanced topic: `**Term** — one sentence.` |
| Source | PLAN.md's "Under the Trench" bullets for that course |
| Effect | Automatic "Advanced / rare topics" banner (no extra markup needed) |

All other teaching chapters do NOT have an Under the Trench section.

---

## Registering a new course

When a course is ready (content complete):

1. Create `courses/<slug>/` — add `INDEX.md` + all `NN-*.mdx` chapters + capstone.
2. `web/lib/courseNames.ts` — add `'<slug>': 'Display Name'` to `COURSE_NAMES`.
3. `web/components/NavBar.tsx` — add `{ id: '<slug>', name: 'Short Name' }` to the correct
   group in `COURSE_GROUPS`.
4. `web/app/page.tsx` — add an entry to the matching group in `HOME_GROUPS`:
   `{ id, name, tagline, chapters, badge }`.

Routing, sidebar, prev/next, search, and the notebook rail are **automatic** — no other changes.

---

## Build order (PLAN.md §5)

Produce courses one at a time:
1. **Foundations:** Python for Data Work → Math & Optimization → Probability & Statistics → Data Wrangling & EDA
2. **Core ML:** Classical ML → Time Series → (Eval/Tuning, Competition ML → Applied/Prod)
3. **Deep Learning:** DL Foundations → CNNs/CV → Sequences/Transformers → Generative → Modern Architectures → NLP/LLMs
4. **Specialized:** RL → Graph ML → RecSys → Bayesian
5. **Systems:** System Design → MLOps

Per course: INDEX.md → teaching chapters (12+ for large courses) → Under the Trench in last chapter → Capstone → register.

---

## Running it

**Recommended (Vercel frontend + local kernel):**
```
docker compose up --build           # runner on :8000
# then open https://learning-deep.vercel.app
```

**Local dev (both local):**
```
docker compose up --build           # runner on :8000
cd web && npm i && npm run dev      # site on :3000
```

`web/.env.local` (committed) sets `NEXT_PUBLIC_RUNNER_URL=http://localhost:8000`.

---

## Guardrails

- Do not alter content meaning; render it. Preserve code and `$LaTeX$` exactly.
- Do not rewrite the code-runner. Call it only via `runner.ts`.
- `sessionId = course/chapter`. No browser storage except `sessionStorage` in `NotebookStore.tsx`.
- Code blocks never wrap (scroll). Math never renders as a code box. Headings are real `<h*>`.
- Outputs are real — run the kernel, paste actual stdout.
- The three fast-track courses are maintained like the others: same rules, real outputs, ELI5 layer.

---

## Definition of done (per chapter)

Every teaching chapter renders as one interleaved page:
- Typeset LaTeX math (no gray code boxes)
- Syntax-colored code with real newlines preserved
- An Output panel under every `\`\`\`python` example
- Real headings with clear breaks
- A live Try-it editor seeded from the code fence
- Shared per-page kernel session
- Working sidebar + prev/next
- `## Under the Trench` (last teaching chapter only) with advanced-topic banner
- Capstone is a spec, not a code chapter
