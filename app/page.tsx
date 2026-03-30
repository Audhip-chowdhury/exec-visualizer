"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CATEGORY_ORDER,
  countByTag,
  questionsByTag,
  type Question,
  type QuestionLevel,
} from "@/lib/questions";

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

export default function Home() {
  const tagCounts = useMemo(() => countByTag(), []);
  const [activeTag, setActiveTag] = useState<string>("Arrays");
  const [query, setQuery] = useState("");

  const filteredQuestions = useMemo(() => {
    let list: Question[] = questionsByTag(activeTag);
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
  }, [activeTag, query]);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6">
        <header className="flex flex-col gap-1 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <h1 className="text-xl font-semibold tracking-tight">Problem set</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Pick a topic, then open a problem to visualize execution.
          </p>
        </header>

        {/* Topic tabs — LeetCode-style horizontal scroll */}
        <div className="-mx-4 overflow-x-auto px-4 pb-1">
          <div className="flex min-w-max gap-6 border-b border-zinc-200 dark:border-zinc-800">
            {CATEGORY_ORDER.map((tag) => {
              const count = tagCounts.get(tag) ?? 0;
              const active = activeTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={`shrink-0 border-b-2 pb-2 text-sm transition-colors ${
                    active
                      ? "border-zinc-900 font-medium text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                      : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
                  }`}
                >
                  <span>{tag}</span>
                  <span className="ml-1.5 text-zinc-400 dark:text-zinc-500">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
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
            className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm outline-none ring-zinc-400 transition-shadow focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
          />
        </div>

        {/* Question list */}
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {filteredQuestions.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-zinc-500">No questions match.</li>
            ) : (
              filteredQuestions.map((item, idx) => (
                <li
                  key={item.id}
                  className={`transition-colors hover:bg-zinc-100/80 dark:hover:bg-zinc-900/50 ${
                    idx % 2 === 0
                      ? "bg-white dark:bg-zinc-950"
                      : "bg-zinc-50/80 dark:bg-zinc-900/30"
                  }`}
                >
                  <Link
                    href={`/problems/${encodeURIComponent(item.id)}`}
                    className="flex items-center justify-between gap-4 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-sm text-zinc-400 dark:text-zinc-500">{item.id}.</span>{" "}
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.title}</span>
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
