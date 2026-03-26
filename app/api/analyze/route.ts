import { analyzeCode } from "@/lib/analyzer";
import type { SupportedLanguage } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as {
      code?: string;
      language?: SupportedLanguage;
    };
    const code = body.code ?? "";
    const language = body.language ?? "javascript";
    const result = await analyzeCode(code, language);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Analyze failed" },
      { status: 400 },
    );
  }
}
