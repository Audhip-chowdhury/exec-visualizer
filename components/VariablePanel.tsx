"use client";

interface VariablePanelProps {
  variables: Record<string, unknown>;
}

export function VariablePanel({ variables }: VariablePanelProps) {
  const entries = Object.entries(variables);
  return (
    <div className="rounded border border-zinc-800 bg-zinc-900 p-3">
      <h3 className="mb-2 text-sm font-semibold">Variables</h3>
      {entries.length === 0 ? (
        <div className="text-xs text-zinc-400">No variable snapshots yet.</div>
      ) : (
        <ul className="space-y-1 text-xs">
          {entries.map(([key, value]) => (
            <li key={key}>
              <span className="font-semibold">{key}</span>: {JSON.stringify(value)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
