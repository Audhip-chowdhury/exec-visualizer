import { instrumentJavaScript } from "@/lib/instrumenter/js";

const getParserMock = vi.fn();

vi.mock("@/lib/parser", () => ({
  getParser: (...args: unknown[]) => getParserMock(...args),
}));

type FakeNode = {
  type: string;
  startIndex: number;
  endIndex: number;
  children: FakeNode[];
  text: string;
  startPosition: { row: number };
  endPosition: { row: number };
};

function node(
  type: string,
  startIndex: number,
  endIndex: number,
  children: FakeNode[] = [],
  text = "",
): FakeNode {
  return {
    type,
    startIndex,
    endIndex,
    children,
    text,
    startPosition: { row: 0 },
    endPosition: { row: 0 },
  };
}

describe("lib/instrumenter/js", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("inserts logs for function/loop/branch/var/call", async () => {
    const code = "function f(){const x=1;foo();}";
    const root = node("program", 0, code.length, [
      node("function_declaration", 0, code.length, [node("statement_block", 12, code.length - 1)]),
      node("for_statement", 0, code.length, [node("statement_block", 12, code.length - 1)]),
      node("while_statement", 0, code.length, [node("statement_block", 12, code.length - 1)]),
      node("if_statement", 0, code.length, [node("statement_block", 12, code.length - 1)]),
      node("variable_declarator", 13, 22, [node("identifier", 19, 20, [], "x")]),
      node("call_expression", 23, 28),
    ]);
    getParserMock.mockResolvedValue({ parse: vi.fn().mockReturnValue({ rootNode: root }) });

    const out = await instrumentJavaScript(code);
    expect(out).toContain('"fn_enter"');
    expect(out).toContain('"loop_iter"');
    expect(out).toContain('"branch"');
    expect(out).toContain('"var_assign"');
    expect(out).toContain('"call"');
    expect(out).toContain("(__evLog(");
  });

  it("returns unchanged code for null tree", async () => {
    getParserMock.mockResolvedValue({ parse: vi.fn().mockReturnValue(null) });
    const code = "const x = 1;";
    await expect(instrumentJavaScript(code)).resolves.toBe(code);
  });
});
