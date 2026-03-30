"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Panel,
  Position,
  ReactFlow,
  applyNodeChanges,
  type Edge,
  type Node,
  type NodeChange,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { GraphEdge, GraphNode, LogTag } from "@/lib/types";
import { detectKind } from "@/lib/detectDataStructure";
import { kindBadgeLabel, StructureViewer } from "@/components/StructureViewers";

interface PlaybackControls {
  isPlaying: boolean;
  currentFrame: number;
  totalFrames: number;
  onPlayPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onSeek: (index: number) => void;
}

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  activeNodeId: string | null;
  prevNodeId: string | null;
  variables?: Record<string, unknown>;
  playback?: PlaybackControls;
}

// ─── Layout constants ─────────────────────────────────────────────────────────
const NODE_W = 180;
const NODE_H = 48;      // height for non-var leaf nodes
const VAR_NODE_H = 78;  // taller to fit value display
const H_GAP = 48;
const V_GAP = 72;
const GROUP_PAD = 14;

// ─── Layout computation ───────────────────────────────────────────────────────

interface LayoutItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  isGroupHeader: boolean;
  isGroupBg: boolean;
  bgLabel?: string;
  tag?: LogTag;     // carried so VarNode knows which nodes are var_assign
  varName?: string; // the variable name for var_assign nodes
}

const TAG_ICONS: Record<LogTag, string> = {
  fn_enter:    "fn",
  fn_exit:     "fn",
  loop_iter:   "loop",
  branch:      "if",
  branch_else: "else",
  var_assign:  "var",
  call:        "call",
};

function groupBgLabel(tag: LogTag, name: string): string {
  const prefix = TAG_ICONS[tag] ?? tag;
  // For fn / call: show name; for structural keywords: just the keyword
  if (tag === "fn_enter" || tag === "call") return `${prefix}  ${name}`;
  if (tag === "loop_iter") return `loop  ${name}`;
  return prefix;
}

