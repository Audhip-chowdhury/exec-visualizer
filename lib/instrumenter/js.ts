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

type ParamBinding = { name: string; startIndex: number; endIndex: number };

/** Plain identifier / rest / default-simple params only; destructuring patterns skipped. */
function collectPlainIdentifierParams(fnNode: TNode): ParamBinding[] {
  const fp = fnNode.children.find((c) => c.type === "formal_parameters");
  if (!fp) return [];

  const out: ParamBinding[] = [];
  for (const p of fp.children ?? []) {
    if (p.type === "identifier") {
      out.push({ name: p.text, startIndex: p.startIndex, endIndex: p.endIndex });
    } else if (p.type === "rest_pattern") {
      const id = p.children.find((c) => c.type === "identifier");
      if (id) out.push({ name: id.text, startIndex: id.startIndex, endIndex: id.endIndex });
    } else if (p.type === "assignment_pattern") {
      const lhs = p.children[0];
      if (lhs?.type === "identifier") {
        out.push({ name: lhs.text, startIndex: lhs.startIndex, endIndex: lhs.endIndex });
      }
    }
  }
  return out;
}

function unwrapParenthesized(node: TNode): TNode {
  if (node.type === "parenthesized_expression") {
    const inner = node.children.find((c) => c.type !== "(" && c.type !== ")");
    return inner ? unwrapParenthesized(inner) : node;
  }
  return node;
}

type RootRef = { expr: string; name: string; startIndex: number; endIndex: number };

/** Leftmost root of a member/subscript chain (`obj.prop` → obj, `arr[i]` → arr). */
function memberChainRoot(left: TNode): RootRef | null {
  const u = unwrapParenthesized(left);
  if (u.type === "this") {
    return { expr: "this", name: "this", startIndex: u.startIndex, endIndex: u.endIndex };
  }
  if (u.type === "identifier") {
    return { expr: u.text, name: u.text, startIndex: u.startIndex, endIndex: u.endIndex };
  }
  if (u.type === "member_expression" || u.type === "subscript_expression") {
    const obj = u.children.find((ch) =>
      [
        "identifier",
        "member_expression",
        "subscript_expression",
        "parenthesized_expression",
        "this",
      ].includes(ch.type),
    );
    if (obj) return memberChainRoot(obj);
    return null;
  }
  return null;
}

type LoopBinding = { name: string; expr: string; startIndex: number; endIndex: number };

