export type SupportedLanguage = "javascript" | "typescript" | "python";

export type LogTag =
  | "fn_enter"
  | "fn_exit"
  | "loop_iter"
  | "branch"
  | "branch_else"
  | "var_assign"
  | "call";

export interface LogEvent {
  id: string;
  tag: LogTag;
  data?: unknown;
  name?: string;
  seq: number;
}

export interface GraphNode {
  id: string;
  label: string;
  name: string;
  tag: LogTag;
  parentId: string | null;
  startLine: number;
  endLine: number;
  startIndex: number;
  endIndex: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface AnalyzeResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Frame {
  seq: number;
  activeNodeId: string | null;
  event: LogEvent | null;
  variables: Record<string, unknown>;
}
