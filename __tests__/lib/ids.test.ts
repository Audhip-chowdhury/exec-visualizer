import { createNodeId, edgeId } from "@/lib/ids";
import type { LogTag } from "@/lib/types";

describe("lib/ids", () => {
  it("createNodeId has n_ prefix and is deterministic", () => {
    const a = createNodeId("fn_enter", 1, 10, "function_declaration");
    const b = createNodeId("fn_enter", 1, 10, "function_declaration");
    expect(a.startsWith("n_")).toBe(true);
    expect(a).toBe(b);
  });

  it("createNodeId changes for different ranges", () => {
    const a = createNodeId("fn_enter", 1, 10, "f");
    const b = createNodeId("fn_enter", 1, 11, "f");
    expect(a).not.toBe(b);
  });

  it("createNodeId supports all LogTag values", () => {
    const tags: LogTag[] = [
      "fn_enter",
      "fn_exit",
      "loop_iter",
      "branch",
      "var_assign",
      "call",
    ];
    for (const tag of tags) {
      expect(() => createNodeId(tag, 0, 1, "x")).not.toThrow();
    }
  });

  it("undefined label matches empty label", () => {
    const a = createNodeId("call", 2, 3);
    const b = createNodeId("call", 2, 3, "");
    expect(a).toBe(b);
  });

  it("edgeId formats source and target", () => {
    expect(edgeId("s1", "t1")).toBe("e_s1_t1");
  });
});
