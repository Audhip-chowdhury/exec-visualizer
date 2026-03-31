# Exec Visualizer

A static and runtime code execution visualizer built on Next.js. Write JavaScript (or TypeScript) code against a curated DSA problem bank, hit **Compile**, and watch your program execute step-by-step — annotated with a control-flow graph, variable snapshots at every frame, and smart data-structure renderers.

---

## What it does

Exec Visualizer bridges the gap between "reading code" and "understanding execution." It gives two complementary views of any running program:

| Mode | Audience | What you see |
|---|---|---|
| **Structures** (Beginner) | Learners | Variable cards with human-readable descriptions; inferred data structures (arrays, trees, linked lists, graphs, Map/Set) drawn graphically |
| **Exec Flow** (Advanced) | Developers | Full control-flow graph of the program, highlighted node-by-node as execution progresses, with a variable timeline and raw log panel |

Both modes are driven by the **same underlying pipeline**: parse → statically analyze → instrument → run → stream events → build frames.

---

## Architecture overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser (React)                        │
│                                                                 │
│  ┌──────────┐   Compile   ┌──────────────────────────────────┐  │
│  │  Monaco  │ ──────────► │         Zustand Store            │  │
│  │  Editor  │             │  code, graph, events, frames,    │  │
│  └──────────┘             │  playback index, instrumented    │  │
│                           └───────────┬──────────────────────┘  │
│                                       │                         │
│              ┌─────────────────────── ┼ ────────────────────┐   │
│              │  GraphCanvas           │  BeginnerView        │   │
│              │  (React Flow)          │  StructureViewers    │   │
│              │  + VariablePanel       │  Variable cards      │   │
│              │  + Timeline / Logs     │                      │   │
│              └────────────────────────┴──────────────────────┘   │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP (fetch / SSE)
┌──────────────────────▼──────────────────────────────────────────┐
│                     Next.js Server (Node.js runtime)            │
│                                                                 │
│  POST /api/analyze      →  static AST walk  →  { nodes, edges } │
│  POST /api/instrument   →  AST rewrite      →  { instrumented } │
│  POST /api/run          →  execute + stream →  SSE log events   │
└─────────────────────────────────────────────────────────────────┘
```

The server routes share library code from `lib/` — the same parsers, analyzers, and instrumenters are used across all three endpoints and in the test suite.

---

## Project structure

```
exec-visualizer/
├── app/
│   ├── page.tsx                  # Home: problem list with category chips + search
│   ├── problems/[id]/
│   │   ├── page.tsx              # Server component: resolves problem by ID
│   │   └── ProblemView.tsx       # Main workspace UI
│   └── api/
│       ├── analyze/route.ts      # POST → AnalyzeResult (nodes + edges)
│       ├── instrument/route.ts   # POST → instrumented source
│       └── run/route.ts          # POST → SSE stream of log events
│
├── components/
│   ├── GraphCanvas.tsx           # React Flow graph with deterministic layout
│   ├── BeginnerView.tsx          # Step-by-step readable descriptions
│   ├── StructureViewers.tsx      # Array / tree / list / graph / Map / Set renderers
│   ├── detectDataStructure.ts    # Heuristic structure classification
│   ├── Timeline.tsx              # Scrubbing playback control
│   ├── VariablePanel.tsx         # Per-frame variable inspector
│   ├── LogPanel.tsx              # Raw event log
│   └── Editor.tsx                # Monaco wrapper with line highlights
│
├── lib/
│   ├── parser.ts                 # web-tree-sitter WASM loader (JS/TS/Python grammars)
│   ├── analyzer/
│   │   ├── js.ts                 # JS/TS AST → GraphNodes + GraphEdges
│   │   └── python.ts             # Python AST → GraphNodes + GraphEdges
│   ├── instrumenter/
│   │   ├── js.ts                 # JS/TS source rewriter (inserts __evLog calls)
│   │   └── python.ts             # Python source rewriter (inserts __ev_log lines)
│   ├── executor/
│   │   ├── js.ts                 # new Function() sandbox + SSE serializer
│   │   └── python.ts             # Stub (runtime disabled)
│   ├── graph/
│   │   └── builder.ts            # Events → Frame[] (variable snapshots per step)
│   ├── ids.ts                    # Stable node ID generation
│   └── questions.ts              # Compiled problem bank (generated from SQL)
│
├── store/
│   └── execStore.ts              # Zustand: all client-side execution state
│
├── data/
│   └── insert_questions.sql      # Source data for the problem bank
├── scripts/
│   └── generate-questions.mjs    # Parses SQL → lib/questions.ts
└── __tests__/                    # Vitest: analyzer, instrumenter, executor, graph builder
```

---

## The execution pipeline

The core of the project is a **four-stage pipeline** that runs every time you click Compile.

### Stage 1 — Parse

The server loads language grammars through **web-tree-sitter** (WASM). Your source code is parsed into a concrete syntax tree (CST). Both the analyzer and instrumenter walk this same tree independently so parsing happens only once per request.

Supported languages: JavaScript, TypeScript (both via the JS grammar), Python (analysis and instrumentation only — runtime execution is currently JS-only).

---

### Stage 2 — Static Analysis (`POST /api/analyze`)

The analyzer walks the CST and emits a **control-flow graph (CFG)**:

- Every **function definition** → `fn_enter` node
- Every **loop** (for, while, for…of, for…in) → `loop_iter` node
- Every **if/else branch** → `branch` + `branch_else` node
- Every **variable declaration or assignment** → `var_assign` node
- Every **function call** → `call` node

Each node gets a **stable deterministic ID** generated from its tag type, its position in the source (indices), and its scope path. Edges are emitted to connect parent constructs to their children — a loop's body links to its containing function; a branch links to its parent block.

This graph is sent back to the client as `{ nodes, edges }` and rendered immediately in React Flow even before the code runs, giving you the structural skeleton of the program.

---

### Stage 3 — Instrumentation (`POST /api/instrument`)

The instrumenter takes the same CST and **rewrites the source** by inserting logging calls at every point the analyzer identified:

```js
// Original
function sum(arr) {
  let total = 0;
  for (let x of arr) {
    total += x;
  }
  return total;
}

