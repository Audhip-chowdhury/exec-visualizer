import type { LogTag } from "@/lib/types";

export function createNodeId(
  tag: LogTag,
  startIndex: number,
  endIndex: number,
  label?: string,
  scope?: string,
): string {
  const safeScope = (scope ?? "").replaceAll(/[^a-zA-Z0-9._-]/g, "_");
  const safeLabel = (label ?? "").replaceAll(/[^a-zA-Z0-9._-]/g, "_");
  const scopePart = safeScope.length > 0 ? safeScope : "root";
  return `n_${tag}:${scopePart}:${startIndex}-${endIndex}:${safeLabel}`;
}

export function edgeId(source: string, target: string): string {
  return `e_${source}_${target}`;
}
