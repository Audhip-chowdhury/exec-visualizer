import { POST } from "@/app/api/run/route";
import { instrumentCode } from "@/lib/instrumenter";
import { executeCode } from "@/lib/executor";

vi.mock("@/lib/instrumenter", () => ({
  instrumentCode: vi.fn(),
}));

vi.mock("@/lib/executor", () => ({
  executeCode: vi.fn(),
}));

describe("app/api/run route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls instrumenter+executor and returns SSE response", async () => {
    const fakeStream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('data: {"ok":true}\n\n'));
        controller.close();
      },
    });

    vi.mocked(instrumentCode).mockResolvedValue("instrumented");
    vi.mocked(executeCode).mockReturnValue(fakeStream);

    const req = new Request("http://localhost/api/run", {
      method: "POST",
      body: JSON.stringify({ code: "const x=1", language: "javascript" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);

    expect(vi.mocked(instrumentCode)).toHaveBeenCalledWith("const x=1", "javascript");
    expect(vi.mocked(executeCode)).toHaveBeenCalledWith("instrumented", "javascript");
    expect(res.headers.get("content-type")).toContain("text/event-stream");
    expect(res.headers.get("cache-control")).toContain("no-cache");
  });

  it("applies defaults when fields are missing", async () => {
    const fakeStream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.close();
      },
    });
    vi.mocked(instrumentCode).mockResolvedValue("instrumented");
    vi.mocked(executeCode).mockReturnValue(fakeStream);

    const req = new Request("http://localhost/api/run", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    await POST(req);
    expect(vi.mocked(instrumentCode)).toHaveBeenCalledWith("", "javascript");
  });

  it("returns 400 when instrumentation fails", async () => {
    vi.mocked(instrumentCode).mockRejectedValue(new Error("run failed"));
    const req = new Request("http://localhost/api/run", {
      method: "POST",
      body: JSON.stringify({ code: "x" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "run failed" });
  });
});
