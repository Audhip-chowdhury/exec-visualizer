/**
 * DSA question bank — types and constants.
 * Question data is served from data/questions.db (SQLite).
 * To reseed: npm run db:seed
 */

export type QuestionLevel = "easy" | "medium" | "hard";

export type Question = {
  id: string;
  title: string;
  description: string;
  level: QuestionLevel;
  tag: string;
  hint: string | null;
  boilerplate: string;
  /** Raw JSON string of test cases (array of objects) */
  test_cases: string;
};

/** Tab order: Arrays first, then remaining tags alphabetically */
export const CATEGORY_ORDER = [
  "Arrays",
  "Linked List",
  "Stack & Queue",
  "Strings",
  "Binary Search",
  "Recursion",
  "Backtracking",
  "Greedy",
  "Heaps",
  "Binary Tree",
  "BST",
  "Dynamic Programming",
  "Trie",
  "Sorting Algorithms",
  "Two Pointers",
  "Sliding Window",
  "Hashing",
  "Math & Basic Problems",
  "Graphs",
] as const;
