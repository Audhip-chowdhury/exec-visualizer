import { analyzePython } from "@/lib/analyzer/python";

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
  } as FakeNode;
}

describe("lib/analyzer/python", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("extracts python mapped tags and edges", async () => {
    const fnNode = node("function_definition", 0, 40, 0, 4, [
      node("if_statement", 10, 20, 1, 2),
    ]);
    const root = node("module", 0, 90, 0, 8, [
      fnNode,
      node("for_statement", 41, 50, 5, 5),
      node("while_statement", 51, 60, 6, 6),
      node("assignment", 61, 66, 7, 7),
      node("augmented_assignment", 67, 73, 7, 7),
      node("call", 74, 80, 8, 8),
      node("identifier", 81, 82, 8, 8),
    ]);
    getParserMock.mockResolvedValue({ parse: vi.fn().mockReturnValue({ rootNode: root }) });

    const result = await analyzePython("x");
    const tags = result.nodes.map((n) => n.tag);
    expect(tags).toEqual(
      expect.arrayContaining(["fn_enter", "loop_iter", "branch", "var_assign", "call"]),
    );
    expect(result.nodes.some((n) => n.label === "identifier")).toBe(false);
    expect(result.edges.length).toBeGreaterThan(0);
  });

  it("returns empty for null tree", async () => {
    getParserMock.mockResolvedValue({ parse: vi.fn().mockReturnValue(null) });
    await expect(analyzePython("")).resolves.toEqual({ nodes: [], edges: [] });
  });
});
