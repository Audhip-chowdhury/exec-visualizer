export type DataStructureKind =
  | "null"
  | "primitive"
  | "array"
  | "binary_tree"
  | "linked_list"
  | "tree"
  | "graph"
  | "map"
  | "set"
  | "object";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTreeChildSlot(v: unknown): boolean {
  return (
    v === null ||
    v === undefined ||
    (typeof v === "object" && !Array.isArray(v))
  );
}

/** Heuristic: object shaped like a binary tree node (left / right slots). */
function looksLikeBinaryTreeNode(obj: Record<string, unknown>): boolean {
  if (!("left" in obj) || !("right" in obj)) return false;
  return isTreeChildSlot(obj.left) && isTreeChildSlot(obj.right);
}

/** Heuristic: object with a forward pointer (singly linked list node). */
function looksLikeLinkedListNode(obj: Record<string, unknown>): boolean {
  if (!("next" in obj)) return false;
  const next = obj.next;
  return (
    next === null ||
    next === undefined ||
    isPlainObject(next)
  );
}

/** Heuristic: N-ary tree with `children` array. */
function looksLikeTreeNode(obj: Record<string, unknown>): boolean {
  if (!("children" in obj)) return false;
  return Array.isArray(obj.children);
}

/**
 * Heuristic: object with a `nodes`/`vertices` array AND an `edges` array,
 * OR an explicit `adjacencyList` object.
 */
function looksLikeGraph(obj: Record<string, unknown>): boolean {
  if ("adjacencyList" in obj && isPlainObject(obj.adjacencyList)) return true;
  const hasNodes = Array.isArray(obj.nodes) || Array.isArray(obj.vertices);
  return hasNodes && Array.isArray(obj.edges);
}

function looksLikeMapSnapshot(obj: Record<string, unknown>): boolean {
  return obj.__type === "Map" && Array.isArray(obj.entries);
}

function looksLikeSetSnapshot(obj: Record<string, unknown>): boolean {
  return obj.__type === "Set" && Array.isArray(obj.values);
}

/**
 * Classify a runtime value for visualization.
 * Order matters: map/set checked before binary_tree/linked_list/tree to avoid misclassification.
 */
export function detectKind(value: unknown): DataStructureKind {
  if (value === null || value === undefined) return "null";

  const t = typeof value;
  if (t === "number" || t === "string" || t === "boolean" || t === "bigint" || t === "symbol") {
    return "primitive";
  }
  if (t === "function") return "primitive";

  if (Array.isArray(value)) return "array";

  if (isPlainObject(value)) {
    if (looksLikeMapSnapshot(value)) return "map";
    if (looksLikeSetSnapshot(value)) return "set";
    if (looksLikeGraph(value)) return "graph";
    if (looksLikeBinaryTreeNode(value)) return "binary_tree";
    if (looksLikeLinkedListNode(value)) return "linked_list";
    if (looksLikeTreeNode(value)) return "tree";
    return "object";
  }

  return "object";
}

/** Human-readable subtype for primitive badge (number, string, boolean, function, etc.). */
export function primitiveLabel(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  return typeof value;
}
