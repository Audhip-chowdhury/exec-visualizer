"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface InstrumentedPanelProps {
  code: string;
  language: "javascript" | "typescript" | "python";
}

export function InstrumentedPanel({ code, language }: InstrumentedPanelProps) {
  const monacoLang = language === "python" ? "python" : "javascript";

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Instrumented Code</h2>
        <span className="rounded bg-amber-900/50 px-2 py-0.5 text-xs text-amber-300 border border-amber-700/50">
          preview — not executed
        </span>
      </div>
      <div className="h-[440px] overflow-hidden rounded border border-amber-700/40">
        <MonacoEditor
          height="100%"
          language={monacoLang}
          value={code}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            readOnly: true,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
          }}
        />
      </div>
      <p className="text-xs text-zinc-500">
        Log calls injected by the instrumenter. Click <strong>Run</strong> to execute this.
      </p>
    </div>
  );
}
