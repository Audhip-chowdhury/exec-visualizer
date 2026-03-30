import { detectKind } from "@/lib/detectDataStructure";

function stableKey(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "object") return null;
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

function isNodeLike(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectFromNode(
  node: unknown,
  mode: "binary_tree" | "linked_list" | "tree" | "graph",
  descendants: Set<string>,
  visited: Set<string>,
): void {
  if (!isNodeLike(node)) return;
  const nodeKey = stableKey(node);
  if (nodeKey === null || visited.has(nodeKey)) return;
  visited.add(nodeKey);

  descendants.add(nodeKey);

  if (mode === "binary_tree") {
    collectFromNode(node.left, mode, descendants, visited);
    collectFromNode(node.right, mode, descendants, visited);
    return;
  }

  if (mode === "linked_list") {
    collectFromNode(node.next, mode, descendants, visited);
    return;
  }

  if (mode === "graph") {
    for (const value of Object.values(node)) {
      collectAnyObject(value, descendants, visited);
    }
    return;
  }

  const children = node.children;
  if (!Array.isArray(children)) return;
  for (const child of children) {
    collectFromNode(child, mode, descendants, visited);
  }
}

function collectAnyObject(
  value: unknown,
  descendants: Set<string>,
  visited: Set<string>,
): void {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectAnyObject(item, descendants, visited);
    }
    return;
  }
  if (!isNodeLike(value)) return;
  const key = stableKey(value);
  if (key === null || visited.has(key)) return;
  visited.add(key);
  descendants.add(key);
  for (const child of Object.values(value)) {
    collectAnyObject(child, descendants, visited);
  }
}

function collectDescendantsFromRoot(
  root: unknown,
  mode: "binary_tree" | "linked_list" | "tree" | "graph",
  descendants: Set<string>,
): void {
  const visited = new Set<string>();
  if (!isNodeLike(root)) return;

  if (mode === "binary_tree") {
    collectFromNode(root.left, mode, descendants, visited);
    collectFromNode(root.right, mode, descendants, visited);
    return;
  }

  if (mode === "linked_list") {
    collectFromNode(root.next, mode, descendants, visited);
    return;
  }

  if (mode === "graph") {
    if (isNodeLike(root.adjacencyList)) {
      for (const value of Object.values(root.adjacencyList)) {
        collectAnyObject(value, descendants, visited);
      }
    }
    if (Array.isArray(root.nodes)) {
      for (const node of root.nodes) {
        collectAnyObject(node, descendants, visited);
      }
    }
    if (Array.isArray(root.vertices)) {
      for (const node of root.vertices) {
        collectAnyObject(node, descendants, visited);
      }
    }
    if (Array.isArray(root.edges)) {
      for (const edge of root.edges) {
        collectAnyObject(edge, descendants, visited);
      }
    }
    return;
  }

  const children = root.children;
  if (!Array.isArray(children)) return;
  for (const child of children) {
    collectFromNode(child, mode, descendants, visited);
  }
}

export function filterContainedVars(
  variables: Record<string, unknown>,
): Record<string, unknown> {
  const descendants = new Set<string>();

  for (const value of Object.values(variables)) {
    const kind = detectKind(value);
    if (kind === "binary_tree" || kind === "linked_list" || kind === "tree" || kind === "graph") {
      collectDescendantsFromRoot(value, kind, descendants);
    }
  }

  const filtered: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(variables)) {
    const kind = detectKind(value);
    if (kind === "object") continue;
    const valueKey = stableKey(value);
    if (valueKey !== null && descendants.has(valueKey)) {
      continue;
    }
    filtered[name] = value;
  }

  return filtered;
}
