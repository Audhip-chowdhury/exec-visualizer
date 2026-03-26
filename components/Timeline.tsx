"use client";

interface TimelineProps {
  current: number;
  total: number;
  onSeek: (index: number) => void;
}

export function Timeline({ current, total, onSeek }: TimelineProps) {
  return (
    <div className="flex flex-col gap-2 rounded border border-zinc-800 bg-zinc-900 p-3">
      <div className="text-sm">
        Frame: {total === 0 ? 0 : current + 1}/{total}
      </div>
      <input
        type="range"
        min={0}
        max={Math.max(0, total - 1)}
        value={Math.min(current, Math.max(0, total - 1))}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="w-full accent-emerald-500"
      />
    </div>
  );
}
