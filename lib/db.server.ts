import Database from "better-sqlite3";
import path from "node:path";
import type { Question, QuestionLevel } from "./questions";

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    const dbPath = path.join(process.cwd(), "data", "questions.db");
    _db = new Database(dbPath, { readonly: true });
  }
  return _db;
}

type DbRow = {
  id: string;
  title: string;
  description: string;
  level: string;
  tag: string;
  hint: string | null;
  boilerplate: string | null;
  test_cases: string | null;
};

function rowToQuestion(row: DbRow): Question {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    level: row.level as QuestionLevel,
    tag: row.tag,
    hint: row.hint ?? null,
    boilerplate: row.boilerplate ?? "",
    test_cases: row.test_cases ?? "[]",
  };
}

export function getAllQuestions(): Question[] {
  const rows = getDb()
    .prepare("SELECT * FROM question_bank ORDER BY id")
    .all() as DbRow[];
  return rows.map(rowToQuestion);
}

export function getQuestionById(id: string): Question | null {
  const row = getDb()
    .prepare("SELECT * FROM question_bank WHERE id = ?")
    .get(id) as DbRow | undefined;
  return row ? rowToQuestion(row) : null;
}

export function getQuestionsByTag(tag: string): Question[] {
  const rows = getDb()
    .prepare("SELECT * FROM question_bank WHERE tag = ? ORDER BY id")
    .all(tag) as DbRow[];
  return rows.map(rowToQuestion);
}

export function countByTagFromDb(): Map<string, number> {
  const rows = getDb()
    .prepare("SELECT tag, COUNT(*) as count FROM question_bank GROUP BY tag")
    .all() as { tag: string; count: number }[];
  return new Map(rows.map((r) => [r.tag, r.count]));
}
