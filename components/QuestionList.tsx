"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORY_ORDER, type Question, type QuestionLevel } from "@/lib/questions";

function levelLabel(level: QuestionLevel): string {
  if (level === "easy") return "Easy";
  if (level === "medium") return "Medium";
  return "Hard";
}

function levelClass(level: QuestionLevel): string {
  if (level === "easy") return "text-emerald-400";
  if (level === "medium") return "text-amber-400";
  return "text-red-400";
}

type Props = {
  questions: Question[];
  tagCounts: Record<string, number>;
};

export function QuestionList({ questions, tagCounts }: Props) {
  const [activeTag, setActiveTag] = useState<string>("Arrays");
  const [query, setQuery] = useState("");

  const filteredQuestions = useMemo(() => {
    let list = questions.filter((q) => q.tag === activeTag);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [questions, activeTag, query]);

  return (
    <main className="flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-zinc-950 px-5 py-5 text-zinc-100 sm:px-8 sm:py-7 md:px-10 md:py-8">
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-5 sm:gap-6">
        <header className="shrink-0 space-y-2 border-b border-zinc-800 pb-5">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Problem set</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
            Pick a topic, then open a problem to visualize execution.
          </p>
        </header>

        {/* Topic categories — tag chips */}
        <nav className="shrink-0 border-b border-zinc-800 pb-5" aria-label="Question categories">
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {CATEGORY_ORDER.map((tag) => {
              const count = tagCounts[tag] ?? 0;
              const active = activeTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors sm:px-3.5 sm:py-2 sm:text-sm ${
                    active
                      ? "border-sky-500/50 bg-sky-950/70 font-medium text-sky-100 ring-1 ring-sky-500/25"
                      : "border-zinc-700/90 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  <span>{tag}</span>
                  <span
                    className={`ml-1.5 tabular-nums ${
                      active ? "text-sky-300/80" : "text-zinc-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Search */}
        <div className="relative shrink-0">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Search questions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-zinc-700 bg-zinc-900 py-2.5 pl-11 pr-5 text-sm text-zinc-100 outline-none ring-zinc-600 transition-shadow placeholder:text-zinc-500 focus:ring-2 sm:py-3"
          />
        </div>

        {/* Question list — scrolls inside remaining viewport */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-800">
          <ul className="min-h-0 flex-1 divide-y divide-zinc-800/80 overflow-y-auto">
            {filteredQuestions.length === 0 ? (
              <li className="px-6 py-12 text-center text-sm text-zinc-500">No questions match.</li>
            ) : (
              filteredQuestions.map((item, idx) => (
                <li
                  key={item.id}
                  className={`transition-colors hover:bg-zinc-800/40 ${
                    idx % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/30"
                  }`}
                >
                  <Link
                    href={`/problems/${encodeURIComponent(item.id)}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-sm text-zinc-500">{item.id}.</span>{" "}
                      <span className="font-medium text-zinc-100">{item.title}</span>
                    </div>
                    <span className={`shrink-0 text-sm font-medium ${levelClass(item.level)}`}>
                      {levelLabel(item.level)}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
