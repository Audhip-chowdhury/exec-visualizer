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
      const __evLog = (id: string, tag: string, data?: unknown, name?: string) => {
        logs.push({ id, tag, data, name, seq: __evSeq++ });
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
