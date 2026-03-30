"use client";

import { useEffect, useRef, useState } from "react";
import { Editor } from "@/components/Editor";
import { GraphCanvas } from "@/components/GraphCanvas";
import { ControlBar } from "@/components/ControlBar";
import { Timeline } from "@/components/Timeline";
import { VariablePanel } from "@/components/VariablePanel";
import { InstrumentedPanel } from "@/components/InstrumentedPanel";
import { LogPanel } from "@/components/LogPanel";
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

function formatTestCases(json: string): string {
  try {
    const parsed = JSON.parse(json) as unknown;
    return JSON.stringify(parsed, null, 2);
  } catch {
    return json;
  }
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

  const [hintOpen, setHintOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    setCode(question.boilerplate.endsWith("\n") ? question.boilerplate : `${question.boilerplate}\n`);
    setLanguage("javascript");
    setGraph([], []);
    resetRun();
    setInstrumentedCode(null);
    setHintOpen(false);
  }, [question.id, question.boilerplate, setCode, setLanguage, setGraph, resetRun, setInstrumentedCode]);

  const activeNodeId = frames[currentFrame]?.activeNodeId ?? null;
  const prevNodeId = frames[currentFrame - 1]?.activeNodeId ?? null;
  const activeNode = nodes.find((node) => node.id === activeNodeId);
  const highlightedLine = activeNode?.startLine;

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

  const analyze = async () => {
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
      return;
    }

    const data = (await analyzeRes.json()) as { nodes: typeof nodes; edges: typeof edges };
    setGraph(data.nodes ?? [], data.edges ?? []);

    if (instrumentRes.ok) {
      const instrData = (await instrumentRes.json()) as { instrumented?: string };
      setInstrumentedCode(instrData.instrumented ?? null);
    }

    showToast(`Analyze completed — ${data.nodes?.length ?? 0} nodes found`, "success");
  };

  const run = async () => {
    resetRun();
    const response = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });
    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as { error?: string };
      showToast(errorData.error ?? "Run failed", "error");
      return;
    }
    if (!response.body) {
      showToast("Run failed: missing response stream", "error");
      return;
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
    showToast("Run completed", "success");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm hover:bg-zinc-800"
          onClick={analyze}
        >
          Analyze
        </button>
        <button
          type="button"
          className="rounded border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm hover:bg-zinc-800"
          onClick={run}
        >
          Run
        </button>
        <ControlBar
          isPlaying={isPlaying}
          onPlayPause={() => setPlaying(!isPlaying)}
          onStepBack={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
          onStepForward={() => setCurrentFrame(Math.min(frames.length - 1, currentFrame + 1))}
        />
      </div>

      {/* Top: problem (left) + editor (right) */}
      <div className="grid min-h-[420px] flex-1 grid-cols-1 gap-3 lg:grid-cols-[minmax(280px,2fr)_minmax(360px,3fr)] lg:items-stretch">
        <aside className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 lg:max-h-none">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-mono text-sm text-zinc-400">{question.id}</span>
            <span className={`text-sm font-semibold ${levelClass(question.level)}`}>
              {levelLabel(question.level)}
            </span>
          </div>
          <h1 className="text-lg font-semibold text-zinc-50">{question.title}</h1>
          <p className="text-sm leading-relaxed text-zinc-300">{question.description}</p>

          {question.hint ? (
            <div className="rounded-md border border-zinc-700/80 bg-zinc-950/50">
              <button
                type="button"
                onClick={() => setHintOpen(!hintOpen)}
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
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">Boilerplate</h2>
            <pre className="max-h-40 overflow-auto rounded border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300">
              {question.boilerplate}
            </pre>
          </section>

          <section className="min-h-0 flex-1">
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">Test cases</h2>
            <pre className="max-h-48 overflow-auto rounded border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300">
              {formatTestCases(question.test_cases)}
            </pre>
          </section>
        </aside>

        <div className="flex min-h-[360px] flex-col rounded-lg border border-zinc-800 bg-zinc-950/30 lg:min-h-0">
          <Editor
            code={code}
            language={language}
            highlightedLine={highlightedLine}
            analyzedNodes={nodes.length > 0 ? nodes : undefined}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
          />
        </div>
      </div>

      {/* Visualizer + panels below */}
      <div className="flex min-h-0 flex-col gap-3">
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          activeNodeId={activeNodeId}
          prevNodeId={prevNodeId}
          variables={frames[currentFrame]?.variables ?? {}}
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

        {(instrumentedCode !== null || events.length > 0) && (
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
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
        <VariablePanel variables={frames[currentFrame]?.variables ?? {}} />
      </div>

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
