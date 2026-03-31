"use client";

import { useEffect, useRef, useState } from "react";
import { Editor } from "@/components/Editor";
import { GraphCanvas } from "@/components/GraphCanvas";
import { ControlBar } from "@/components/ControlBar";
import { Timeline } from "@/components/Timeline";
import { VariablePanel } from "@/components/VariablePanel";
import { InstrumentedPanel } from "@/components/InstrumentedPanel";
import { LogPanel } from "@/components/LogPanel";
import { BeginnerView } from "@/components/BeginnerView";
import { useExecStore } from "@/store";
import type { Question, QuestionLevel } from "@/lib/questions";
import type { LogEvent } from "@/lib/types";

type Toast = {
  id: string;
  message: string;
  variant: "success" | "error";
};

function levelLabel(level: QuestionLevel): string {
  if (level === "easy") return "Easy";
  if (level === "medium") return "Medium";
  return "Hard";
}

function levelClass(level: QuestionLevel): string {
  if (level === "easy") return "text-emerald-400";
  if (level === "medium") return "text-amber-400";
  return "text-red-400";
}

function prettyValue(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

function asLinkedList(value: unknown): string | null {
  if (value === null) return "null";
  if (!Array.isArray(value)) return null;
  if (value.length === 0) return "NULL";
  return `${value.map((x) => `[${prettyValue(x)}]`).join("->")}->NULL`;
}

function asLinearArray(value: unknown): string | null {
  if (!Array.isArray(value)) return null;
  return `[${value.map((x) => prettyValue(x)).join(", ")}]`;
}

function asTreeLevelOrder(value: unknown): string | null {
  if (!Array.isArray(value)) return null;
  if (value.length === 0) return "empty";
  return value
    .map((node, i) => `${i}:${node === null ? "null" : prettyValue(node)}`)
    .join(" | ");
}

function prettyInputByTag(rawInput: unknown, tag: string): string {
  if (tag === "Linked List") {
    if (Array.isArray(rawInput) && rawInput.length > 0) {
      const primary = asLinkedList(rawInput[0]);
      if (rawInput.length === 1 && primary !== null) return primary;
      const rest = rawInput.slice(1).map((x) => prettyValue(x)).join(", ");
      return primary === null ? prettyValue(rawInput) : `${primary}${rest ? `, ${rest}` : ""}`;
    }
    return asLinkedList(rawInput) ?? prettyValue(rawInput);
  }

  if (tag === "Binary Tree" || tag === "BST") {
    if (Array.isArray(rawInput) && rawInput.length > 0 && Array.isArray(rawInput[0])) {
      return `level-order: ${asTreeLevelOrder(rawInput[0])}`;
    }
    return `level-order: ${asTreeLevelOrder(rawInput) ?? prettyValue(rawInput)}`;
  }

  if (tag === "Graphs") {
    if (Array.isArray(rawInput)) {
      return rawInput.map((part, i) => `arg${i + 1}=${prettyValue(part)}`).join("; ");
    }
    return prettyValue(rawInput);
  }

  if (Array.isArray(rawInput)) {
    return rawInput
      .map((part, i) => {
        const arr = asLinearArray(part);
        return `arg${i + 1}=${arr ?? prettyValue(part)}`;
      })
      .join("; ");
  }

  return prettyValue(rawInput);
}

function formatTestCasesAscii(json: string, tag: string): string {
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed)) return json;

    const title = `--- All Test Cases (${tag}) ---`;
    const rows = parsed.map((entry, index) => {
      const test = entry as Record<string, unknown>;
      const tc = index + 1;
      const input = prettyInputByTag(test.input ?? null, tag);
      const expected = prettyValue(test.expected ?? null);
      const note = test.note ? String(test.note) : "-";
      return [
        `TC${tc}: ${input}  =>  ${expected}`,
        "",
        `TC${tc} (${tag.toLowerCase()}):`,
        `  In : ${input}`,
        `  Out: ${expected}`,
        `  Note: ${note}`,
      ].join("\n");
    });
    return [title, ...rows].join("\n\n");
  } catch {
    return json;
  }
}

