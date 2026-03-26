import { executeJavaScript } from "@/lib/executor/js";

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

describe("lib/executor/js", () => {
  it("streams log events and process_exit in order", async () => {
    const code =
      '__evLog("n_1","fn_enter"); const x = 2; __evLog("n_2","var_assign",x);';
    const events = await collectSse(executeJavaScript(code));
    expect(events[0].id).toBe("n_1");
    expect(events[1].id).toBe("n_2");
    expect(events.at(-1)?.tag).toBe("process_exit");
    expect(events.at(-1)?.data).toBe(0);
  });

  it("emits stderr event for syntax error", async () => {
    const events = await collectSse(executeJavaScript("const x = {"));
    expect(events.some((e) => e.tag === "stderr")).toBe(true);
  });
});
