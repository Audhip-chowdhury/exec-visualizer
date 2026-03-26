import { createNodeId, edgeId } from "@/lib/ids";
import { getParser } from "@/lib/parser";
import type {
  AnalyzeResult,
  GraphEdge,
  GraphNode,
  LogTag,
  SupportedLanguage,
} from "@/lib/types";

type TNode = {
  type: string;
  text: string;
  startIndex: number;
  endIndex: number;
  startPosition: { row: number };
  endPosition: { row: number };
  children: TNode[];
  parent: TNode | null;
};

const FUNCTION_TYPES = new Set([
  "function_declaration",
  "function_expression",
  "arrow_function",
  "method_definition",
  "generator_function_declaration",
  "generator_function",
]);

const LOOP_TYPES = new Set([
  "for_statement",
  "while_statement",
  "do_statement",
  "for_in_statement",
  "for_of_statement",
]);

function toTag(type: string): LogTag | null {
  if (FUNCTION_TYPES.has(type)) return "fn_enter";
  if (LOOP_TYPES.has(type)) return "loop_iter";
  if (type === "if_statement") return "branch";
  if (type === "else_clause") return "branch_else";
  if (type === "variable_declarator" || type === "assignment_expression")
    return "var_assign";
  if (type === "call_expression") return "call";
  return null;
}

function toLabel(node: TNode): string {
  return node.type.replaceAll("_", " ");
}

export async function analyzeJavaScript(
  code: string,
  language: Extract<SupportedLanguage, "javascript" | "typescript"> = "javascript",
): Promise<AnalyzeResult> {
  const parser = await getParser(language);
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

  function enclosingClassName(node: TNode): string | null {
    let cur: TNode | null = node.parent;
    while (cur) {
      if (cur.type === "class_declaration" || cur.type === "class_expression") {
        const name = cur.children?.find((c) => c.type === "identifier")?.text ?? null;
        return name;
      }
      cur = cur.parent;
    }
    return null;
  }

  function extractName(node: TNode, tag: LogTag): string {
    const startLine = node.startPosition.row + 1;
    if (tag === "fn_enter") {
      // Prefer explicit name for declarations/expressions/methods.
      const namedChild = node.children.find(
        (c) => c.type === "identifier" || c.type === "property_identifier",
      );
      const ownName = namedChild?.text ?? null;

      // Methods inside classes: turn `method()` into `ClassName.method`.
      if (node.type === "method_definition" && ownName) {
        const cls = enclosingClassName(node);
        return cls ? `${cls}.${ownName}` : ownName;
      }

      // Anonymous arrow functions assigned to a variable: use the variable name.
      if (!ownName && node.parent?.type === "variable_declarator") {
        const parentIdent = node.parent.children.find((c) => c.type === "identifier")?.text;
        if (parentIdent) return parentIdent;
      }

      return ownName ?? `fn_L${startLine}`;
    }

    if (tag === "var_assign") {
      if (node.type === "variable_declarator") {
        const ident = node.children.find((c) => c.type === "identifier")?.text ?? null;
        return ident ?? `assign_L${startLine}`;
      }
      // assignment_expression: try to take the left-hand identifier/text.
      const leftNode = node.children[0];
      const ident = leftNode
        ? findFirstDescendantText(leftNode, new Set(["identifier"]))
        : null;
      return ident ?? leftNode?.text ?? `assign_L${startLine}`;
    }

    if (tag === "loop_iter") return `loop_L${startLine}`;
    if (tag === "branch") return `if_L${startLine}`;
    if (tag === "branch_else") return `else_L${startLine}`;
    if (tag === "call") {
      const callee = node.children[0];
      const calleeName = callee?.type === "identifier" ? callee.text : callee?.text ?? null;
      return calleeName ?? `call_L${startLine}`;
    }

    return `node_L${startLine}`;
  }

  const walk = (node: TNode, parentId: string | null, scopePath: string[]) => {
    const tag = toTag(node.type);
    if (tag) {
      const name = extractName(node, tag);
      const scope = scopePath.join(".");
      const id = createNodeId(tag, node.startIndex, node.endIndex, node.type, scope);
      nodes.push({
        id,
        label: toLabel(node),
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
      for (const child of node.children ?? []) walk(child, nextParentId, nextScopePath);
    } else {
      for (const child of node.children ?? []) walk(child, parentId, scopePath);
    }
  };
  walk(root, null, []);

  return { nodes, edges };
}
