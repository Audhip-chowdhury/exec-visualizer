import { createNodeId } from "@/lib/ids";
import { getParser } from "@/lib/parser";

type TNode = {
  type: string;
  text: string;
  startIndex: number;
  endIndex: number;
  startPosition: { row: number; column: number };
  children: TNode[];
};

type Insertion = { index: number; code: string };

function indentationForLine(line: string): string {
  const match = line.match(/^\s*/);
  return match?.[0] ?? "";
}

export async function instrumentPython(code: string): Promise<string> {
  const parser = await getParser("python");
  const tree = parser.parse(code);
  if (!tree) return code;
  const root = tree.rootNode as unknown as TNode;
  const lines = code.split("\n");
  const insertions: Insertion[] = [];

  function toTag(type: string): "fn_enter" | "loop_iter" | "branch" | "var_assign" | "call" | null {
    if (type === "function_definition") return "fn_enter";
    if (type === "for_statement" || type === "while_statement") return "loop_iter";
    if (type === "if_statement") return "branch";
    if (type === "assignment" || type === "augmented_assignment") return "var_assign";
    if (type === "call") return "call";
    return null;
  }

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

  function extractName(node: TNode, tag: NonNullable<ReturnType<typeof toTag>>, astAncestors: TNode[]): string {
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

  const walk = (
    node: TNode,
    scopePath: string[] = [],
    astAncestors: TNode[] = [],
  ) => {
    const tag = toTag(node.type);
    let nextScopePath = scopePath;
    let currentId: string | null = null;
    if (tag) {
      const name = extractName(node, tag, astAncestors);
      const scope = scopePath.join(".");
      currentId = createNodeId(tag, node.startIndex, node.endIndex, node.type, scope);
      nextScopePath = [...scopePath, name];
    }

    if (
      node.type === "function_definition" ||
      node.type === "for_statement" ||
      node.type === "while_statement" ||
      node.type === "if_statement"
    ) {
      const tagForInsert =
        node.type === "function_definition"
          ? "fn_enter"
          : node.type === "if_statement"
            ? "branch"
            : "loop_iter";
      const id = currentId!;
      const lineNo = node.startPosition.row + 1;
      const indent = indentationForLine(lines[lineNo] ?? "");
      const emit = `\n${indent}    __ev_log("${id}", "${tagForInsert}")`;
      const lineStartIndex =
        lines.slice(0, lineNo).join("\n").length + (lineNo > 0 ? 1 : 0);
      insertions.push({ index: lineStartIndex, code: emit });
    }

    if (node.type === "assignment" || node.type === "augmented_assignment") {
      const id = currentId!;
      insertions.push({
        index: node.endIndex,
        code: `\n__ev_log("${id}", "var_assign")`,
      });
    }

    for (const child of node.children ?? []) {
      walk(child, nextScopePath, [...astAncestors, node]);
    }
  };
  walk(root, [], []);

  let output = code;
  for (const insertion of insertions.sort((a, b) => b.index - a.index)) {
    output = output.slice(0, insertion.index) + insertion.code + output.slice(insertion.index);
  }
  return output;
}
