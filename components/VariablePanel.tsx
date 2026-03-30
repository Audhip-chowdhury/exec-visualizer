"use client";

import { useState } from "react";
import { detectKind } from "@/lib/detectDataStructure";
import { filterContainedVars } from "@/lib/filterContainedVars";
import { kindBadgeLabel, StructureViewer } from "@/components/StructureViewers";

interface VariablePanelProps {
  variables: Record<string, unknown>;
  prevVariables?: Record<string, unknown>;
}

export function VariablePanel({ variables, prevVariables }: VariablePanelProps) {
  const entries = Object.entries(filterContainedVars(variables));

  return (
    <div className="rounded border border-zinc-800 bg-zinc-900 p-3">
      <h3 className="mb-2 text-sm font-semibold">Variables</h3>
      {entries.length === 0 ? (
        <div className="text-xs text-zinc-400">No variable snapshots yet.</div>
      ) : (
        <ul className="space-y-2 text-xs">
          {entries.map(([key, value0]) => (
            <VariableRow
              key={key}
              name={key}
              value={value0}
              prevValue={prevVariables?.[key]}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function VariableRow({
  name,
  value,
  prevValue,
}: {
  name: string;
  value: unknown;
  prevValue?: unknown;
}) {
  const [open, setOpen] = useState(true);
  const kind = detectKind(value);
  const badge = kindBadgeLabel(kind, value);

  return (
    <li className="rounded border border-zinc-800/80 bg-zinc-950/40">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-2 py-1.5 text-left hover:bg-zinc-800/30"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-zinc-500">{open ? "▼" : "▶"}</span>
        <span className="font-semibold text-zinc-100">{name}</span>
        <span className="rounded-full border border-zinc-600 bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-300">
          {badge}
        </span>
      </button>
      {open && (
        <div className="border-t border-zinc-800/80 px-2 py-2">
          <StructureViewer value={value} varName={name} prevValue={prevValue} />
        </div>
      )}
    </li>
  );
}
