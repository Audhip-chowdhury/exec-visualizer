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
    <div className="flex h-full min-h-0 flex-col gap-2 text-zinc-100">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-100">Instrumented Code</h2>
        <span className="rounded border border-amber-700/50 bg-amber-950/60 px-2 py-0.5 text-xs text-amber-200">
          preview — not executed
        </span>
      </div>
      <div className="min-h-[200px] flex-1 overflow-hidden rounded border border-amber-800/40">
        <MonacoEditor
          height="100%"
          theme="vs-dark"
          language={monacoLang}
          value={code}
          loading={
            <div className="flex h-full min-h-[200px] items-center justify-center bg-[#1e1e1e] text-zinc-400">
              Loading…
            </div>
          }
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            readOnly: true,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
      <p className="text-xs text-zinc-400">
        Log calls injected by the instrumenter. Click <strong className="text-zinc-200">Compile</strong> to execute
        this.
      </p>
    </div>
  );
}