function loopVarBindings(loopNode: TNode): LoopBinding[] {
  if (loopNode.type === "while_statement" || loopNode.type === "do_statement") {
    return [];
  }

  const out: LoopBinding[] = [];

  if (loopNode.type === "for_of_statement" || loopNode.type === "for_in_statement") {
    for (const c of loopNode.children ?? []) {
      if (c.type === "identifier") {
        out.push({
          name: c.text,
          expr: c.text,
          startIndex: c.startIndex,
          endIndex: c.endIndex,
        });
        return out;
      }
      if (c.type === "variable_declaration") {
        for (const ch of c.children ?? []) {
          if (ch.type !== "variable_declarator") continue;
          const id = ch.children.find((x) => x.type === "identifier");
          if (id) {
            out.push({
              name: id.text,
              expr: id.text,
              startIndex: id.startIndex,
              endIndex: id.endIndex,
            });
          }
        }
        return out;
      }
    }
    return out;
  }

  if (loopNode.type === "for_statement") {
    for (const c of loopNode.children ?? []) {
      if (c.type === "variable_declaration") {
        for (const ch of c.children ?? []) {
          if (ch.type !== "variable_declarator") continue;
          const id = ch.children.find((x) => x.type === "identifier");
          if (id) {
            out.push({
              name: id.text,
              expr: id.text,
              startIndex: id.startIndex,
              endIndex: id.endIndex,
            });
          }
        }
        return out;
      }
      if (c.type === "expression_statement") {
        const inner = c.children.find(
          (x) => x.type === "assignment_expression" || x.type === "augmented_assignment_expression",
        );
        const assign = inner ?? c.children[0];
        if (assign?.type === "assignment_expression") {
          const lhs = assign.children[0];
          if (lhs?.type === "identifier") {
            out.push({
              name: lhs.text,
              expr: lhs.text,
              startIndex: lhs.startIndex,
              endIndex: lhs.endIndex,
            });
            return out;
          }
        }
      }
    }
  }

  return out;
}

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
      const scopeStr = scopePath.join(".");
      const body = node.children.find((c) => c.type === "statement_block");
      if (body) {
        let fnBody = `__evLog("${id}","fn_enter");`;
        for (const p of collectPlainIdentifierParams(node)) {
          const pid = createNodeId("var_assign", p.startIndex, p.endIndex, "identifier", scopeStr);
          fnBody += `__evLog("${pid}","var_assign",${p.name},"${p.name}");`;
        }
        insertions.push({
          index: body.startIndex + 1,
          code: fnBody,
        });
      }
    }

    // ── Loop iteration ───────────────────────────────────────────────
    if (LOOP_TYPES.has(node.type)) {
      const id = currentId!;
      const scopeStr = scopePath.join(".");
      const body = node.children.find((c) => c.type === "statement_block");
      if (body) {
        let loopCode = `__evLog("${id}","loop_iter");`;
        for (const lv of loopVarBindings(node)) {
          const vid = createNodeId(
            "var_assign",
            lv.startIndex,
            lv.endIndex,
            "identifier",
            scopeStr,
          );
          loopCode += `__evLog("${vid}","var_assign",${lv.expr},"${lv.name}");`;
        }
        insertions.push({
          index: body.startIndex + 1,
          code: loopCode,
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
      const scopeStr = scopePath.join(".");
      let assignCode = `\n__evLog("${id}","var_assign",${leftText},"${leftText}");`;

      const u = unwrapParenthesized(leftNode);
      if (u.type === "member_expression" || u.type === "subscript_expression") {
        const root = memberChainRoot(u);
        if (root) {
          const rid = createNodeId("var_assign", root.startIndex, root.endIndex, `root:${root.name}`, scopeStr);
          assignCode += `\n__evLog("${rid}","var_assign",${root.expr},"${root.name}");`;
        }
      }

      insertions.push({
        index: astParent.endIndex,
        code: assignCode,
      });
    }

    // ── Augmented assignment (x += 1, arr[0] *= 2, ...) ─────────────
    if (
      node.type === "augmented_assignment_expression" &&
      astParent?.type === "expression_statement"
    ) {
      const leftNode = node.children[0];
      const leftText = leftNode.text;
      const scopeStr = scopePath.join(".");
      const id = createNodeId("var_assign", node.startIndex, node.endIndex, "augmented_assignment", scopeStr);
      let code = `\n__evLog("${id}","var_assign",${leftText},"${leftText}");`;

      const u = unwrapParenthesized(leftNode);
      if (u.type === "member_expression" || u.type === "subscript_expression") {
        const root = memberChainRoot(u);
        if (root && root.name !== "this") {
          const rid = createNodeId("var_assign", root.startIndex, root.endIndex, `root:${root.name}`, scopeStr);
          code += `\n__evLog("${rid}","var_assign",${root.expr},"${root.name}");`;
        }
      }

      insertions.push({ index: astParent.endIndex, code });
    }

    // ── Update expression (x++, x--, ++x, --x) as a statement ───────
    if (
      node.type === "update_expression" &&
      astParent?.type === "expression_statement"
    ) {
      const idNode = node.children.find((c) => c.type === "identifier");
      if (idNode) {
        const varName = idNode.text;
        const scopeStr = scopePath.join(".");
        const id = createNodeId("var_assign", node.startIndex, node.endIndex, "update_expression", scopeStr);
        insertions.push({
          index: astParent.endIndex,
          code: `\n__evLog("${id}","var_assign",${varName},"${varName}");`,
        });
      }
    }

    // ── Call expression ───────────────────────────────────────────────
    if (node.type === "call_expression") {
      const id = currentId!;
      insertions.push({ index: node.startIndex, code: `(__evLog("${id}","call"),` });
      insertions.push({ index: node.endIndex, code: `)` });

      // Re-emit root object when callee is a member_expression (arr.push, stack.pop, etc.)
      // so mutation is visible without waiting for the next explicit assignment.
      if (astParent?.type === "expression_statement") {
        const callee = node.children[0];
        if (callee?.type === "member_expression" || callee?.type === "subscript_expression") {
          const root = memberChainRoot(callee);
          if (root && root.name !== "this") {
            const scopeStr = scopePath.join(".");
            const rid = createNodeId("var_assign", root.startIndex, root.endIndex, `mut:${root.name}`, scopeStr);
            insertions.push({
              index: astParent.endIndex,
              code: `\n__evLog("${rid}","var_assign",${root.expr},"${root.name}");`,
            });
          }
        }
      }
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
