"use client";

import { useState, useMemo, type ReactNode } from "react";
import {
  detectKind,
  primitiveLabel,
  type DataStructureKind,
} from "@/lib/detectDataStructure";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nodeLabel(v: unknown): string {
  if (v === null || v === undefined) return String(v);
  if (typeof v === "object") return "{…}";
  const s = String(v);
  return s.length > 10 ? `${s.slice(0, 9)}…` : s;
}

// ─── Primitive ────────────────────────────────────────────────────────────────

export function PrimitiveViewer({ value }: { value: unknown }) {
  const text =
    typeof value === "string"
      ? JSON.stringify(value)
      : value === undefined
        ? "undefined"
        : value === null
          ? "null"
          : String(value);
  return (
    <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-zinc-200">{text}</span>
  );
}

// ─── Array ────────────────────────────────────────────────────────────────────

export function ArrayViewer({ value }: { value: unknown[] }) {
  return (
    <div className="flex max-w-full gap-1 overflow-x-auto pb-1">
      {value.map((item, i) => (
        <div
          key={i}
          className="flex shrink-0 flex-col items-center gap-0.5 rounded border border-zinc-700 bg-zinc-800/80 px-2 py-1"
        >
          <span className="text-[10px] font-medium text-zinc-500">[{i}]</span>
          <div className="text-xs">
            <ValueInline value={item} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ValueInline({ value }: { value: unknown }) {
  const kind = detectKind(value);
  if (kind === "primitive" || kind === "null") return <PrimitiveViewer value={value} />;
  if (kind === "array") return <span className="text-zinc-400">Array({(value as unknown[]).length})</span>;
  if (kind === "map") {
    const m = value as { entries: unknown[] };
    return <span className="text-zinc-400">Map({m.entries.length})</span>;
  }
  if (kind === "set") {
    const s = value as { values: unknown[] };
    return <span className="text-zinc-400">Set({s.values.length})</span>;
  }
  return <span className="text-zinc-400">{kind}</span>;
}

// ─── Object ───────────────────────────────────────────────────────────────────

export function ObjectViewer({ value, depth = 0 }: { value: Record<string, unknown>; depth?: number }) {
  const keys = Object.keys(value);
  const [open, setOpen] = useState(depth < 2);
  if (keys.length === 0) return <span className="text-zinc-500">{`{}`}</span>;
  return (
    <div className="rounded border border-zinc-700/80 bg-zinc-900/50">
      <button
        type="button"
        className="flex w-full items-center gap-1 px-2 py-1 text-left text-[11px] text-zinc-400 hover:bg-zinc-800/50"
        onClick={() => setOpen(!open)}
      >
        <span className="text-zinc-500">{open ? "▼" : "▶"}</span>
        <span>{keys.length} keys</span>
      </button>
      {open && (
        <ul className="space-y-1 border-t border-zinc-800 px-2 py-2 text-xs">
          {keys.map((k) => (
            <li key={k} className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
              <span className="font-mono text-emerald-400/90">{k}</span>
              <div className="min-w-0">
                <NestedValue value={value[k]} depth={depth + 1} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NestedValue({ value, depth }: { value: unknown; depth: number }) {
  const kind = detectKind(value);
  if (kind === "primitive" || kind === "null") return <PrimitiveViewer value={value} />;
  if (kind === "array") return <ArrayViewer value={value as unknown[]} />;
  if (kind === "binary_tree") return <BinaryTreeViewer value={value} />;
  if (kind === "linked_list") return <LinkedListViewer value={value} />;
  if (kind === "tree") return <TreeViewer value={value as Record<string, unknown>} />;
  if (kind === "map") {
    const m = value as { entries: [unknown, unknown][] };
    return <MapViewer entries={m.entries} />;
  }
  if (kind === "set") {
    const s = value as { values: unknown[] };
    return <SetViewer values={s.values} />;
  }
  if (isPlainObject(value)) return <ObjectViewer value={value} depth={depth} />;
  return <span className="text-zinc-500">{String(value)}</span>;
}

// ─── Binary Tree ──────────────────────────────────────────────────────────────
// Uses inorder traversal to assign x positions (Reingold-Tilford style):
// left subtree first, then root, then right subtree — so the root always sits
// horizontally between its children.

type BinEntry = { id: string; x: number; y: number; label: string; leftId?: string; rightId?: string };

function buildBinaryLayout(root: unknown): BinEntry[] {
  const entries: BinEntry[] = [];
  let xC = 0, idC = 0;

  function walk(n: unknown, depth: number): string | null {
    if (n === null || n === undefined) return null;
    if (!isPlainObject(n)) return null;
    const id = `b${idC++}`;
    const leftId = walk(n.left, depth + 1);
    const x = xC++;
    const rightId = walk(n.right, depth + 1);
    const v = "val" in n ? n.val : "value" in n ? n.value : "data" in n ? n.data : "key" in n ? n.key : null;
    entries.push({ id, x, y: depth, label: nodeLabel(v), leftId: leftId ?? undefined, rightId: rightId ?? undefined });
    return id;
  }

  walk(root, 0);
  return entries;
}

export function BinaryTreeViewer({ value }: { value: unknown }) {
  if (!isPlainObject(value)) return <PrimitiveViewer value={value} />;
  const entries = buildBinaryLayout(value);
  if (entries.length === 0) return <span className="text-zinc-500">empty tree</span>;

  const R = 20;    // circle radius
  const CW = 64;   // horizontal slot width per inorder position
  const CH = 72;   // vertical slot height per depth level
  const PAD = 24;

  const maxX = Math.max(...entries.map((e) => e.x));
  const maxY = Math.max(...entries.map((e) => e.y));
  const svgW = (maxX + 1) * CW + PAD * 2;
  const svgH = (maxY + 1) * CH + PAD * 2;

  const cx = (x: number) => PAD + x * CW + CW / 2;
  const cy = (y: number) => PAD + y * CH + R;

  const byId = new Map(entries.map((e) => [e.id, e]));

  const edges: ReactNode[] = [];
  for (const e of entries) {
    for (const childId of [e.leftId, e.rightId]) {
      if (!childId) continue;
      const c = byId.get(childId);
      if (!c) continue;
      const x0 = cx(e.x), y0 = cy(e.y);
      const x1 = cx(c.x), y1 = cy(c.y);
      const my = (y0 + y1) / 2;
      edges.push(
        <path
          key={`${e.id}-${childId}`}
          d={`M ${x0} ${y0 + R} C ${x0} ${my} ${x1} ${my} ${x1} ${y1 - R}`}
          stroke="#4b5563"
          strokeWidth={1.5}
          fill="none"
        />,
      );
    }
  }

  return (
    <div className="max-w-full overflow-x-auto rounded border border-zinc-800 bg-zinc-950/80 p-1">
      <svg width={svgW} height={svgH} className="block">
        {edges}
        {entries.map((e) => (
          <g key={e.id} transform={`translate(${cx(e.x)}, ${cy(e.y)})`}>
            <circle r={R} fill="#1e1b4b" stroke="#6366f1" strokeWidth={1.5} />
            <text
              x={0}
              y={5}
              textAnchor="middle"
              fill="#c7d2fe"
              fontSize={12}
              fontFamily="ui-monospace, monospace"
            >
              {e.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── Linked List ──────────────────────────────────────────────────────────────
// Horizontal chain of boxes connected by pointer arrows, terminated by ∅.

export function LinkedListViewer({ value }: { value: unknown }) {
  type LLNode = { label: string };
  const nodes: LLNode[] = [];
  let cur: unknown = value;
  const seen = new Set<unknown>();
  let hasCycle = false;

  while (cur != null && nodes.length < 100) {
    if (!isPlainObject(cur)) break;
    if (seen.has(cur)) { hasCycle = true; break; }
    seen.add(cur);
    const v = "val" in cur ? cur.val : "value" in cur ? cur.value : "data" in cur ? cur.data : null;
    nodes.push({ label: nodeLabel(v ?? "·") });
    if ((cur.next as unknown) == null) break;
    cur = cur.next;
  }

  if (nodes.length === 0) return <span className="text-zinc-500">empty list</span>;

  const NW = 42, NH = 30, AW = 28, PAD = 10, RX = 5;
  const UNIT = NW + AW;
  const midY = PAD + NH / 2;
  const svgW = PAD * 2 + nodes.length * UNIT + (hasCycle ? 50 : 22);
  const svgH = NH + PAD * 2;

  // Inline arrowhead triangle pointing right at (tx, ty)
  const arrowHead = (tx: number, ty: number, key: string) => (
    <polygon
      key={key}
      points={`${tx - 7},${ty - 4} ${tx},${ty} ${tx - 7},${ty + 4}`}
      fill="#6366f1"
    />
  );

  return (
    <div className="max-w-full overflow-x-auto rounded border border-zinc-800 bg-zinc-950/80 p-1">
      <svg width={svgW} height={svgH} className="block">
        {nodes.map((node, i) => {
          const nx = PAD + i * UNIT;
          const ax2 = nx + UNIT; // arrow endpoint x
          return (
            <g key={i}>
              <rect x={nx} y={PAD} width={NW} height={NH} rx={RX} fill="#1e1b4b" stroke="#6366f1" strokeWidth={1.5} />
              <text
                x={nx + NW / 2}
                y={midY + 4}
                textAnchor="middle"
                fill="#c7d2fe"
                fontSize={11}
                fontFamily="ui-monospace, monospace"
              >
                {node.label}
              </text>
              {/* pointer line + arrowhead */}
              <line x1={nx + NW} y1={midY} x2={ax2 - 7} y2={midY} stroke="#6366f1" strokeWidth={1.2} />
              {arrowHead(ax2, midY, `ah-${i}`)}
            </g>
          );
        })}
        {/* null / cycle terminator */}
        {hasCycle ? (
          <text
            x={PAD + nodes.length * UNIT + 4}
            y={midY + 4}
            fill="#f59e0b"
            fontSize={10}
          >
            (↩ cycle)
          </text>
        ) : (
          <text
            x={PAD + nodes.length * UNIT + 4}
            y={midY + 5}
            fill="#4b5563"
            fontSize={20}
            fontFamily="serif"
          >
            ∅
          </text>
        )}
      </svg>
    </div>
  );
}

// ─── N-ary Tree ───────────────────────────────────────────────────────────────
// Reingold-Tilford–style layout: leaves get sequential x slots; parents center
// over their children.  Bezier curves connect parent bottom to child top.

type NaryEntry = { id: string; cx: number; y: number; label: string; parentId?: string };

const NARY_NW = 52;
const NARY_NH = 26;
const NARY_SLOT = NARY_NW + 14; // slot width per leaf
const NARY_LEVEL_H = 64;

function buildNaryLayout(root: Record<string, unknown>): { entries: NaryEntry[]; svgW: number; svgH: number } {
  const entries: NaryEntry[] = [];
  let leafC = 0, idC = 0;

  function slots(n: unknown): number {
    if (!isPlainObject(n)) return 1;
    const ch = Array.isArray(n.children) ? (n.children as unknown[]) : [];
    if (ch.length === 0) return 1;
    return ch.reduce((s: number, c: unknown) => s + slots(c), 0);
  }

  function place(n: unknown, startSlot: number, depth: number, parentId?: string): void {
    if (!isPlainObject(n) || idC > 200) return;
    const id = `t${idC++}`;
    const ch = Array.isArray(n.children) ? (n.children as unknown[]) : [];
    const v = "val" in n ? n.val : "value" in n ? n.value : "data" in n ? n.data : "name" in n ? n.name : "key" in n ? n.key : null;

    let cx: number;
    if (ch.length === 0) {
      cx = (leafC + 0.5) * NARY_SLOT;
      leafC++;
    } else {
      const first = leafC;
      let s = startSlot;
      for (const c of ch) {
        const cSlots = slots(c);
        place(c, s, depth + 1, id);
        s += cSlots;
      }
      const last = leafC;
      cx = ((first + last) / 2) * NARY_SLOT;
    }
    entries.push({ id, cx, y: depth * NARY_LEVEL_H, label: nodeLabel(v), parentId });
  }

  place(root, 0, 0);

  const maxCx = entries.length > 0 ? Math.max(...entries.map((e) => e.cx)) : 0;
  const maxY = entries.length > 0 ? Math.max(...entries.map((e) => e.y)) : 0;
  return {
    entries,
    svgW: maxCx + NARY_NW / 2 + 16,
    svgH: maxY + NARY_NH + 16,
  };
}

export function TreeViewer({ value }: { value: Record<string, unknown> }) {
  const { entries, svgW, svgH } = buildNaryLayout(value);
  if (entries.length === 0) return <span className="text-zinc-500">empty tree</span>;

  const byId = new Map(entries.map((e) => [e.id, e]));

  const edges: ReactNode[] = entries
    .filter((e) => e.parentId)
    .map((e) => {
      const p = byId.get(e.parentId!);
      if (!p) return null;
      const x0 = p.cx, y0 = p.y + NARY_NH;
      const x1 = e.cx, y1 = e.y;
      const my = (y0 + y1) / 2;
      return (
        <path
          key={e.id}
          d={`M ${x0} ${y0} C ${x0} ${my} ${x1} ${my} ${x1} ${y1}`}
          stroke="#4b5563"
          strokeWidth={1.5}
          fill="none"
        />
      );
    });

  return (
    <div className="max-w-full overflow-x-auto rounded border border-zinc-800 bg-zinc-950/80 p-1">
      <svg width={svgW} height={svgH} className="block">
        {edges}
        {entries.map((e) => (
          <g key={e.id} transform={`translate(${e.cx}, ${e.y})`}>
            <rect
              x={-NARY_NW / 2}
              y={0}
              width={NARY_NW}
              height={NARY_NH}
              rx={5}
              fill="#1e1b4b"
              stroke="#6366f1"
              strokeWidth={1.5}
            />
            <text
              x={0}
              y={NARY_NH / 2 + 4}
              textAnchor="middle"
              fill="#c7d2fe"
              fontSize={11}
              fontFamily="ui-monospace, monospace"
            >
              {e.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── Map ──────────────────────────────────────────────────────────────────────
// Two-column table: Key | Value

export function MapViewer({ entries }: { entries: [unknown, unknown][] }) {
  if (entries.length === 0) return <span className="text-zinc-500">empty Map</span>;
  return (
    <div className="max-w-full overflow-x-auto rounded border border-zinc-700 bg-zinc-900/50 text-xs">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-zinc-700 bg-zinc-800/70">
            <th className="px-2 py-1 text-left font-medium text-zinc-400">Key</th>
            <th className="px-2 py-1 text-left font-medium text-zinc-400">Value</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([k, v], i) => (
            <tr key={i} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/30">
              <td className="px-2 py-1 align-top font-mono text-amber-400/90">
                <PrimitiveViewer value={k} />
              </td>
              <td className="px-2 py-1 align-top">
                <NestedValue value={v} depth={1} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Set ──────────────────────────────────────────────────────────────────────
// Pills showing each unique element

export function SetViewer({ values }: { values: unknown[] }) {
  if (values.length === 0) return <span className="text-zinc-500">empty Set</span>;
  return (
    <div className="flex max-w-full flex-wrap gap-1 rounded border border-zinc-700 bg-zinc-900/50 p-2">
      {values.map((v, i) => (
        <span
          key={i}
          className="rounded-full border border-indigo-700/60 bg-indigo-950/60 px-2 py-0.5 font-mono text-xs text-indigo-200"
        >
          <ValueInline value={v} />
        </span>
      ))}
    </div>
  );
}

// ─── Stack ────────────────────────────────────────────────────────────────────
// Vertical pile; last element (index n-1) is the TOP — like Array.push/pop.

export function StackViewer({ value }: { value: unknown[] }) {
  if (value.length === 0) return <span className="text-zinc-500">empty stack</span>;
  const items = [...value].reverse(); // top-of-stack first
  return (
    <div className="inline-flex flex-col overflow-hidden rounded border border-indigo-700/60 bg-zinc-950/80">
      {items.map((item, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 border-b border-zinc-700/40 px-3 py-1.5 last:border-b-0 font-mono text-xs ${
            i === 0 ? "bg-indigo-950/60 text-indigo-200" : "bg-zinc-900/50 text-zinc-300"
          }`}
        >
          <span>{nodeLabel(item)}</span>
          {i === 0 && (
            <span className="ml-auto rounded-full bg-amber-900/50 px-1.5 py-0.5 text-[9px] font-medium text-amber-400">
              TOP
            </span>
          )}
          {i === items.length - 1 && items.length > 1 && (
            <span className="ml-auto rounded-full bg-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-500">
              BOTTOM
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Queue ────────────────────────────────────────────────────────────────────
// Horizontal strip; index 0 = FRONT (dequeue side), last index = BACK (enqueue).

export function QueueViewer({ value }: { value: unknown[] }) {
  if (value.length === 0) return <span className="text-zinc-500">empty queue</span>;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center text-[10px] text-zinc-500">
        <span className="text-emerald-500">← dequeue</span>
        <span className="flex-1" />
        <span className="text-indigo-400">enqueue →</span>
      </div>
      <div className="flex max-w-full overflow-x-auto rounded border border-zinc-700/60 bg-zinc-950/80">
        {value.map((item, i) => (
          <div
            key={i}
            className={`flex shrink-0 items-center border-r border-zinc-700/40 px-3 py-2 last:border-r-0 font-mono text-xs ${
              i === 0
                ? "bg-emerald-950/40 text-emerald-200"
                : i === value.length - 1
                  ? "bg-indigo-950/40 text-indigo-200"
                  : "bg-zinc-900/50 text-zinc-300"
            }`}
          >
            {nodeLabel(item)}
          </div>
        ))}
      </div>
      <div className="flex items-center text-[10px]">
        <span className="text-emerald-600">FRONT</span>
        <span className="flex-1" />
        <span className="text-indigo-500">BACK</span>
      </div>
    </div>
  );
}

// ─── Graph ────────────────────────────────────────────────────────────────────
// SVG circular layout. Supports { nodes, edges }, { vertices, edges }, and
// { adjacencyList } formats. Directed if edges use from/to; undirected if [a,b].

let _graphId = 0;

type GNode = { id: string; label: string };
type GEdge = { from: string; to: string; weight?: string; directed: boolean };

function parseGraphData(raw: Record<string, unknown>): { nodes: GNode[]; edges: GEdge[] } {
  const nodes: GNode[] = [];
  const edges: GEdge[] = [];
  let directed = false;

  if ("adjacencyList" in raw && isPlainObject(raw.adjacencyList)) {
    const al = raw.adjacencyList as Record<string, unknown>;
    for (const k of Object.keys(al)) nodes.push({ id: k, label: k });
    for (const [from, nbrs] of Object.entries(al)) {
      if (Array.isArray(nbrs)) {
        for (const n of nbrs) edges.push({ from, to: String(n), directed: true });
      }
    }
    return { nodes, edges };
  }

  const rawNodes = (
    Array.isArray(raw.nodes) ? raw.nodes : Array.isArray(raw.vertices) ? raw.vertices : []
  ) as unknown[];

  for (let i = 0; i < rawNodes.length; i++) {
    const n = rawNodes[i];
    if (typeof n === "string" || typeof n === "number") {
      nodes.push({ id: String(n), label: String(n) });
    } else if (isPlainObject(n)) {
      const id = String(n.id ?? n.name ?? n.label ?? n.value ?? i);
      const label = String(n.label ?? n.name ?? n.value ?? n.id ?? i);
      nodes.push({ id, label });
    } else {
      nodes.push({ id: String(i), label: nodeLabel(n) });
    }
  }

  const rawEdges = (Array.isArray(raw.edges) ? raw.edges : []) as unknown[];
  for (const e of rawEdges) {
    if (Array.isArray(e) && e.length >= 2) {
      const w =
        e.length >= 3 && (typeof e[2] === "number" || typeof e[2] === "string")
          ? String(e[2])
          : undefined;
      edges.push({ from: String(e[0]), to: String(e[1]), weight: w, directed: false });
    } else if (isPlainObject(e)) {
      const from = e.from ?? e.source;
      const to = e.to ?? e.target;
      if (from != null && to != null) {
        directed = true;
        edges.push({
          from: String(from),
          to: String(to),
          weight: e.weight != null ? String(e.weight) : undefined,
          directed: true,
        });
      }
    }
  }

  return { nodes, edges: edges.map((ed) => ({ ...ed, directed })) };
}

export function GraphViewer({ value }: { value: Record<string, unknown> }) {
  const { nodes, edges } = parseGraphData(value);
  const markerId = useMemo(() => `gm${_graphId++}`, []);

  if (nodes.length === 0) return <span className="text-zinc-500">empty graph</span>;
  if (nodes.length > 50)
    return (
      <span className="text-xs text-zinc-400">
        Graph too large to display ({nodes.length} nodes)
      </span>
    );

  const isDirected = edges.some((e) => e.directed);
  const NODE_R = 22;
  const layoutR = Math.max(80, Math.min(nodes.length * 30, 220));
  const cx = layoutR + NODE_R + 12;
  const cy = layoutR + NODE_R + 12;
  const svgW = cx * 2;
  const svgH = cy * 2;

  const pos = new Map<string, { x: number; y: number }>();
  if (nodes.length === 1) {
    pos.set(nodes[0].id, { x: cx, y: cy });
  } else {
    nodes.forEach((n, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
      pos.set(n.id, { x: cx + layoutR * Math.cos(angle), y: cy + layoutR * Math.sin(angle) });
    });
  }

  return (
    <div className="max-w-full overflow-auto rounded border border-zinc-800 bg-zinc-950/80 p-1">
      <svg width={svgW} height={svgH} className="block">
        {isDirected && (
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
            </marker>
          </defs>
        )}
        {/* Edges */}
        {edges.map((e, i) => {
          const p0 = pos.get(e.from);
          const p1 = pos.get(e.to);
          if (!p0 || !p1 || e.from === e.to) return null;
          const dx = p1.x - p0.x;
          const dy = p1.y - p0.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len < 1) return null;
          const ux = dx / len, uy = dy / len;
          const x1 = p0.x + ux * NODE_R;
          const y1 = p0.y + uy * NODE_R;
          const x2 = p1.x - ux * (NODE_R + (isDirected ? 10 : 0));
          const y2 = p1.y - uy * (NODE_R + (isDirected ? 10 : 0));
          const mx = (p0.x + p1.x) / 2;
          const my = (p0.y + p1.y) / 2;
          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#4b5563"
                strokeWidth={1.5}
                markerEnd={isDirected ? `url(#${markerId})` : undefined}
              />
              {e.weight != null && (
                <text
                  x={mx}
                  y={my - 5}
                  textAnchor="middle"
                  fill="#f59e0b"
                  fontSize={10}
                  fontFamily="ui-monospace, monospace"
                >
                  {e.weight}
                </text>
              )}
            </g>
          );
        })}
        {/* Nodes */}
        {nodes.map((n) => {
          const p = pos.get(n.id);
          if (!p) return null;
          const lbl = n.label.length > 6 ? `${n.label.slice(0, 5)}…` : n.label;
          return (
            <g key={n.id} transform={`translate(${p.x}, ${p.y})`}>
              <circle r={NODE_R} fill="#1e1b4b" stroke="#6366f1" strokeWidth={1.5} />
              <text
                x={0}
                y={5}
                textAnchor="middle"
                fill="#c7d2fe"
                fontSize={11}
                fontFamily="ui-monospace, monospace"
              >
                {lbl}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Badge label ──────────────────────────────────────────────────────────────

export function kindBadgeLabel(kind: DataStructureKind, value: unknown): string {
  switch (kind) {
    case "null":        return "null";
    case "primitive":   return primitiveLabel(value);
    case "array":       return `Array[${(value as unknown[]).length}]`;
    case "binary_tree": return "BinaryTree";
    case "linked_list": return "LinkedList";
    case "tree":        return "Tree";
    case "graph":       return "Graph";
    case "map":         return `Map(${((value as { entries: unknown[] }).entries).length})`;
    case "set":         return `Set(${((value as { values: unknown[] }).values).length})`;
    case "object":      return "Object";
    default:            return kind;
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────
// varName is passed from VariablePanel to route arrays to Stack/Queue viewers
// when the variable name signals the intended usage.

function isStackName(n: string) {
  const l = n.toLowerCase();
  return l.includes("stack") || l.includes("stk");
}
function isQueueName(n: string) {
  const l = n.toLowerCase();
  return l.includes("queue") || l.includes("deque") || l.includes("fifo");
}

export function StructureViewer({ value, varName }: { value: unknown; varName?: string }) {
  const kind = detectKind(value);
  if (kind === "null" || kind === "primitive") return <PrimitiveViewer value={value} />;
  if (kind === "array") {
    const arr = value as unknown[];
    if (varName && isStackName(varName)) return <StackViewer value={arr} />;
    if (varName && isQueueName(varName)) return <QueueViewer value={arr} />;
    return <ArrayViewer value={arr} />;
  }
  if (kind === "binary_tree") return <BinaryTreeViewer value={value} />;
  if (kind === "linked_list") return <LinkedListViewer value={value} />;
  if (kind === "tree" && isPlainObject(value)) return <TreeViewer value={value} />;
  if (kind === "graph" && isPlainObject(value)) return <GraphViewer value={value} />;
  if (kind === "map") {
    const m = value as { entries: [unknown, unknown][] };
    return <MapViewer entries={m.entries} />;
  }
  if (kind === "set") {
    const s = value as { values: unknown[] };
    return <SetViewer values={s.values} />;
  }
  if (isPlainObject(value)) return <ObjectViewer value={value} depth={0} />;
  return <PrimitiveViewer value={value} />;
}
