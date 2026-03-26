import { analyzeJavaScript } from "@/lib/analyzer/js";

const getParserMock = vi.fn();

vi.mock("@/lib/parser", () => ({
  getParser: (...args: unknown[]) => getParserMock(...args),
}));

type FakeNode = {
  type: string;
  text: string;
  startIndex: number;
  endIndex: number;
  startPosition: { row: number };
  endPosition: { row: number };
  children: FakeNode[];
  parent: FakeNode | null;
};

function node(
  type: string,
  startIndex: number,
  endIndex: number,
  rowStart: number,
  rowEnd: number,
  children: FakeNode[] = [],
): FakeNode {
  return {
    type,
    text: type,
    startIndex,
    endIndex,
    startPosition: { row: rowStart },
    endPosition: { row: rowEnd },
    children,
    parent: null,
  } as FakeNode;
}

describe("lib/analyzer/js", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("extracts all mapped node tags and builds edges", async () => {
    const ifNode = node("if_statement", 20, 30, 2, 3);
    const fnNode = node("function_declaration", 0, 50, 0, 5, [ifNode]);
    const root = node("program", 0, 60, 0, 6, [
      fnNode,
      node("arrow_function", 61, 80, 7, 8),
      node("for_statement", 81, 95, 9, 10),
      node("while_statement", 96, 110, 11, 12),
      node("variable_declarator", 111, 120, 13, 13),
      node("call_expression", 121, 130, 14, 14),
      node("identifier", 131, 132, 15, 15),
    ]);
    getParserMock.mockResolvedValue({ parse: vi.fn().mockReturnValue({ rootNode: root }) });

    const result = await analyzeJavaScript("code");
    const tags = result.nodes.map((n) => n.tag);
    expect(tags).toEqual(
      expect.arrayContaining(["fn_enter", "loop_iter", "branch", "var_assign", "call"]),
    );
    expect(result.nodes.some((n) => n.label === "identifier")).toBe(false);
    expect(result.nodes.some((n) => n.startLine === 1)).toBe(true);
    expect(result.edges.length).toBeGreaterThan(0);
  });

  it("returns empty when parser tree is null", async () => {
    getParserMock.mockResolvedValue({ parse: vi.fn().mockReturnValue(null) });
    await expect(analyzeJavaScript("")).resolves.toEqual({ nodes: [], edges: [] });
  });
});
