function toSse(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export function executeJavaScript(instrumentedCode: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const logs: unknown[] = [];
      let __evSeq = 0;
      // Inject __evLog as a named parameter so class methods can resolve it
      // without relying on `with`, which has unreliable interactions with
      // class bodies (always strict-mode) in V8.
      // Recursively serialize a value so Maps, Sets, and nested objects are
      // captured as plain JSON-safe structures before logs are emitted.
      const serializeForLog = (val: unknown, depth: number): unknown => {
        if (depth > 20) return "[deep]";
        if (val === null || val === undefined) return val;
        const t = typeof val;
        if (t !== "object" && t !== "function") return val;
        if (t === "function") return "[Function]";
        if (val instanceof Map) {
          return {
            __type: "Map",
            entries: [...(val as Map<unknown, unknown>).entries()].map(
              ([k, v]) =>
                [serializeForLog(k, depth + 1), serializeForLog(v, depth + 1)] as [
                  unknown,
                  unknown,
                ],
            ),
          };
        }
        if (val instanceof Set) {
          return {
            __type: "Set",
            values: [...(val as Set<unknown>).values()].map((v) =>
              serializeForLog(v, depth + 1),
            ),
          };
        }
        if (Array.isArray(val)) {
          return val.map((v) => serializeForLog(v, depth + 1));
        }
        const out: Record<string, unknown> = {};
        try {
          for (const [k, v] of Object.entries(val as object)) {
            out[k] = serializeForLog(v, depth + 1);
          }
        } catch {
          return "[unserializable]";
        }
        return out;
      };

      const __evLog = (id: string, tag: string, data?: unknown, name?: string) => {
        const snapshot = data !== undefined ? serializeForLog(data, 0) : undefined;
        logs.push({ id, tag, data: snapshot, name, seq: __evSeq++ });
      };

      try {
        const fn = new Function("__evLog", instrumentedCode);
        fn(__evLog);
        for (const log of logs) {
          controller.enqueue(encoder.encode(toSse(log)));
        }
        controller.enqueue(encoder.encode(toSse({ tag: "process_exit", data: 0 })));
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            toSse({
              tag: "stderr",
              data: error instanceof Error ? error.message : "Execution failed",
            }),
          ),
        );
      } finally {
        controller.close();
      }
    },
  });
}
