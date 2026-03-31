"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import type * as Monaco from "monaco-editor";
import type { GraphNode, SupportedLanguage } from "@/lib/types";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface EditorProps {
  code: string;
  language: SupportedLanguage;
  highlightedLine?: number;
  analyzedNodes?: GraphNode[];
  onCodeChange: (value: string) => void;
  onLanguageChange: (value: SupportedLanguage) => void;
}

export function Editor({
  code,
  language,
  highlightedLine,
  analyzedNodes,
  onCodeChange,
  onLanguageChange,
}: EditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const activeDecorRef = useRef<string[]>([]);
  const nodeDecorRef = useRef<string[]>([]);

  // Highlight the active execution line (green)
  useEffect(() => {
    if (!editorRef.current) return;
    activeDecorRef.current = editorRef.current.deltaDecorations(
      activeDecorRef.current,
      highlightedLine
        ? [
            {
              range: {
                startLineNumber: highlightedLine,
                startColumn: 1,
                endLineNumber: highlightedLine,
                endColumn: 1,
              },
              options: { isWholeLine: true, className: "exec-active-line" },
            },
          ]
        : [],
    );
  }, [highlightedLine]);

  // Highlight all analyzed nodes (blue gutter + light background)
  useEffect(() => {
    if (!editorRef.current) return;
    const decorations =
      analyzedNodes?.map((node) => ({
        range: {
          startLineNumber: node.startLine,
          startColumn: 1,
          endLineNumber: node.endLine,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: "exec-analyzed-node",
          linesDecorationsClassName: "exec-analyzed-gutter",
          hoverMessage: { value: `**${node.tag}** \`${node.label}\`` },
        },
      })) ?? [];
    nodeDecorRef.current = editorRef.current.deltaDecorations(nodeDecorRef.current, decorations);
  }, [analyzedNodes]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-2">
      <div className="flex shrink-0 items-center justify-between">
        <h2 className="text-sm font-semibold">Source</h2>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
          className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
        </select>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden rounded border border-zinc-700">
        <MonacoEditor
          height="100%"
          theme="vs-dark"
          language={language === "python" ? "python" : "javascript"}
          value={code}
          loading={
            <div className="flex h-full min-h-[120px] items-center justify-center bg-[#1e1e1e] text-zinc-400">
              Loading editor…
            </div>
          }
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            automaticLayout: true,
            lineNumbersMinChars: 3,
          }}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          onChange={(value) => onCodeChange(value ?? "")}
        />
      </div>
      <div className="shrink-0 text-xs text-zinc-400">
        Active line: {highlightedLine ? highlightedLine : "-"}
      </div>
    </div>
  );
}
