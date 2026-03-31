"use client";

import { detectKind, type DataStructureKind } from "@/lib/detectDataStructure";
import { filterContainedVars } from "@/lib/filterContainedVars";
import type { Frame } from "@/lib/types";
import { kindBadgeLabel, StructureViewer } from "@/components/StructureViewers";
import { Timeline } from "@/components/Timeline";

type BeginnerViewProps = {
  frame: Frame | undefined;
  prevFrame: Frame | undefined;
  currentFrame: number;
  totalFrames: number;
  onSeek: (index: number) => void;
};

type RankedVar = {
  name: string;
  value: unknown;
  kind: DataStructureKind;
  rank: number;
  changed: boolean;
};

const COMPLEXITY_RANK: Record<DataStructureKind, number> = {
  binary_tree: 0,
  tree: 0,
  graph: 0,
  linked_list: 1,
  array: 2,
  map: 2,
  set: 2,
  object: 3,
  primitive: 4,
  null: 5,
};

const FEATURED_KINDS = new Set<DataStructureKind>(["binary_tree", "tree", "graph"]);

function stableStringify(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function shortPreview(value: unknown): string {
  const text = stableStringify(value);
  return text.length > 60 ? `${text.slice(0, 57)}...` : text;
}

function eventDescription(frame: Frame | undefined): string {
  if (!frame) return "Compile the code and move the timeline to see variable changes step by step.";
  const { event } = frame;
  if (!event) return `Step ${frame.seq}`;
  switch (event.tag) {
    case "var_assign":
      return `${event.name ?? "variable"} <- ${shortPreview(event.data)}`;
    case "fn_enter":
      return `Entering function: ${event.name ?? event.id}`;
    case "fn_exit":
      return `Exiting function: ${event.name ?? event.id}`;
    case "loop_iter":
      return `Loop iteration (step ${event.seq})`;
    case "branch":
      return "Branch: condition was true";
    case "branch_else":
      return "Branch: took the else path";
    case "call":
      return `Calling: ${event.name ?? event.id}`;
    default:
      return `Step ${event.seq} (${event.tag})`;
  }
}

function hasChanged(name: string, value: unknown, prev: Record<string, unknown>): boolean {
  if (!(name in prev)) return true;
  return stableStringify(prev[name]) !== stableStringify(value);
}

function cardClass(kind: DataStructureKind): string {
  if (FEATURED_KINDS.has(kind)) {
    return "rounded border border-sky-600/50 bg-sky-950/20 p-3";
  }
  if (kind === "linked_list" || kind === "array" || kind === "map" || kind === "set") {
    return "rounded border border-zinc-700 bg-zinc-950/60 p-3";
  }
  if (kind === "object") {
    return "rounded border border-zinc-800 bg-zinc-950/40 p-2.5";
  }
  return "rounded border border-zinc-800/70 bg-zinc-950/30 p-2";
}

export function BeginnerView({
  frame,
  prevFrame,
  currentFrame,
  totalFrames,
  onSeek,
}: BeginnerViewProps) {
  const variables = frame?.variables ?? {};
  const displayVariables = filterContainedVars(variables);
  const prevVariables = prevFrame?.variables ?? {};

  const ranked = Object.entries(displayVariables)
    .map<RankedVar>(([name, value]) => {
      const kind = detectKind(value);
      return {
        name,
        value,
        kind,
        rank: COMPLEXITY_RANK[kind],
        changed: hasChanged(name, value, prevVariables),
      };
    })
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="shrink-0 rounded border border-zinc-800 bg-zinc-900 px-3 py-2">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">Current Step</div>
        <div className="text-sm leading-snug text-zinc-200">{eventDescription(frame)}</div>
        {frame && (
          <div className="mt-1 text-[11px] text-zinc-500">
            Step: {frame.seq} · {frame.event?.tag ?? "none"}
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded border border-zinc-800 bg-zinc-900 p-3">
        <h3 className="mb-2 shrink-0 text-sm font-semibold text-zinc-100">Variable Structures</h3>
        {ranked.length === 0 ? (
          <div className="text-xs text-zinc-400">No variable snapshots yet.</div>
        ) : (
          <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1">
            {ranked.map(({ name, value, kind, changed }) => (
              <div key={name} className={cardClass(kind)}>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-zinc-100">{name}</span>
                  <span className="rounded-full border border-zinc-600 bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-300">
                    {kindBadgeLabel(kind, value)}
                  </span>
                  {changed && (
                    <span className="rounded border border-amber-500/60 bg-amber-900/40 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
                      Updated
                    </span>
                  )}
                </div>
                {kind === "primitive" || kind === "null" ? (
                  <div className="text-sm text-zinc-200">{shortPreview(value)}</div>
                ) : (
                  <StructureViewer value={value} varName={name} prevValue={prevVariables[name]} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0">
        <Timeline current={currentFrame} total={totalFrames} onSeek={onSeek} />
      </div>
    </div>
  );
}
