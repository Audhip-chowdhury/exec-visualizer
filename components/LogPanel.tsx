"use client";

import { useEffect, useRef } from "react";
import type { LogEvent } from "@/lib/types";

const TAG_STYLES: Record<string, string> = {
  fn_enter: "bg-violet-900/60 text-violet-200 border-violet-700/50",
  fn_exit: "bg-violet-900/30 text-violet-400 border-violet-800/40",
  loop_iter: "bg-blue-900/60 text-blue-200 border-blue-700/50",
  branch: "bg-yellow-900/60 text-yellow-200 border-yellow-700/50",
  var_assign: "bg-emerald-900/60 text-emerald-200 border-emerald-700/50",
  call: "bg-rose-900/60 text-rose-200 border-rose-700/50",
};

const TAG_LABELS: Record<string, string> = {
  fn_enter: "fn enter",
  fn_exit: "fn exit",
  loop_iter: "loop",
  branch: "branch",
  var_assign: "assign",
  call: "call",
};

interface LogPanelProps {
  events: LogEvent[];
  currentSeq: number | null;
}

export function LogPanel({ events, currentSeq }: LogPanelProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events.length]);

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Log Events</h2>
        <span className="text-xs text-zinc-500">{events.length} event{events.length !== 1 ? "s" : ""}</span>
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto rounded border border-zinc-700 bg-zinc-900 p-2 font-mono text-xs"
        style={{ minHeight: 0, maxHeight: "440px" }}
      >
        {events.length === 0 ? (
          <p className="text-zinc-600 italic py-2 text-center">No events yet — click Run.</p>
        ) : (
          events.map((event) => {
            const isActive = event.seq === currentSeq;
            const tagStyle = TAG_STYLES[event.tag] ?? "bg-zinc-800 text-zinc-300 border-zinc-700";
            return (
              <div
                key={event.seq}
                className={`flex items-start gap-2 rounded px-2 py-1 mb-0.5 border transition-colors ${
                  isActive
                    ? "bg-zinc-700/70 border-zinc-500"
                    : "border-transparent hover:bg-zinc-800/60"
                }`}
              >
                <span className="shrink-0 w-8 text-right text-zinc-600">{event.seq}</span>
                <span className={`shrink-0 rounded border px-1.5 py-0 text-[10px] font-semibold ${tagStyle}`}>
                  {TAG_LABELS[event.tag] ?? event.tag}
                </span>
                <span className="truncate text-zinc-400 text-[11px]">{event.id}</span>
                {event.data !== undefined && (
                  <span className="ml-auto shrink-0 text-zinc-300 text-[11px]">
                    = {JSON.stringify(event.data)}
                  </span>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
