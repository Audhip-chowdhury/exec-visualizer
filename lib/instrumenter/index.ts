import type { SupportedLanguage } from "@/lib/types";
import { instrumentJavaScript } from "@/lib/instrumenter/js";
import { instrumentPython } from "@/lib/instrumenter/python";

export async function instrumentCode(
  code: string,
  language: SupportedLanguage,
): Promise<string> {
  if (language === "python") return instrumentPython(code);
  return instrumentJavaScript(code);
}
