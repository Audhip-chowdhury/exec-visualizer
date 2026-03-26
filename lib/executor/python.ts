function toSse(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export function executePython(instrumentedCode: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      void instrumentedCode;
      controller.enqueue(
        encoder.encode(
          toSse({
            tag: "stderr",
            data: "Python runtime execution is not available in this build environment yet.",
          }),
        ),
      );
      controller.enqueue(encoder.encode(toSse({ tag: "process_exit", data: 1 })));
      controller.close();
    },
  });
}
