import { createNodeId, edgeId } from "@/lib/ids";
import { getParser } from "@/lib/parser";
import type { AnalyzeResult, GraphEdge, GraphNode, LogTag } from "@/lib/types";

type TNode = {
  type: string;
  text: string;
  startIndex: number;
  endIndex: number;
  startPosition: { row: number };
  endPosition: { row: number };
  children: TNode[];
};

function toTag(type: string): LogTag | null {
  if (type === "function_definition") return "fn_enter";
  if (type === "for_statement" || type === "while_statement") return "loop_iter";
  if (type === "if_statement") return "branch";
  if (type === "assignment" || type === "augmented_assignment") return "var_assign";
  if (type === "call") return "call";
  return null;
}

export async function analyzePython(code: string): Promise<AnalyzeResult> {
  const parser = await getParser("python");
  const tree = parser.parse(code);
  if (!tree) return { nodes: [], edges: [] };
  const root = tree.rootNode as unknown as TNode;

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  function findFirstDescendantText(node: TNode, types: Set<string>): string | null {
    if (types.has(node.type)) return node.text;
    for (const child of node.children ?? []) {
      const res = findFirstDescendantText(child, types);
      if (res) return res;
    }
    return null;
  }

  function enclosingClassName(astAncestors: TNode[]): string | null {
    for (let i = astAncestors.length - 1; i >= 0; i--) {
      const a = astAncestors[i];
      if (a.type === "class_definition") {
        return a.children?.find((c) => c.type === "identifier")?.text ?? null;
      }
    }
    return null;
  }

  function extractName(node: TNode, tag: LogTag, astAncestors: TNode[]): string {
    const startLine = node.startPosition.row + 1;
    if (tag === "fn_enter") {
      const fnName = node.children?.find((c) => c.type === "identifier")?.text ?? null;
      const cls = enclosingClassName(astAncestors);
      return fnName ? (cls ? `${cls}.${fnName}` : fnName) : `fn_L${startLine}`;
    }
    if (tag === "var_assign") {
      const ident = findFirstDescendantText(node, new Set(["identifier"]));
      return ident ?? `assign_L${startLine}`;
    }
    if (tag === "loop_iter") return `loop_L${startLine}`;
    if (tag === "branch") return `if_L${startLine}`;
    if (tag === "call") {
      const ident = findFirstDescendantText(node, new Set(["identifier"]));
      return ident ?? `call_L${startLine}`;
    }
    return `node_L${startLine}`;
  }

  const walk = (node: TNode, parentId: string | null, scopePath: string[], astAncestors: TNode[]) => {
    const tag = toTag(node.type);
    if (tag) {
      const name = extractName(node, tag, astAncestors);
      const scope = scopePath.join(".");
      const id = createNodeId(tag, node.startIndex, node.endIndex, node.type, scope);
      nodes.push({
        id,
        label: node.type.replaceAll("_", " "),
        name,
        tag,
        parentId,
        startLine: node.startPosition.row + 1,
        endLine: node.endPosition.row + 1,
        startIndex: node.startIndex,
        endIndex: node.endIndex,
      });
      if (parentId) {
        edges.push({
          id: edgeId(parentId, id),
          source: parentId,
          target: id,
        });
      }
      const nextParentId = id;
      const nextScopePath = [...scopePath, name];
      for (const child of node.children ?? []) {
        walk(child, nextParentId, nextScopePath, [...astAncestors, node]);
      }
      return;
    }
    for (const child of node.children ?? []) {
      walk(child, parentId, scopePath, [...astAncestors, node]);
    }
  };
  walk(root, null, [], []);

  return { nodes, edges };
}