// After instrumentation (simplified)
function sum(arr) {
  __evLog("fn_0", "fn_enter", undefined, "sum");
  let total = 0; __evLog("var_1", "var_assign", total, "total");
  for (let x of arr) {
    __evLog("loop_2", "loop_iter", undefined);
    __evLog("var_3", "var_assign", x, "x");
    total += x; __evLog("var_4", "var_assign", total, "total");
  }
  return total;
}
```

Each `__evLog` call carries:
- The **graph node ID** it corresponds to (linking runtime events back to the static graph)
- A **tag** describing the kind of event
- The **current value** of the relevant variable (deep-serialized, depth-limited)
- Optionally, the **variable name**

Call expressions are wrapped inline so the call node lights up at the right moment without disrupting return values. After member calls (e.g. `arr.push(x)`), the root object is re-logged so structural mutations are captured.

---

### Stage 4 — Execution & Streaming (`POST /api/run`)

The server executes the instrumented JavaScript using `new Function("__evLog", instrumentedCode)`. This sandbox approach means:

- No child process overhead — execution is synchronous and in-process
- `__evLog` is the **only** injection point; the rest of the code runs as normal JS
- Values are serialized with a **depth-limited, type-aware serializer** that handles `Map`, `Set`, circular-ish references, and large arrays safely before being sent as SSE payloads

The server streams log events as **Server-Sent Events** one by one:

```
data: {"id":"fn_0","tag":"fn_enter","name":"sum","seq":0}

data: {"id":"var_1","tag":"var_assign","data":0,"name":"total","seq":1}

data: {"id":"loop_2","tag":"loop_iter","seq":2}

...

