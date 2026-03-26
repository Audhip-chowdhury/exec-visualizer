import type { Frame, LogEvent } from "@/lib/types";

export function buildFrames(events: LogEvent[]): Frame[] {
  const variables: Record<string, unknown> = {};
  const frames: Frame[] = [];

  for (const event of events.sort((a, b) => a.seq - b.seq)) {
    if (event.tag === "var_assign") {
      const key = event.name ?? event.id;
      variables[key] = event.data;
    }
    frames.push({
      seq: event.seq,
      activeNodeId: event.id,
      event,
      variables: { ...variables },
    });
  }

  return frames;
}
