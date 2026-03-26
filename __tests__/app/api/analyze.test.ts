import { POST } from "@/app/api/analyze/route";
import { analyzeCode } from "@/lib/analyzer";

vi.mock("@/lib/analyzer", () => ({
  analyzeCode: vi.fn(),
}));

describe("app/api/analyze route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls analyzeCode and returns JSON payload", async () => {
    vi.mocked(analyzeCode).mockResolvedValue({ nodes: [], edges: [] });
    const req = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ code: "const x=1", language: "javascript" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(vi.mocked(analyzeCode)).toHaveBeenCalledWith("const x=1", "javascript");
    expect(res.headers.get("content-type")).toContain("application/json");
    expect(await res.json()).toEqual({ nodes: [], edges: [] });
  });

  it("applies default body values", async () => {
    vi.mocked(analyzeCode).mockResolvedValue({ nodes: [], edges: [] });
    const req = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    await POST(req);
    expect(vi.mocked(analyzeCode)).toHaveBeenCalledWith("", "javascript");
  });

  it("returns 400 when analyze fails", async () => {
    vi.mocked(analyzeCode).mockRejectedValue(new Error("boom"));
    const req = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ code: "x" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "boom" });
  });
});
