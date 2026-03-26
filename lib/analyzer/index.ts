import type { AnalyzeResult, SupportedLanguage } from "@/lib/types";
import { analyzeJavaScript } from "@/lib/analyzer/js";
import { analyzePython } from "@/lib/analyzer/python";

export async function analyzeCode(
  code: string,
  language: SupportedLanguage,
): Promise<AnalyzeResult> {
  if (language === "python") return analyzePython(code);
  return analyzeJavaScript(code, language);
}
