"use client";

import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { GraphEdge, GraphNode } from "@/lib/types";

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  activeNodeId: string | null;
}

export function GraphCanvas({ nodes, edges, activeNodeId }: GraphCanvasProps) {
  const childrenByParentId = new Map<string, GraphNode[]>();
  const roots: GraphNode[] = [];
  for (const node of nodes) {
    if (node.parentId) {
      const list = childrenByParentId.get(node.parentId) ?? [];
      list.push(node);
      childrenByParentId.set(node.parentId, list);
    } else {
      roots.push(node);
    }
  }

  for (const list of childrenByParentId.values()) {
    list.sort((a, b) => a.startIndex - b.startIndex);
  }
  roots.sort((a, b) => a.startIndex - b.startIndex);

  const positions = new Map<string, { x: number; y: number }>();

  const leafHeight = 70;
  const groupPaddingTop = 40;
  const groupPaddingBottom = 20;
  const groupPaddingLeft = 20;
  const verticalGap = 14;

  const subtreeHeightMemo = new Map<string, number>();
  const subtreeHeight = (nodeId: string): number => {
    const memo = subtreeHeightMemo.get(nodeId);
    if (memo) return memo;

    const children = childrenByParentId.get(nodeId) ?? [];
    if (children.length === 0) {
      subtreeHeightMemo.set(nodeId, leafHeight);
      return leafHeight;
    }

    let sumChildren = 0;
    for (const child of children) sumChildren += subtreeHeight(child.id);
    const height =
      groupPaddingTop +
      groupPaddingBottom +
      sumChildren +
      verticalGap * Math.max(0, children.length - 1);
    subtreeHeightMemo.set(nodeId, height);
    return height;
  };

  const placeSubtree = (node: GraphNode, x: number, y: number) => {
    positions.set(node.id, { x, y });
    const children = childrenByParentId.get(node.id) ?? [];
    if (children.length === 0) return;

    // For nested nodes, React Flow treats `position` as relative to `parentNode`.
    // So children should not include the parent's absolute `y` offset.
    let cursorY = groupPaddingTop;
    for (const child of children) {
      // Children positions are relative to their parent.
      // React Flow uses `parentNode` + `extent: 'parent'` for nesting.
      placeSubtree(child, groupPaddingLeft, cursorY);
      cursorY += subtreeHeight(child.id) + verticalGap;
    }
  };

  // Place root containers (absolute positions); all descendants are placed relative.
  let cursorY = 10;
  const rootX = 0;
  for (const root of roots) {
    placeSubtree(root, rootX, cursorY);
    cursorY += subtreeHeight(root.id) + 18;
  }

  const flowNodes: Node[] = nodes.map((node) => {
    const childCount = (childrenByParentId.get(node.id) ?? []).length;
    const isGroup = childCount > 0;
    const pos = positions.get(node.id) ?? { x: 0, y: 0 };

    const isActive = node.id === activeNodeId;
    const style = isActive
      ? { border: "2px solid #22c55e", backgroundColor: "#064e3b", color: "#ecfdf5" }
      : isGroup
        ? {
            backgroundColor: "#0f172a",
            border: "1px solid #334155",
            color: "#e4e4e7",
          }
        : { backgroundColor: "#18181b", border: "1px solid #3f3f46", color: "#e4e4e7" };

    const height = isGroup ? subtreeHeight(node.id) : leafHeight;

    type ParentCapableNode = Node & { parentNode?: string; extent?: "parent" };
    const flowNode: ParentCapableNode = {
      id: node.id,
      position: pos,
      data: { label: `${node.name} (${node.startLine})` },
      style: { ...style, width: 240, height },
    };

    if (node.parentId) {
      flowNode.parentNode = node.parentId;
      flowNode.extent = "parent";
    }

    return flowNode;
  });

  const flowEdges: Edge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
  }));

  return (
    <div className="h-[440px] rounded border border-zinc-700 bg-zinc-900">
      <ReactFlow nodes={flowNodes} edges={flowEdges} fitView>
        <Background color="#3f3f46" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
