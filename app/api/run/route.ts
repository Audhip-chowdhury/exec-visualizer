import { executeCode } from "@/lib/executor";
import { instrumentCode } from "@/lib/instrumenter";
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
    const instrumented = await instrumentCode(code, language);
    const stream = executeCode(instrumented, language);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Run failed" },
      { status: 400 },
    );
  }
}