function buildLayout(graphNodes: GraphNode[]): LayoutItem[] {
  if (graphNodes.length === 0) return [];

  // Build children map
  const childrenOf = new Map<string, GraphNode[]>();
  const roots: GraphNode[] = [];
  for (const node of graphNodes) {
    if (node.parentId) {
      const list = childrenOf.get(node.parentId) ?? [];
      list.push(node);
      childrenOf.set(node.parentId, list);
    } else {
      roots.push(node);
    }
  }
  for (const list of childrenOf.values()) list.sort((a, b) => a.startIndex - b.startIndex);
  roots.sort((a, b) => a.startIndex - b.startIndex);

  // Assign depths
  const depth = new Map<string, number>();
  function assignDepth(id: string, d: number) {
    depth.set(id, d);
    for (const child of childrenOf.get(id) ?? []) assignDepth(child.id, d + 1);
  }
  for (const root of roots) assignDepth(root.id, 0);

  // Assign leaf columns (in-order traversal so siblings spread left-to-right)
  let colCounter = 0;
  const leafCol = new Map<string, number>();
  function assignCols(id: string) {
    const children = childrenOf.get(id) ?? [];
    if (children.length === 0) {
      leafCol.set(id, colCounter++);
      return;
    }
    for (const child of children) assignCols(child.id);
  }
  for (const root of roots) assignCols(root.id);

  // Center x of a subtree (memoised)
  const SLOT = NODE_W + H_GAP;
  const cxMemo = new Map<string, number>();
  function centerX(id: string): number {
    if (cxMemo.has(id)) return cxMemo.get(id)!;
    const children = childrenOf.get(id) ?? [];
    let cx: number;
    if (children.length === 0) {
      cx = (leafCol.get(id) ?? 0) * SLOT + NODE_W / 2;
    } else {
      cx = (centerX(children[0].id) + centerX(children[children.length - 1].id)) / 2;
    }
    cxMemo.set(id, cx);
    return cx;
  }

  // Per-node leaf height (var_assign nodes get extra room for value display)
  const nodeH = new Map<string, number>();
  for (const n of graphNodes) {
    nodeH.set(n.id, n.tag === "var_assign" ? VAR_NODE_H : NODE_H);
  }

  const subtreeHeightMemo = new Map<string, number>();
  function subtreeHeight(id: string): number {
    const memo = subtreeHeightMemo.get(id);
    if (memo !== undefined) return memo;
    const children = childrenOf.get(id) ?? [];
    if (children.length === 0) {
      const h = nodeH.get(id) ?? NODE_H;
      subtreeHeightMemo.set(id, h);
      return h;
    }
    let sum = 0;
    for (const c of children) sum += subtreeHeight(c.id);
    const h =
      GROUP_PAD * 2 +  // top + bottom padding inside group bg
      NODE_H +         // the group header card itself
      8 +              // gap header → bg-box
      sum +
      V_GAP * Math.max(0, children.length - 1);
    subtreeHeightMemo.set(id, h);
    return h;
  }

  // Leaf bounds of an entire subtree (for group bg sizing)
  function subtreeBounds(id: string): { minX: number; maxX: number; minD: number; maxD: number } {
    const children = childrenOf.get(id) ?? [];
    if (children.length === 0) {
      const d = depth.get(id) ?? 0;
      const cx = centerX(id);
      return { minX: cx - NODE_W / 2, maxX: cx + NODE_W / 2, minD: d, maxD: d };
    }
    const bounds = children.map((c) => subtreeBounds(c.id));
    return {
      minX: Math.min(...bounds.map((b) => b.minX)),
      maxX: Math.max(...bounds.map((b) => b.maxX)),
      minD: Math.min(...bounds.map((b) => b.minD)),
      maxD: Math.max(...bounds.map((b) => b.maxD)),
    };
  }

  const ROW = Math.max(NODE_H, VAR_NODE_H) + V_GAP;
  const items: LayoutItem[] = [];

  for (const node of graphNodes) {
    const children = childrenOf.get(node.id) ?? [];
    const isGroup = children.length > 0;
    const d = depth.get(node.id) ?? 0;
    const cx = centerX(node.id);
    const x = cx - NODE_W / 2;
    const y = d * ROW;
    const h = isGroup ? NODE_H : (nodeH.get(node.id) ?? NODE_H);

    items.push({
      id: node.id,
      x,
      y,
      w: NODE_W,
      h,
      label: `${node.name}  :${node.startLine}`,
      isGroupHeader: isGroup,
      isGroupBg: false,
      tag: node.tag,
      varName: node.tag === "var_assign" ? node.name : undefined,
    });

    if (isGroup) {
      const b = subtreeBounds(node.id);
      const bgX = b.minX - GROUP_PAD;
      const bgY = y + NODE_H + 8;
      const bgW = b.maxX - b.minX + 2 * GROUP_PAD;
      const bgH = b.maxD * ROW + VAR_NODE_H + GROUP_PAD - bgY;
      if (bgH > 0) {
        items.push({
          id: `__bg__${node.id}`,
          x: bgX,
          y: bgY,
          w: Math.max(bgW, NODE_W + 2 * GROUP_PAD),
          h: bgH,
          label: "",
          isGroupHeader: false,
          isGroupBg: true,
          bgLabel: groupBgLabel(node.tag, node.name),
        });
      }
    }
  }

  return items;
}

// ─── Custom node: group boundary box ─────────────────────────────────────────

function GroupBgNode({ data }: NodeProps): ReactNode {
  const label = (data as { bgLabel?: string }).bgLabel ?? "";
  return (
    <div
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      className="rounded-lg border border-dashed border-zinc-600 bg-zinc-900/40"
    >
      {label && (
        <span
          className="absolute left-2 top-1.5 rounded px-1.5 py-0.5 font-mono font-semibold uppercase tracking-widest"
          style={{ fontSize: "10px", color: "#818cf8", background: "rgba(15,23,42,0.85)", pointerEvents: "none" }}
        >
          {label}
        </span>
      )}
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
    </div>
  );
}

// ─── Custom node: var_assign — shows label + current value inline ─────────────

function compactValueText(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value).slice(0, 28);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    const inner = value.slice(0, 4).map((v) => compactValueText(v)).join(", ");
    return `[${inner}${value.length > 4 ? ", …" : ""}]`;
  }
  return null as unknown as string;
}

