import { buildFrames } from "@/lib/graph/builder";
import type { LogEvent } from "@/lib/types";

describe("lib/graph/builder", () => {
  it("returns empty frames for empty input", () => {
    expect(buildFrames([])).toEqual([]);
  });

  it("builds one frame from one event", () => {
    const events: LogEvent[] = [{ id: "n1", tag: "fn_enter", seq: 0 }];
    const frames = buildFrames(events);
    expect(frames).toHaveLength(1);
    expect(frames[0].activeNodeId).toBe("n1");
    expect(frames[0].seq).toBe(0);
  });

  it("sorts events by seq and accumulates var_assign snapshots", () => {
    const events: LogEvent[] = [
      { id: "n3", tag: "loop_iter", seq: 2 },
      { id: "n2", tag: "var_assign", data: 42, seq: 1 },
      { id: "n1", tag: "fn_enter", seq: 0 },
    ];
    const frames = buildFrames(events);
    expect(frames.map((f) => f.seq)).toEqual([0, 1, 2]);
    expect(frames[0].variables).toEqual({});
    expect(frames[1].variables).toEqual({ n2: 42 });
    expect(frames[2].variables).toEqual({ n2: 42 });
  });

  it("uses snapshot copies per frame", () => {
    const events: LogEvent[] = [
      { id: "a", tag: "var_assign", data: 1, seq: 0 },
      { id: "b", tag: "var_assign", data: 2, seq: 1 },
    ];
    const frames = buildFrames(events);
    (frames[0].variables as Record<string, unknown>).x = "mutated";
    expect(frames[1].variables.x).toBeUndefined();
    expect(frames[1].variables).toEqual({ a: 1, b: 2 });
  });
});
