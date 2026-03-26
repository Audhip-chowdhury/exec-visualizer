"use client";

import { create } from "zustand";
import type { Frame, GraphEdge, GraphNode, LogEvent, SupportedLanguage } from "@/lib/types";
import { buildFrames } from "@/lib/graph/builder";

type State = {
  code: string;
  language: SupportedLanguage;
  nodes: GraphNode[];
  edges: GraphEdge[];
  events: LogEvent[];
  frames: Frame[];
  currentFrame: number;
  isPlaying: boolean;
  instrumentedCode: string | null;
  setCode: (code: string) => void;
  setLanguage: (language: SupportedLanguage) => void;
  setGraph: (nodes: GraphNode[], edges: GraphEdge[]) => void;
  appendEvent: (event: LogEvent) => void;
  rebuildFrames: () => void;
  setCurrentFrame: (index: number) => void;
  setPlaying: (value: boolean) => void;
  resetRun: () => void;
  setInstrumentedCode: (code: string | null) => void;
};

export const useExecStore = create<State>((set, get) => ({
  code: "function sum(a, b) {\n  const c = a + b;\n  return c;\n}\nsum(1, 2);\n",
  language: "javascript",
  nodes: [],
  edges: [],
  events: [],
  frames: [],
  currentFrame: 0,
  isPlaying: false,
  instrumentedCode: null,
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setGraph: (nodes, edges) => set({ nodes, edges }),
  appendEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  rebuildFrames: () => {
    const frames = buildFrames(get().events);
    set({ frames, currentFrame: 0 });
  },
  setCurrentFrame: (index) => set({ currentFrame: index }),
  setPlaying: (value) => set({ isPlaying: value }),
  resetRun: () => set({ events: [], frames: [], currentFrame: 0, isPlaying: false }),
  setInstrumentedCode: (code) => set({ instrumentedCode: code }),
}));
