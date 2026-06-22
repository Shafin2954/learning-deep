# CLAUDE.md — Build Guide for mlForge

Build a W3Schools-style interactive ML/DS learning site from the MDX content in this repo.
Read this fully before coding. **Priority for this pass: the rendering pipeline** — math,
code, output, headings. Get these right first; they're why the current pages read poorly.

## What we're building

Each chapter is ONE page that interleaves short explanation and worked examples, then ends
with an exercise: **heading → explanation → example (with output) → heading → explanation →
example → … → exercise**. Like W3Schools: bite-sized, example-driven, every code block shows
a result. A top menu picks the course; a left sidebar lists chapters; prev/next moves through
them. "Try it Yourself" blocks run real Python against the local backend (already built).

The backend is done. **Your job: the frontend rendering pipeline + the page layout.**

## Repo structure

```
mlforge/
├── code-runner/      # DONE+TESTED FastAPI+Jupyter kernel. POST /run {code,session_id}. Don't rewrite.
├── environment/      # the Python stack the kernel imports
├── web/              # frontend starters: components/TryItYourself.tsx, lib/runner.ts
├── courses/          # CONTENT: foundations-for-llm/, bengali-llm/, tabular-kaggle/ (+ INDEX/GLOSSARY)
├── docs/PLAN.md      # full curriculum
└── README.md
```

## ⚙️ RENDERING PIPELINE — build this first (it's what's currently broken)

Four defects to fix: (1) math renders as gray code boxes, (2) code lines run together, (3)
examples show no output, (4) no syntax coloring. Fixes:

### 1. Math → LaTeX with KaTeX (NOT unicode, NOT code spans)
Content uses LaTeX: inline `$\partial L/\partial w$`, display `$$ ... $$`. Wire a math
renderer so these typeset properly:
```
npm i remark-math rehype-katex katex
```
MDX config:
```js
// next.config.mjs (or mdx options)
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'           // tables (glossary uses them)
const mdxOptions = { remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeKatex] }
```
Import KaTeX CSS once globally:
```js
import 'katex/dist/katex.min.css'            // in app/layout.tsx
```
Now `$...$` / `$$...$$` render as real math. (Code identifiers like `autograd`, `np.dot`
stay in backticks — those SHOULD be monospace. Only *math* uses `$`.)

### 2. Code blocks → fenced, highlighted, never-wrapping
Every code snippet is a fenced ```python block (real newlines preserved). Add highlighting:
```
npm i rehype-pretty-code shiki
```
```js
import rehypePretty from 'rehype-pretty-code'
const mdxOptions = { ..., rehypePlugins: [rehypeKatex, [rehypePretty, { theme: 'github-dark' }]] }
```
CSS — code must preserve newlines and scroll horizontally, NEVER wrap:
```css
pre { white-space: pre; overflow-x: auto; padding: 1rem; border-radius: 8px; line-height: 1.5; }
pre code { white-space: pre; word-break: normal; }   /* no wrapping, ever */
```
This kills the "lines running together" bug (caused by wrapping + inline code misuse).

### 3. Every example shows its OUTPUT
Two output sources:
- **Example blocks** (static): the MDX carries the captured output in an `Output:` block right
  after the code. Render it as a labeled "Output" panel (distinct background, "Output" tag).
  Format:
  ````
  ```python
  print("hi")
  ```
  ```output
  hi
  ```
  ````
  Render a ```output block as the Output panel (monospace, muted bg, "Output" label). It can
  contain text, a DataFrame as HTML, or `![](data:image/png;base64,...)` for a plot.
- **Try it Yourself blocks** (live): the `<TryItYourself>` widget runs the kernel and shows
  real output. Keep this.
Result: a reader always sees code AND its result, W3Schools-style.

### 4. Headings → real `<h2>/<h3>/<h4>`, with breaks and focus
**Stop treating `**bold**` as a heading** — it doesn't break the line and gets lost. Section
titles are real markdown headings (`##`, `###`, `####`) and must be styled to stand out:
```css
h2 { font-size: 1.6rem; font-weight: 700; margin: 2.5rem 0 1rem; padding-bottom: .3rem;
     border-bottom: 1px solid #e5e7eb; scroll-margin-top: 5rem; }
h3 { font-size: 1.25rem; font-weight: 650; margin: 2rem 0 .75rem; scroll-margin-top: 5rem; }
h4 { font-size: 1.05rem; font-weight: 600; margin: 1.5rem 0 .5rem; color: #374151; }
p  { line-height: 1.7; margin: 0 0 1rem; max-width: 70ch; }
```
Clear line breaks, whitespace, and visual weight per subsection. This fixes "headings should
get breaks and good focus."

## AUTHORING FORMAT (the new MDX convention the content follows)

