describe("lib/instrumenter/runtime/js-runtime", () => {
  const originalWrite = process.stdout.write;
  const lines: string[] = [];
  type RuntimeGlobals = {
    __evSeq?: number;
    __evLog?: (id: string, tag: string, data?: unknown) => void;
  };

  beforeEach(async () => {
    lines.length = 0;
    process.stdout.write = ((chunk: string | Uint8Array) => {
      lines.push(String(chunk));
      return true;
    }) as typeof process.stdout.write;

    (globalThis as RuntimeGlobals).__evSeq = undefined;
    (globalThis as RuntimeGlobals).__evLog = undefined;

    const modPath = "@/lib/instrumenter/runtime/js-runtime.js";
    const mod = await import(modPath);
    void mod;
  });

  afterAll(() => {
    process.stdout.write = originalWrite;
  });

  it("emits valid log JSON lines and increments seq", () => {
    (globalThis as RuntimeGlobals).__evLog?.("id1", "fn_enter");
    (globalThis as RuntimeGlobals).__evLog?.("id2", "call", 42);

    expect(lines.length).toBe(2);
    for (const line of lines) {
      expect(line.endsWith("\n")).toBe(true);
      const payload = JSON.parse(line.trim());
      expect(payload.__log).toBeDefined();
    }

    const p1 = JSON.parse(lines[0].trim()).__log;
    const p2 = JSON.parse(lines[1].trim()).__log;
    expect(p1.id).toBe("id1");
    expect(p1.seq).toBe(0);
    expect(p2.id).toBe("id2");
    expect(p2.seq).toBe(1);
    expect(p2.data).toBe(42);
  });
});
