import { executePython } from "@/lib/executor/python";

async function collectSse(stream: ReadableStream<Uint8Array>): Promise<Record<string, unknown>[]> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const out: Record<string, unknown>[] = [];
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";
    for (const chunk of chunks) {
      const line = chunk.split("\n").find((l) => l.startsWith("data: "))?.slice(6);
      if (line) out.push(JSON.parse(line) as Record<string, unknown>);
    }
  }
  return out;
}

describe("lib/executor/python", () => {
  it("returns stderr + process_exit(1) and closes", async () => {
    const events = await collectSse(executePython("print('x')"));
    expect(events).toHaveLength(2);
    expect(events[0].tag).toBe("stderr");
    expect(String(events[0].data)).toContain("not available");
    expect(events[1].tag).toBe("process_exit");
    expect(events[1].data).toBe(1);
  });
});
