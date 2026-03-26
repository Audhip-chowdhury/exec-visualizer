"use client";

interface ControlBarProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
}

export function ControlBar({
  isPlaying,
  onPlayPause,
  onStepBack,
  onStepForward,
}: ControlBarProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm hover:bg-zinc-800"
        onClick={onPlayPause}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <button
        className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm hover:bg-zinc-800"
        onClick={onStepBack}
      >
        Step -
      </button>
      <button
        className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm hover:bg-zinc-800"
        onClick={onStepForward}
      >
        Step +
      </button>
    </div>
  );
}