data: {"id":"exit","tag":"process_exit","code":0,"seq":42}
```

The client reads this stream incrementally and appends each event to the store.

---

### Frame Building

Once the stream completes (or as events arrive), **`lib/graph/builder.ts`** converts the flat event list into a **`Frame[]`** array:

- Each frame has a **snapshot of all variables** as they existed at that point
- Each frame knows which **graph node is active**
- Variable state is accumulated forward: if `total` was last set at seq 5, it appears in all subsequent frames until overwritten

This frame array is what powers **scrubbing** — the timeline slider and step controls simply change the current frame index; nothing re-executes.

---

## Visualization layer

### Graph Canvas (Exec Flow mode)

The control-flow graph is rendered with **React Flow** (`@xyflow/react`). Layout is **deterministic and tree-structured**: nodes are placed based on their depth in the parent/child hierarchy and the order they appear in the source. There is no force-directed simulation — the same code always produces the same graph layout.

During playback:
- The **active node** (matching the current frame's `activeNodeId`) is highlighted
- The **previous node** is dimmed differently to show execution direction
- Edges light up to trace the path taken

### Structures (Beginner mode)

The beginner view skips the graph and instead shows:

1. **Human-readable step descriptions** derived from the current event tag and variable name
2. **Smart structure detection**: at each frame, every variable's value is analyzed by `detectDataStructure` using shape heuristics:
   - Has `.left` and `.right` → binary tree node → render as tree
   - Has `.next` → linked list node → render as linked list
   - Has `.adjacencyList` or `Map<node, neighbors[]>` shape → graph → render as adjacency list
   - Plain array → render as array with index labels
   - `Map` or `Set` → render as key/value or set entries
   - Everything else → JSON display
3. **Contained-variable filtering**: when a tree or graph is detected, variables that are reachable within that structure (e.g. a `node` that is a child of the root) are hidden from the top-level variable list to avoid duplication

---

## Problem bank

The app ships with **109 DSA problems** across categories:

- Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming, Sorting & Searching, Math, Stacks & Queues, Hashing, Heaps, Backtracking

Problems are defined in `data/insert_questions.sql` and compiled into `lib/questions.ts` via `scripts/generate-questions.mjs`. Each problem has:

- `title` and `description`
- Difficulty `level` (Easy / Medium / Hard)
- `tag` (category)
- `hint`
- `boilerplate` (starter code shown in Monaco)
- `test_cases` (JSON, used for display; not yet wired to auto-test on run)

To regenerate the question bank after editing the SQL:

```bash
node scripts/generate-questions.mjs data/insert_questions.sql
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Code editor | Monaco Editor (`@monaco-editor/react`) |
| Graph rendering | React Flow (`@xyflow/react`) |
| Parsing | web-tree-sitter (WASM grammars) |
| Client state | Zustand |
| Testing | Vitest + `@vitest/coverage-v8` |

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test          # run Vitest suite
npm run build     # production build
```

---

## Design principles

**Static graph first.** The control-flow graph is built from the AST without running any code. This means the graph is always available and accurate regardless of input — you see the program's structure before you see its behavior.

**Instrumentation over interpretation.** Rather than building a custom JS interpreter, the tool rewrites the source and runs it natively. This keeps the execution semantics identical to real JavaScript and handles complex constructs (closures, prototype methods, native APIs) for free.

**Streaming over batch.** Log events are streamed as SSE so the UI can start displaying results before execution finishes — important for loops with many iterations.

**Frame-based playback.** All interactivity (stepping, scrubbing) is implemented by indexing into a pre-built frame array. There is no re-execution on playback; the frame array is computed once from the event stream.

**Heuristic structure detection.** Data structure visualization is driven by object shape, not by type annotations or user hints. This is intentionally pragmatic: it works with idiomatic JS code without requiring any extra markup.

**Stable node IDs.** Graph node IDs are derived deterministically from the AST (tag + source position + scope path). This means the same code always produces the same IDs, so the analyzer and instrumenter — run in separate API calls — produce IDs that match each other without coordination.
