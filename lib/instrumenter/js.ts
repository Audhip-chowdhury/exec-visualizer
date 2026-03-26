import { createNodeId } from "@/lib/ids";
import { getParser } from "@/lib/parser";
import type { LogTag } from "@/lib/types";

type TNode = {
  type: string;
  text: string;
  startIndex: number;
  endIndex: number;
  startPosition: { row: number };
  endPosition: { row: number };
  children: TNode[];
};

type Insertion = { index: number; code: string };

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

function buildInsertions(root: TNode): Insertion[] {
  const insertions: Insertion[] = [];

  function toTag(type: string): LogTag | null {
    if (FUNCTION_TYPES.has(type)) return "fn_enter";
    if (LOOP_TYPES.has(type)) return "loop_iter";
    if (type === "if_statement") return "branch";
    if (type === "else_clause") return "branch_else";
    if (type === "variable_declarator" || type === "assignment_expression") return "var_assign";
    if (type === "call_expression") return "call";
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
      if (a.type === "class_declaration" || a.type === "class_expression") {
        return a.children?.find((c) => c.type === "identifier")?.text ?? null;
      }
    }
    return null;
  }

  function extractName(node: TNode, tag: LogTag, astParent: TNode | null, astAncestors: TNode[]): string {
    const startLine = node.startPosition.row + 1;
    if (tag === "fn_enter") {
      const namedChild = node.children.find((c) => c.type === "identifier" || c.type === "property_identifier");
      const ownName = namedChild?.text ?? null;

      if (node.type === "method_definition" && ownName) {
        const cls = enclosingClassName(astAncestors);
        return cls ? `${cls}.${ownName}` : ownName;
      }

      if (!ownName && astParent?.type === "variable_declarator") {
        const parentIdent = astParent.children.find((c) => c.type === "identifier")?.text;
        if (parentIdent) return parentIdent;
      }

      return ownName ?? `fn_L${startLine}`;
    }

    if (tag === "var_assign") {
      if (node.type === "variable_declarator") {
        const ident = node.children.find((c) => c.type === "identifier")?.text ?? null;
        return ident ?? `assign_L${startLine}`;
      }
      const leftNode = node.children[0];
      const ident = leftNode ? findFirstDescendantText(leftNode, new Set(["identifier"])) : null;
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

  const walk = (
    node: TNode,
    astParent: TNode | null = null,
    taggedParentId: string | null = null,
    scopePath: string[] = [],
    astAncestors: TNode[] = [],
  ) => {
    const tag = toTag(node.type);
    let nextTaggedParentId = taggedParentId;
    let nextScopePath = scopePath;
    let currentId: string | null = null;
    let currentName: string | null = null;

    if (tag) {
      currentName = extractName(node, tag, astParent, astAncestors);
      const scope = scopePath.join(".");
      currentId = createNodeId(tag, node.startIndex, node.endIndex, node.type, scope);
      nextTaggedParentId = currentId;
      nextScopePath = [...scopePath, currentName];
    }

    // ── Function / method entry ──────────────────────────────────────
    if (FUNCTION_TYPES.has(node.type)) {
      const id = currentId!;
      const body = node.children.find((c) => c.type === "statement_block");
      if (body) {
        insertions.push({
          index: body.startIndex + 1,
          code: `__evLog("${id}","fn_enter");`,
        });
      }
    }

    // ── Loop iteration ───────────────────────────────────────────────
    if (LOOP_TYPES.has(node.type)) {
      const id = currentId!;
      const body = node.children.find((c) => c.type === "statement_block");
      if (body) {
        insertions.push({
          index: body.startIndex + 1,
          code: `__evLog("${id}","loop_iter");`,
        });
      }
    }

    // ── Branch (if / else) ───────────────────────────────────────────
    if (node.type === "if_statement") {
      const id = currentId!;
      // consequence – first statement_block child
      const consequence = node.children.find((c) => c.type === "statement_block");
      if (consequence) {
        insertions.push({
          index: consequence.startIndex + 1,
          code: `__evLog("${id}","branch");`,
        });
      }
      // else clause
      const elseClause = node.children.find((c) => c.type === "else_clause");
      if (elseClause) {
        const elseBody = elseClause.children.find((c) => c.type === "statement_block");
        if (elseBody) {
          const elseId = createNodeId(
            "branch_else",
            elseClause.startIndex,
            elseClause.endIndex,
            "else_clause",
            nextScopePath.join("."),
          );
          insertions.push({
            index: elseBody.startIndex + 1,
            code: `__evLog("${elseId}","branch_else");`,
          });
        }
      }
    }

    // ── Variable declaration (let/const/var x = ...) ─────────────────
    if (node.type === "variable_declarator") {
      const nameNode = node.children.find((c) => c.type === "identifier");
      if (nameNode) {
        const name = nameNode.text;
        const id = currentId!;
        // Insert after the parent variable_declaration statement to avoid the
        // double-semicolon that arises from inserting before the statement's own ";".
        const insertAt =
          astParent?.type === "variable_declaration" ? astParent.endIndex : node.endIndex;

        // Skip when the declaration is a for-loop initializer (e.g. `for (let i = 0; ...)`).
        // Inserting a statement after the declarator would land inside the for(…) parens,
        // producing a syntax error. astAncestors already includes astParent as its last
        // element, so the grandparent sits at index length-2.
        const grandparent = astAncestors[astAncestors.length - 2];
        if (!LOOP_TYPES.has(grandparent?.type)) {
          insertions.push({
            index: insertAt,
            code: `\n__evLog("${id}","var_assign",${name},"${name}");`,
          });
        }
      }
    }

    // ── Assignment expression (this.x = y, a = b, ...) ───────────────
    if (
      node.type === "assignment_expression" &&
      astParent?.type === "expression_statement"
    ) {
      const leftNode = node.children[0];
      const leftText = leftNode.text;
      const id = currentId!;
      insertions.push({
        index: astParent.endIndex,
        code: `\n__evLog("${id}","var_assign",${leftText},"${leftText}");`,
      });
    }

    // ── Call expression ───────────────────────────────────────────────
    if (node.type === "call_expression") {
      const id = currentId!;
      insertions.push({ index: node.startIndex, code: `(__evLog("${id}","call"),` });
      insertions.push({ index: node.endIndex, code: `)` });
    }

    for (const child of node.children ?? []) {
      walk(child, node, nextTaggedParentId, nextScopePath, [...astAncestors, node]);
    }
  };

  walk(root, null, null, [], []);
  return insertions.sort((a, b) => b.index - a.index);
}

export async function instrumentJavaScript(code: string): Promise<string> {
  const parser = await getParser("javascript");
  const tree = parser.parse(code);
  if (!tree) return code;
  const root = tree.rootNode as unknown as TNode;
  const insertions = buildInsertions(root);

  let output = code;
  for (const insertion of insertions) {
    output =
      output.slice(0, insertion.index) + insertion.code + output.slice(insertion.index);
  }

  return output;
}
