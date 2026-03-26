import type { SupportedLanguage } from "@/lib/types";
import { executeJavaScript } from "@/lib/executor/js";
import { executePython } from "@/lib/executor/python";

export function executeCode(
  instrumentedCode: string,
  language: SupportedLanguage,
): ReadableStream<Uint8Array> {
  if (language === "python") return executePython(instrumentedCode);
  return executeJavaScript(instrumentedCode);
}