function VarNode({ data }: NodeProps): ReactNode {
  const {
    label,
    varName,
    value,
    isActive,
    isGroup,
  } = data as {
    label: string;
    varName?: string;
    value?: unknown;
    isActive?: boolean;
    isGroup?: boolean;
  };

  const hasValue = varName !== undefined && value !== undefined;
  const kind = hasValue ? detectKind(value) : null;
  const badge = hasValue && kind ? kindBadgeLabel(kind, value) : null;
  const compact = hasValue ? compactValueText(value) : null;

  const borderColor = isActive ? "#22c55e" : isGroup ? "#4f46e5" : "#3f3f46";
  const bg = isActive ? "#064e3b" : isGroup ? "#0f172a" : "#18181b";
  const fg = isActive ? "#ecfdf5" : "#e4e4e7";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        border: `${isActive ? "2px" : "1px"} solid ${borderColor}`,
        borderRadius: "6px",
        backgroundColor: bg,
        color: fg,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0.4 }} />

      {/* Node label */}
      <div
        style={{
          padding: "6px 8px 4px",
          fontSize: "12px",
          fontWeight: 600,
          lineHeight: 1.2,
          borderBottom: hasValue ? `1px solid ${isActive ? "#065f46" : "#27272a"}` : undefined,
        }}
      >
        {label}
      </div>

      {/* Value display */}
      {hasValue && (
        <div style={{ padding: "4px 8px", fontSize: "11px", display: "flex", alignItems: "center", gap: "5px", flex: 1, overflow: "hidden" }}>
          {badge && (
            <span
              style={{
                borderRadius: "9999px",
                border: "1px solid #3f3f46",
                background: "#27272a",
                padding: "1px 5px",
                fontSize: "9px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#a1a1aa",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {badge}
            </span>
          )}
          {compact !== null ? (
            <span
              style={{
                fontFamily: "ui-monospace, monospace",
                color: isActive ? "#6ee7b7" : "#a1a1aa",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {compact}
            </span>
          ) : (
            <span style={{ color: "#52525b", fontStyle: "italic" }}>
              {badge ?? "…"}
            </span>
          )}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0.4 }} />
    </div>
  );
}

// ─── Component styles ─────────────────────────────────────────────────────────

const ACTIVE_STYLE = {
  border: "2px solid #22c55e",
  backgroundColor: "#064e3b",
  color: "#ecfdf5",
};
const GROUP_STYLE = {
  backgroundColor: "#0f172a",
  border: "1px solid #4f46e5",
  color: "#e4e4e7",
};
const LEAF_STYLE = {
  backgroundColor: "#18181b",
  border: "1px solid #3f3f46",
  color: "#e4e4e7",
};

function layoutToFlowNodes(
  items: LayoutItem[],
  activeNodeId: string | null,
  variables: Record<string, unknown>,
): Node[] {
  return items.map((item) => {
    if (item.isGroupBg) {
      return {
        id: item.id,
        type: "groupBg",
        position: { x: item.x, y: item.y },
        data: { bgLabel: item.bgLabel ?? "" },
        style: { width: item.w, height: item.h, padding: 0, background: "transparent", border: "none" },
        selectable: false,
        draggable: false,
        zIndex: -1,
      } satisfies Node;
    }

    const isActive = item.id === activeNodeId;

    // var_assign nodes use VarNode custom type
    if (item.tag === "var_assign") {
      return {
        id: item.id,
        type: "varNode",
        position: { x: item.x, y: item.y },
        data: {
          label: item.label,
          varName: item.varName,
          value: item.varName !== undefined ? variables[item.varName] : undefined,
          isActive,
          isGroup: item.isGroupHeader,
        },
        style: { width: item.w, height: item.h, padding: 0, background: "transparent", border: "none" },
        zIndex: 1,
      } satisfies Node;
    }

    const baseStyle = isActive ? ACTIVE_STYLE : item.isGroupHeader ? GROUP_STYLE : LEAF_STYLE;
    return {
      id: item.id,
      type: "default",
      position: { x: item.x, y: item.y },
      data: { label: item.label },
      style: { ...baseStyle, width: item.w, height: item.h, borderRadius: "6px", fontSize: "12px" },
      zIndex: 1,
    } satisfies Node;
  });
}

const NODE_TYPES = { groupBg: GroupBgNode, varNode: VarNode };

// ─── Floating variable table (Panel inside ReactFlow) ────────────────────────

function VarsPanel({ variables }: { variables: Record<string, unknown> }) {
  const [open, setOpen] = useState(true);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const entries = Object.entries(variables);

  if (entries.length === 0) return null;

  return (
    <div
      className="max-h-[55vh] w-60 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-950/95 shadow-xl"
      style={{ fontSize: "11px" }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between border-b border-zinc-800 px-3 py-1.5 text-left font-semibold text-zinc-300 hover:bg-zinc-800/50"
        style={{ fontSize: "11px" }}
      >
        <span>All variables ({entries.length})</span>
        <span className="text-zinc-500">{open ? "▼" : "▶"}</span>
      </button>

      {open && (
        <ul className="divide-y divide-zinc-800/60">
          {entries.map(([key, value]) => {
            const kind = detectKind(value);
            const badge = kindBadgeLabel(kind, value);
            const isExpanded = expandedKey === key;

            return (
              <li key={key}>
                <button
                  type="button"
                  className="flex w-full items-center gap-1.5 px-2 py-1 text-left hover:bg-zinc-800/40"
                  onClick={() => setExpandedKey(isExpanded ? null : key)}
                >
                  <span className="text-zinc-500">{isExpanded ? "▼" : "▶"}</span>
                  <span className="min-w-0 truncate font-semibold text-zinc-100">{key}</span>
                  <span
                    className="ml-auto shrink-0 rounded-full border border-zinc-700 bg-zinc-800 px-1.5 py-px font-medium uppercase tracking-wide text-zinc-400"
                    style={{ fontSize: "9px" }}
                  >
                    {badge}
                  </span>
                </button>
                {isExpanded && (
                  <div className="border-t border-zinc-800/60 px-2 py-2">
                    <StructureViewer value={value} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function GraphCanvas({ nodes, edges, activeNodeId, prevNodeId, variables = {}, playback }: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync fullscreen state with browser events (e.g. Esc key exits)
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);
  // Stable layout — only recompute when the node structure changes (not on every activeNodeId tick)
  const layoutItems = useMemo(() => buildLayout(nodes), [nodes]);

  // Keep React Flow nodes in state so dragging persists across re-renders
  const [rfNodes, setRfNodes] = useState<Node[]>(() =>
    layoutToFlowNodes(layoutItems, activeNodeId, variables),
  );

  // Reset layout when the node structure changes
  const structureKey = useMemo(
    () => nodes.map((n) => `${n.id}:${n.parentId ?? ""}`).join("|"),
    [nodes],
  );
  useEffect(() => {
    setRfNodes(layoutToFlowNodes(layoutItems, activeNodeId, variables));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structureKey]);

  // Re-apply active highlight + variable values without touching positions
  useEffect(() => {
    setRfNodes((prev) =>
      prev.map((n) => {
        if (n.id.startsWith("__bg__")) return n;
        const item = layoutItems.find((i) => i.id === n.id);
        if (!item) return n;
        const isActive = n.id === activeNodeId;

        // var_assign nodes: update value in data and isActive flag
        if (item.tag === "var_assign") {
          return {
            ...n,
            data: {
              ...n.data,
              value: item.varName !== undefined ? variables[item.varName] : undefined,
              isActive,
            },
            zIndex: 1,
          };
        }

        const baseStyle = isActive ? ACTIVE_STYLE : item.isGroupHeader ? GROUP_STYLE : LEAF_STYLE;
        return {
          ...n,
          style: { ...baseStyle, width: item.w, height: item.h, borderRadius: "6px", fontSize: "12px" },
          zIndex: 1,
        };
      }),
    );
  }, [activeNodeId, variables, layoutItems]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setRfNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  // Structural hierarchy edges (parent → child, static)
  const structuralEdges: Edge[] = useMemo(
    () =>
      edges
        .filter((e) => !e.source.startsWith("__bg__") && !e.target.startsWith("__bg__"))
        .map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label,
          style: { stroke: "#3f3f46", strokeWidth: 1.5 },
          animated: false,
          zIndex: 0,
        })),
    [edges],
  );

  // Live execution-flow edge: animates from prev active → current active node
  const execEdge: Edge[] = useMemo(() => {
    if (
      !prevNodeId ||
      !activeNodeId ||
      prevNodeId === activeNodeId ||
      prevNodeId.startsWith("__bg__") ||
      activeNodeId.startsWith("__bg__")
    )
      return [];
    return [
      {
        id: `__exec__flow__`,
        source: prevNodeId,
        target: activeNodeId,
        animated: true,
        style: { stroke: "#f59e0b", strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b", width: 18, height: 18 },
        zIndex: 10,
      },
    ];
  }, [prevNodeId, activeNodeId]);

  const flowEdges: Edge[] = useMemo(
    () => [...structuralEdges, ...execEdge],
    [structuralEdges, execEdge],
  );

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col bg-zinc-950"
          : "relative flex h-[460px] flex-col rounded border border-zinc-700 bg-zinc-900"
      }
    >
      {/* Fullscreen toggle button */}
      <button
        type="button"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded border border-zinc-600 bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700 hover:text-white"
        style={{ lineHeight: 1 }}
      >
        {isFullscreen ? (
          // compress icon
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M3.28 2.22a.75.75 0 0 0-1.06 1.06L5.44 6.5H3a.75.75 0 0 0 0 1.5h4.25a.75.75 0 0 0 .75-.75V3a.75.75 0 0 0-1.5 0v2.44L3.28 2.22ZM16.72 2.22 13.5 5.44V3a.75.75 0 0 0-1.5 0v4.25c0 .414.336.75.75.75H17a.75.75 0 0 0 0-1.5h-2.44l3.22-3.22a.75.75 0 0 0-1.06-1.06ZM3.28 17.78l3.22-3.22H4a.75.75 0 0 1-.75-.75V9.75A.75.75 0 0 1 4 9H3a.75.75 0 0 0 0 1.5h2.44L2.22 13.72a.75.75 0 1 0 1.06 1.06L6.5 11.56V14a.75.75 0 0 0 1.5 0V9.75A.75.75 0 0 0 7.25 9H3a.75.75 0 0 0 0 1.5h2.44l-3.22 3.22a.75.75 0 1 0 1.06 1.06ZM13.5 14.56l3.22 3.22a.75.75 0 1 0 1.06-1.06L14.56 13.5H17a.75.75 0 0 0 0-1.5h-4.25a.75.75 0 0 0-.75.75V17a.75.75 0 0 0 1.5 0v-2.44Z" />
          </svg>
        ) : (
          // expand icon
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M13.28 7.78l3.22-3.22v2.69a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.69l-3.22 3.22a.75.75 0 0 0 1.06 1.06ZM2 17.25v-4.5a.75.75 0 0 1 1.5 0v2.69l3.22-3.22a.75.75 0 0 1 1.06 1.06L4.56 16.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75ZM12.22 13.28l3.22 3.22h-2.69a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-1.5 0v2.69l-3.22-3.22a.75.75 0 0 0-1.06 1.06ZM3.5 4.56l3.22 3.22a.75.75 0 0 0 1.06-1.06L4.56 3.5h2.69a.75.75 0 0 0 0-1.5h-4.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0V4.56Z" />
          </svg>
        )}
      </button>

      {/* React Flow canvas — grows to fill available space */}
      <div className="min-h-0 flex-1">
        <ReactFlow
          nodes={rfNodes}
          edges={flowEdges}
          onNodesChange={onNodesChange}
          nodeTypes={NODE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable
          minZoom={0.2}
          maxZoom={2}
        >
          <Background color="#3f3f46" gap={20} />
          <Controls />
          <Panel position="top-right" style={{ marginTop: "2.5rem" }}>
            <VarsPanel variables={variables} />
          </Panel>
        </ReactFlow>
      </div>

      {/* Playback controls overlay — only visible in fullscreen */}
      {playback && isFullscreen && (
        <div className="flex flex-col gap-2 border-t border-zinc-700 bg-zinc-900/95 px-4 py-3">
          {/* Timeline */}
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="shrink-0 tabular-nums">
              {playback.totalFrames === 0 ? 0 : playback.currentFrame + 1} / {playback.totalFrames}
            </span>
            <input
              type="range"
              min={0}
              max={Math.max(0, playback.totalFrames - 1)}
              value={Math.min(playback.currentFrame, Math.max(0, playback.totalFrames - 1))}
              onChange={(e) => playback.onSeek(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
          {/* Control buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={playback.onStepBack}
              className="rounded border border-zinc-600 bg-zinc-800 px-3 py-1 text-sm text-zinc-200 hover:bg-zinc-700"
            >
              ◀ Step
            </button>
            <button
              type="button"
              onClick={playback.onPlayPause}
              className="rounded border border-zinc-600 bg-zinc-800 px-4 py-1 text-sm text-zinc-200 hover:bg-zinc-700"
            >
              {playback.isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
            <button
              type="button"
              onClick={playback.onStepForward}
              className="rounded border border-zinc-600 bg-zinc-800 px-3 py-1 text-sm text-zinc-200 hover:bg-zinc-700"
            >
              Step ▶
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="ml-auto rounded border border-zinc-600 bg-zinc-800 px-3 py-1 text-sm text-zinc-200 hover:bg-zinc-700"
            >
              ✕ Exit fullscreen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