function getConstraints(level: QuestionLevel): string[] {
  if (level === "easy") {
    return [
      "1 <= input size <= 10^3",
      "Values are within a standard 32-bit integer range",
      "Aim for a straightforward iterative solution",
    ];
  }
  if (level === "medium") {
    return [
      "1 <= input size <= 10^5",
      "Solution should avoid nested full scans where possible",
      "Prefer linear or near-linear runtime",
    ];
  }
  return [
    "1 <= input size <= 2 * 10^5",
    "Optimize both runtime and auxiliary memory usage",
    "Brute-force approaches will likely time out",
  ];
}

function getExpectedComplexity(tag: string): { time: string; space: string } {
  const byTag: Record<string, { time: string; space: string }> = {
    Arrays: { time: "O(n)", space: "O(1) to O(n)" },
    "Linked List": { time: "O(n)", space: "O(1)" },
    "Stack & Queue": { time: "O(n)", space: "O(n)" },
    Strings: { time: "O(n)", space: "O(n)" },
    "Binary Search": { time: "O(log n)", space: "O(1)" },
    Recursion: { time: "O(n) to O(2^n)", space: "O(n) stack" },
    Backtracking: { time: "Exponential", space: "O(n) to O(n^2)" },
    Greedy: { time: "O(n) to O(n log n)", space: "O(1) to O(n)" },
    Heaps: { time: "O(n log n)", space: "O(n)" },
    "Binary Tree": { time: "O(n)", space: "O(h) to O(n)" },
    BST: { time: "O(h) average, O(n) worst", space: "O(h)" },
    "Dynamic Programming": { time: "O(n) to O(n^2)", space: "O(n) to O(n^2)" },
    Trie: { time: "O(L)", space: "O(total characters)" },
    "Sorting Algorithms": { time: "O(n log n)", space: "O(1) to O(n)" },
    "Two Pointers": { time: "O(n)", space: "O(1)" },
    "Sliding Window": { time: "O(n)", space: "O(1) to O(k)" },
    Hashing: { time: "O(n) average", space: "O(n)" },
    "Math & Basic Problems": { time: "O(n) or O(sqrt n)", space: "O(1)" },
    Graphs: { time: "O(V + E)", space: "O(V)" },
  };
  return byTag[tag] ?? { time: "O(n log n)", space: "O(n)" };
}