Frontmatter unchanged (`course, chapter, title, order`). Body rules:
- **Real headings only.** `##` for the big beats, `###` for sub-topics. Never bold-as-heading.
- **Interleave on ONE page:** explanation → example(+output) → explanation → example(+output)
  → … → `## Exercise`. Don't dump all theory then all code; alternate in small bites.
- **Math is LaTeX** (`$...$`, `$$...$$`). No unicode math (no `W₂`, `hᵀ`), no math in code spans.
- **Every example** is a fenced ```python block immediately followed by a ```output block with
  the captured result (or is a `<TryItYourself>` for live editing).
- **Derive the basics.** Fundamentals (e.g. the softmax gradient) are worked step by step in
  `###` sub-sections with display math, not stated and referenced away.
Note: the existing 52 chapters are being migrated to this format (LaTeX, real headings, output
blocks, interleaving). Render per these rules; the content will match them.

## Try it Yourself widget (already written — restyle to match)

`web/components/TryItYourself.tsx` (Monaco editor + Run/Reset + rich output) and
`web/lib/runner.ts` (typed client, `NEXT_PUBLIC_RUNNER_URL`) are ready. Use as-is, restyled to
match the new code/output look. Critical: all Try-it blocks on a page share
`sessionId = `${course}/${chapter}`` so kernel state persists down the page (notebook behavior).
Install: `npm i @monaco-editor/react`. State is React-only **except** the Notebook panel: `web/components/NotebookStore.tsx` uses `sessionStorage` (key `notebook:v1`) to persist cells/outputs across page refreshes; it clears on tab close. Do not add localStorage/sessionStorage anywhere else.

## Page layout (W3Schools)

```
TOP NAV: logo · course tabs (Foundations | Bengali LLM | Tabular Kaggle | Glossary) · search
LEFT SIDEBAR: active course's chapters (ordered by `order`, active highlighted)
MAIN: H1 title, then the interleaved headings/explanations/examples/outputs, then Exercise,
      then ◂ Prev / Next ▸
RIGHT: Notebook right rail — `NotebookPanel.tsx`, a persistent multi-cell scratchpad.
       Shares the same `sessionId` as the TryItYourself blocks on the page, so kernel
       state is shared between inline Try-it blocks and Notebook cells. Cell text/outputs
       persist across navigation via `sessionStorage` (key `notebook:v1`, in
       `NotebookStore.tsx` only — do not add sessionStorage elsewhere).
```
Routing (Next.js app router): `/[course]`, `/[course]/[chapter]`, `/glossary`.
Prev/Next and sidebar order come from the `order` frontmatter. Ship a Bengali web font
(Noto Sans Bengali) so Bengali script renders; page charset UTF-8.

## Styling

Read `/mnt/skills/public/frontend-design/SKILL.md` if present. Otherwise: clean, generous
whitespace, a sticky sidebar, a green "Run" button (W3Schools cue), ~70ch prose measure,
the heading/code/output CSS above. Lazy-load Monaco so pages stay fast.

## Build order

1. **Pipeline first** (this doc's ⚙️ section): MDX + KaTeX + highlighting + Output panels +
   real-heading CSS. Verify on one chapter that math typesets, code keeps newlines + colors,
   and Output panels show.
2. **Content loader**: read `courses/**/*.mdx`, parse frontmatter (`gray-matter`), render body
   (MDX with the plugins). Build the course manifest + sidebar from `order`.
3. **Page template + layout** (sidebar, prev/next, Try-it wiring).
4. **One course end-to-end** (`foundations-for-llm` first — code-heavy, good stress test).
5. **All courses + glossary page + search.**
6. Polish: right-rail anchors, responsive, progress (React state only).

## Running it

**Recommended (Vercel frontend + local kernel):**
```
docker compose up --build           # runner on :8000 (or uvicorn in code-runner/)
# then open https://learning-deep.vercel.app — no npm needed
```
`web/.env.local` (committed) sets `NEXT_PUBLIC_RUNNER_URL=http://localhost:8000` so the
Vercel build already points at the user's local machine. The backend's default CORS
allows both `localhost:3000` and `learning-deep.vercel.app` — no extra config needed.

**Local dev (frontend + backend both local):**
```
docker compose up --build           # runner on :8000
cd web && npm i
cd web && npm run dev               # site on :3000
```

## Guardrails
- Don't alter content meaning; render it. Preserve code blocks and `$LaTeX$` **exactly**.
- Don't rewrite the code-runner. Call it only via `runner.ts`.
- Keep `sessionId = course/chapter`. No browser storage except `sessionStorage` in `NotebookStore.tsx` (notebook persistence only). UTF-8 + Bengali font.
- Code never wraps (scroll). Math never renders as a code box. Headings are real `<h*>`.

## Definition of done
Every chapter renders as one interleaved page: typeset LaTeX math, syntax-colored code that
preserves newlines, an Output panel under every example, real headings with clear breaks, a
live Try-it (shared per-page kernel), working sidebar + prev/next, searchable glossary, correct
Bengali rendering.
