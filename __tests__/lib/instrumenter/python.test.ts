import { instrumentPython } from "@/lib/instrumenter/python";

const getParserMock = vi.fn();

vi.mock("@/lib/parser", () => ({
  getParser: (...args: unknown[]) => getParserMock(...args),
}));

type FakeNode = {
  type: string;
  text: string;
  startIndex: number;
  endIndex: number;
  startPosition: { row: number; column: number };
  children: FakeNode[];
};

function node(
  type: string,
  startIndex: number,
  endIndex: number,
  row: number,
  children: FakeNode[] = [],
): FakeNode {
  return {
    type,
    text: type,
    startIndex,
    endIndex,
    startPosition: { row, column: 0 },
    children,
  } as FakeNode;
}

describe("lib/instrumenter/python", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("inserts logs for control flow and assignment nodes", async () => {
    const code = "def f():\n    x = 1\n    if x:\n        x += 1\n";
    const root = node("module", 0, code.length, 0, [
      node("function_definition", 0, code.length, 0),
      node("for_statement", 0, code.length, 1),
      node("while_statement", 0, code.length, 2),
      node("if_statement", 0, code.length, 2),
      node("assignment", 13, 18, 1),
      node("augmented_assignment", 32, 38, 3),
    ]);
    getParserMock.mockResolvedValue({ parse: vi.fn().mockReturnValue({ rootNode: root }) });

    const out = await instrumentPython(code);
    expect(out).toContain('__ev_log("');
    expect(out).toContain('"fn_enter"');
    expect(out).toContain('"loop_iter"');
    expect(out).toContain('"branch"');
    expect(out).toContain('"var_assign"');
  });

  it("returns original code for null tree", async () => {
    getParserMock.mockResolvedValue({ parse: vi.fn().mockReturnValue(null) });
    const code = "x = 1\n";
    await expect(instrumentPython(code)).resolves.toBe(code);
  });
});