export function ProblemView({ question }: { question: Question }) {
  const {
    code,
    language,
    nodes,
    edges,
    events,
    frames,
    currentFrame,
    isPlaying,
    instrumentedCode,
    setCode,
    setLanguage,
    setGraph,
    appendEvent,
    rebuildFrames,
    setCurrentFrame,
    setPlaying,
    resetRun,
    setInstrumentedCode,
  } = useExecStore();

  const [hintOpenForId, setHintOpenForId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"beginner" | "advanced">("beginner");
  const [questionOpen, setQuestionOpen] = useState(true);
  /** Collapse bottom run/viz panel when no analysis yet — more room to code */
  const [runViewMinimized, setRunViewMinimized] = useState(true);
  const [pipelineBusy, setPipelineBusy] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    setCode(question.boilerplate.endsWith("\n") ? question.boilerplate : `${question.boilerplate}\n`);
    setLanguage("javascript");
    setGraph([], []);
    resetRun();
    setInstrumentedCode(null);
    setQuestionOpen(true);
    setRunViewMinimized(true);
    setPipelineBusy(false);
  }, [question.id, question.boilerplate, setCode, setLanguage, setGraph, resetRun, setInstrumentedCode]);

  const hintOpen = hintOpenForId === question.id;
  const constraints = getConstraints(question.level);
  const expectedComplexity = getExpectedComplexity(question.tag);

  const activeNodeId = frames[currentFrame]?.activeNodeId ?? null;
  const prevNodeId = frames[currentFrame - 1]?.activeNodeId ?? null;
  const frame = frames[currentFrame];
  const prevFrame = frames[currentFrame - 1];
  const activeNode = nodes.find((node) => node.id === activeNodeId);
  const highlightedLine = activeNode?.startLine;

  const hasFrames = frames.length > 0;
  const hasAnalysis = nodes.length > 0;

  useEffect(() => {
    if (!isPlaying || frames.length === 0) return;
    const timer = setInterval(() => {
      const next = useExecStore.getState().currentFrame + 1;
      if (next >= useExecStore.getState().frames.length) {
        useExecStore.getState().setPlaying(false);
        return;
      }
      useExecStore.getState().setCurrentFrame(next);
    }, 500);
    return () => clearInterval(timer);
  }, [isPlaying, frames.length]);

  useEffect(() => {
    return () => {
      for (const timer of toastTimersRef.current.values()) clearTimeout(timer);
      toastTimersRef.current.clear();
    };
  }, []);

  const showToast = (message: string, variant: Toast["variant"]) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      toastTimersRef.current.delete(id);
    }, 2500);
    toastTimersRef.current.set(id, timer);
  };

  /** Static analysis + instrumenter. Returns false if analyze API failed. */
  const performAnalyze = async (quietSuccess?: boolean): Promise<boolean> => {
    const payload = JSON.stringify({ code, language });
    const [analyzeRes, instrumentRes] = await Promise.all([
      fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      }),
      fetch("/api/instrument", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      }),
    ]);

    if (!analyzeRes.ok) {
      const errorData = (await analyzeRes.json().catch(() => ({}))) as { error?: string };
      showToast(errorData.error ?? "Analyze failed", "error");
      return false;
    }

    const data = (await analyzeRes.json()) as { nodes: typeof nodes; edges: typeof edges };
    setGraph(data.nodes ?? [], data.edges ?? []);
    setRunViewMinimized(false);

    if (instrumentRes.ok) {
      const instrData = (await instrumentRes.json()) as { instrumented?: string };
      setInstrumentedCode(instrData.instrumented ?? null);
    }

    if (!quietSuccess) {
      showToast(`Analyze completed — ${data.nodes?.length ?? 0} nodes found`, "success");
    }
    return true;
  };

  /** Execute instrumented code and stream log events. */
  const performRun = async (quietSuccess?: boolean): Promise<boolean> => {
    resetRun();
    setQuestionOpen(false);
    const response = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });
    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as { error?: string };
      showToast(errorData.error ?? "Run failed", "error");
      return false;
    }
    if (!response.body) {
      showToast("Run failed: missing response stream", "error");
      return false;
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() ?? "";
      for (const chunk of chunks) {
        const line = chunk
          .split("\n")
          .find((entry) => entry.startsWith("data: "))
          ?.slice(6);
        if (!line) continue;
        const parsed = JSON.parse(line) as Record<string, unknown>;
        if (parsed.tag === "stderr") {
          showToast(`Runtime error: ${String(parsed.data)}`, "error");
          continue;
        }
        if (parsed.id && typeof parsed.seq === "number") {
          appendEvent(parsed as unknown as LogEvent);
        }
      }
    }
    rebuildFrames();
    if (!quietSuccess) {
      showToast("Compile finished", "success");
    }
    return true;
  };

  const analyzeAndRun = async () => {
    setPipelineBusy(true);
    try {
      if (!(await performAnalyze(true))) return;
      const ranOk = await performRun(true);
      if (!ranOk) return;
      const n = useExecStore.getState().nodes.length;
      showToast(`Compile finished — ${n} flow nodes`, "success");
    } finally {
      setPipelineBusy(false);
    }
  };

  const questionAside = (
    <aside className="flex min-h-0 min-w-0 flex-col gap-3 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="font-mono text-sm text-zinc-400">{question.id}</span>
        <span className={`text-sm font-semibold ${levelClass(question.level)}`}>
          {levelLabel(question.level)}
        </span>
      </div>
      <h1 className="text-lg font-semibold text-zinc-50">{question.title}</h1>
      <p className="text-sm leading-relaxed text-zinc-300">{question.description}</p>

      <section>
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Explanation
        </h2>
        <p className="rounded border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300">
          {question.hint ??
            "Build a valid solution from the problem statement and verify with the sample test cases."}
        </p>
      </section>

      {question.hint ? (
        <div className="rounded-md border border-zinc-700/80 bg-zinc-950/50">
          <button
            type="button"
            onClick={() => setHintOpenForId(hintOpen ? null : question.id)}
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-zinc-200 hover:bg-zinc-800/50"
          >
            <span>Hint</span>
            <span className="text-zinc-500">{hintOpen ? "−" : "+"}</span>
          </button>
          {hintOpen && (
            <p className="border-t border-zinc-800 px-3 py-2 text-sm text-zinc-400">{question.hint}</p>
          )}
        </div>
      ) : null}

      <section>
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Constraints
        </h2>
        <ul className="space-y-1 rounded border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300">
          {constraints.map((constraint) => (
            <li key={constraint}>- {constraint}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Expected complexity
        </h2>
        <div className="rounded border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300">
          <p>Time: {expectedComplexity.time}</p>
          <p>Space: {expectedComplexity.space}</p>
        </div>
      </section>

      <section className="min-h-0 flex-1">
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Test cases (ASCII visual)
        </h2>
        <pre className="max-h-48 overflow-auto rounded border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300">
          {formatTestCasesAscii(question.test_cases, question.tag)}
        </pre>
      </section>
    </aside>
  );

  const editorPanel = (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/30">
      <Editor
        code={code}
        language={language}
        highlightedLine={highlightedLine}
        analyzedNodes={nodes.length > 0 ? nodes : undefined}
        onCodeChange={setCode}
        onLanguageChange={setLanguage}
      />
    </div>
  );

  const visualizerBlock =
    viewMode === "beginner" ? (
      <BeginnerView
        frame={frame}
        prevFrame={prevFrame}
        currentFrame={currentFrame}
        totalFrames={frames.length}
        onSeek={setCurrentFrame}
      />
    ) : (
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden">
        <div className="min-h-0 min-w-0 flex-[3] overflow-hidden">
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            activeNodeId={activeNodeId}
            prevNodeId={prevNodeId}
            variables={frames[currentFrame]?.variables ?? {}}
            prevVariables={frames[Math.max(0, currentFrame - 1)]?.variables ?? {}}
            playback={{
              isPlaying,
              currentFrame,
              totalFrames: frames.length,
              onPlayPause: () => setPlaying(!isPlaying),
              onStepBack: () => setCurrentFrame(Math.max(0, currentFrame - 1)),
              onStepForward: () => setCurrentFrame(Math.min(frames.length - 1, currentFrame + 1)),
              onSeek: setCurrentFrame,
            }}
          />
        </div>

        <div className="flex min-h-0 min-w-0 flex-[2] flex-col gap-3 overflow-y-auto pr-1">
          {(instrumentedCode !== null || events.length > 0) && (
            <div className="grid shrink-0 grid-cols-1 gap-3 xl:grid-cols-2">
              {instrumentedCode !== null && (
                <InstrumentedPanel code={instrumentedCode} language={language} />
              )}
              {events.length > 0 && (
                <LogPanel
                  events={events}
                  currentSeq={frames[currentFrame]?.event?.seq ?? null}
                />
              )}
            </div>
          )}

          <Timeline current={currentFrame} total={frames.length} onSeek={setCurrentFrame} />
          <VariablePanel
            variables={frames[currentFrame]?.variables ?? {}}
            prevVariables={frames[Math.max(0, currentFrame - 1)]?.variables ?? {}}
          />
        </div>
      </div>
    );

  const vizColumn = (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      {visualizerBlock}
    </div>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-4">
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {hasFrames ? (
          <button
            type="button"
            className={`rounded border px-3 py-1 text-sm ${
              questionOpen
                ? "border-sky-500/70 bg-sky-900/40 text-sky-100"
                : "border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
            }`}
            onClick={() => setQuestionOpen((open) => !open)}
          >
            Question
          </button>
        ) : null}
        {hasFrames ? <div className="mx-1 h-6 w-px bg-zinc-700" /> : null}
        <button
          type="button"
          className={`rounded border px-3 py-1 text-sm ${
            viewMode === "beginner"
              ? "border-sky-500/70 bg-sky-900/40 text-sky-100"
              : "border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
          }`}
          onClick={() => setViewMode("beginner")}
        >
          Structures
        </button>
        <button
          type="button"
          className={`rounded border px-3 py-1 text-sm ${
            viewMode === "advanced"
              ? "border-sky-500/70 bg-sky-900/40 text-sky-100"
              : "border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
          }`}
          onClick={() => setViewMode("advanced")}
        >
          Exec Flow (Advanced)
        </button>
        <div className="mx-1 h-6 w-px bg-zinc-700" />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            title="Analyze, instrument, and execute the code"
            disabled={pipelineBusy}
            className="rounded border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={analyzeAndRun}
          >
            {pipelineBusy ? "Compiling…" : "Compile"}
          </button>
          <div className="h-6 w-px bg-zinc-700" />
          <ControlBar
            isPlaying={isPlaying}
            onPlayPause={() => setPlaying(!isPlaying)}
            onStepBack={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
            onStepForward={() => setCurrentFrame(Math.min(frames.length - 1, currentFrame + 1))}
          />
        </div>
      </div>

      {hasFrames && !questionOpen ? (
        <div className="flex min-w-0 shrink-0 items-baseline gap-2 border-b border-zinc-800 pb-2">
          <span className="shrink-0 font-mono text-xs text-zinc-400">{question.id}</span>
          <h2 className="min-w-0 truncate text-sm font-semibold text-zinc-50" title={question.title}>
            {question.title}
          </h2>
        </div>
      ) : null}

      {!hasFrames ? (
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
          <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)] gap-3 overflow-hidden lg:grid-cols-[minmax(280px,2fr)_minmax(360px,3fr)]">
            {questionAside}
            {editorPanel}
          </div>
          {!hasAnalysis ? (
            <button
              type="button"
              onClick={() => setRunViewMinimized((v) => !v)}
              className="flex w-full shrink-0 items-center justify-center gap-2 rounded border border-zinc-700 bg-zinc-900/80 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
            >
              <span className="text-zinc-400">{runViewMinimized ? "▼" : "▲"}</span>
              <span>{runViewMinimized ? "Show execution preview" : "Hide execution preview"}</span>
              <span className="hidden text-zinc-500 sm:inline">— graph, timeline, run output</span>
            </button>
          ) : null}
          {hasAnalysis || !runViewMinimized ? (
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              {vizColumn}
            </div>
          ) : null}
        </div>
      ) : (
        <div
          className={`grid min-h-0 min-w-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)] gap-3 overflow-hidden lg:items-stretch ${
            questionOpen
              ? "lg:grid-cols-[minmax(260px,1.2fr)_minmax(280px,1.8fr)_minmax(320px,2.5fr)]"
              : "lg:grid-cols-[minmax(320px,2fr)_minmax(360px,3fr)]"
          }`}
        >
          {questionOpen ? questionAside : null}
          {editorPanel}
          {vizColumn}
        </div>
      )}

      <div className="pointer-events-none fixed right-4 top-14 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded border px-3 py-2 text-sm shadow-lg ${
              toast.variant === "success"
                ? "border-emerald-500/60 bg-emerald-900/80 text-emerald-100"
                : "border-red-500/60 bg-red-900/80 text-red-100"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
