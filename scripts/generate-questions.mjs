import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Parse MySQL INSERT VALUES: rows of 8 single-quoted fields ('' = escaped ') */
function parseInsertValues(sql) {
  const valuesIdx = sql.indexOf("VALUES");
  if (valuesIdx === -1) throw new Error("No VALUES in SQL");
  let i = sql.indexOf("(", valuesIdx);
  if (i === -1) throw new Error("No opening paren after VALUES");
  const rows = [];

  function readQuotedString() {
    if (sql[i] !== "'") throw new Error(`Expected ' at ${i}`);
    i++;
    let s = "";
    while (i < sql.length) {
      const c = sql[i];
      if (c === "'") {
        if (sql[i + 1] === "'") {
          s += "'";
          i += 2;
          continue;
        }
        i++;
        return s;
      }
      s += c;
      i++;
    }
    throw new Error("Unterminated string");
  }

  while (i < sql.length) {
    while (i < sql.length && /[\s,]/.test(sql[i])) i++;
    if (i >= sql.length || sql[i] === ";") break;
    if (sql[i] !== "(") {
      i++;
      continue;
    }
    i++;
    const fields = [];
    for (let f = 0; f < 8; f++) {
      while (sql[i] === " " || sql[i] === "\n" || sql[i] === "\r" || sql[i] === "\t") i++;
      fields.push(readQuotedString());
      while (sql[i] === " " || sql[i] === "\n" || sql[i] === "\r" || sql[i] === "\t") i++;
      if (f < 7) {
        if (sql[i] !== ",") throw new Error(`Expected , after field ${f} at ${i}, got ${JSON.stringify(sql.slice(i, i + 20))}`);
        i++;
      }
    }
    rows.push(fields);
    while (sql[i] === " " || sql[i] === "\n" || sql[i] === "\r" || sql[i] === "\t") i++;
    if (sql[i] !== ")") throw new Error(`Expected ) at ${i}`);
    i++;
  }
  return rows.map(([id, title, description, level, tag, hint, boilerplate, test_cases]) => ({
    id,
    title,
    description,
    level,
    tag,
    hint: hint || null,
    boilerplate,
    test_cases,
  }));
}

const sqlPath =
  process.argv[2] ||
  path.join(__dirname, "..", "data", "insert_questions.sql");

const outPath = path.join(__dirname, "..", "lib", "questions.ts");

const sql = fs.readFileSync(sqlPath, "utf8");
const questions = parseInsertValues(sql);

const header = `/**
 * DSA question bank — generated from insert_questions.sql (109 questions).
 * Do not edit by hand; regenerate with: node scripts/generate-questions.mjs [path-to.sql]
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

export const QUESTIONS: Question[] = `;

function escapeTemplate(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

const body =
  "[\n" +
  questions
    .map((q) => {
      const parts = [
        `    {`,
        `      id: ${JSON.stringify(q.id)},`,
        `      title: ${JSON.stringify(q.title)},`,
        `      description: ${JSON.stringify(q.description)},`,
        `      level: ${JSON.stringify(q.level)} as QuestionLevel,`,
        `      tag: ${JSON.stringify(q.tag)},`,
        `      hint: ${q.hint === null ? "null" : JSON.stringify(q.hint)},`,
        `      boilerplate: \`${escapeTemplate(q.boilerplate)}\`,`,
        `      test_cases: ${JSON.stringify(q.test_cases)},`,
        `    },`,
      ];
      return parts.join("\n");
    })
    .join("\n") +
  "\n  ];\n\n";

const footer = `export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q])
);

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

export function questionsByTag(tag: string): Question[] {
  return QUESTIONS.filter((q) => q.tag === tag);
}

export function countByTag(): Map<string, number> {
  const m = new Map<string, number>();
  for (const q of QUESTIONS) {
    m.set(q.tag, (m.get(q.tag) ?? 0) + 1);
  }
  return m;
}
`;

fs.writeFileSync(outPath, header + body + footer, "utf8");
console.log(`Wrote ${questions.length} questions to ${outPath}`);
